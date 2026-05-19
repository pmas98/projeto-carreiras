"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Plus,
  Trash2,
  RotateCcw,
  ChevronDown,
  CheckCircle2,
  Clock,
  Info,
  Key,
  FileJson,
  X,
} from "lucide-react";
import { TaskShell } from "@/components/frontend/TaskShell";
import { EducationalTooltip } from "@/components/frontend/EducationalTooltip";
import { useTaskValidation } from "@/hooks/useTaskValidation";
import { useProgressStore } from "@/store/useProgressStore";
import { GuidedTutorialOverlay } from "@/components/tutorial/GuidedTutorialOverlay";
import { useGuidedTutorial } from "@/hooks/useGuidedTutorial";
import { NetworkVisualizer } from "../NetworkVisualizer";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Header = { id: number; key: string; value: string };
type ActiveTab = "headers" | "body";

type ResponseData = {
  status: number;
  statusText: string;
  timeMs: number;
  body: string;
};

const TARGET_URL = "https://api.loja.dev/v1/auth/login";
const TARGET_EMAIL = "dev@loja.dev";
const TARGET_PASSWORD = "senha123";

const MOCK_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
  ".eyJzdWIiOiI0MiIsImVtYWlsIjoiZGV2QGxvamEuZGV2Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE3MDEyMDAwLCJleHAiOjE3MTcwOTg0MDB9" +
  ".SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const JWT_DECODED = {
  header: JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2),
  payload: JSON.stringify(
    {
      sub: "42",
      email: "dev@loja.dev",
      role: "admin",
      iat: 1717012000,
      exp: 1717098400,
    },
    null,
    2
  ),
};

const METHOD_COLORS: Record<Method, string> = {
  GET: "text-emerald-600 dark:text-emerald-400",
  POST: "text-amber-600 dark:text-amber-400",
  PUT: "text-blue-600 dark:text-blue-400",
  PATCH: "text-purple-600 dark:text-purple-400",
  DELETE: "text-red-600 dark:text-red-400",
};

const METHOD_BG: Record<Method, string> = {
  GET: "bg-emerald-50 dark:bg-emerald-900/20",
  POST: "bg-amber-50 dark:bg-amber-900/20",
  PUT: "bg-blue-50 dark:bg-blue-900/20",
  PATCH: "bg-purple-50 dark:bg-purple-900/20",
  DELETE: "bg-red-50 dark:bg-red-900/20",
};

type TooltipInfo = { title: string; content: string; hint?: string };

const DEFINITIONS: Record<string, TooltipInfo> = {
  post: {
    title: "Por que usar POST aqui?",
    content:
      "POST envia dados ao servidor para criar ou processar algo. No login, você envia suas credenciais (email/senha) no corpo da requisição — ao contrário do GET, que só busca dados.",
    hint: "Use POST para autenticação. GET nunca deve transportar senhas, pois a URL fica visível em logs.",
  },
  contentType: {
    title: "O que é Content-Type?",
    content:
      "O header Content-Type avisa o servidor em qual formato o corpo da requisição está. 'application/json' diz que o body é um JSON válido.",
    hint: "Sem esse header, o servidor não sabe como interpretar o body e retorna 415 Unsupported Media Type.",
  },
  body: {
    title: "O que é o Body da requisição?",
    content:
      "O body (corpo) é o conteúdo enviado junto com a requisição. Em requisições POST/PUT, você usa o body para enviar dados — como credenciais em um login.",
    hint: "O body deve ser um JSON válido: chaves entre aspas duplas, sem vírgula no último item.",
  },
  jwt: {
    title: "O que é um JWT?",
    content:
      "JSON Web Token é uma forma compacta de representar informações de forma segura. Tem 3 partes separadas por ponto: Header (algoritmo), Payload (dados do usuário) e Signature (verificação). O servidor gera e assina o token — o cliente apenas o armazena e reenvia.",
    hint: "O payload é apenas codificado em base64, não criptografado. Nunca coloque senha em um JWT.",
  },
};

function parseBody(raw: string): { valid: boolean; email: string; password: string } {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      valid: true,
      email: typeof parsed.email === "string" ? parsed.email.trim() : "",
      password: typeof parsed.password === "string" ? parsed.password.trim() : "",
    };
  } catch {
    return { valid: false, email: "", password: "" };
  }
}

function getMockResponse(
  method: Method,
  url: string,
  headers: Header[],
  body: string
): ResponseData {
  const urlMatch = url.trim().toLowerCase() === TARGET_URL.toLowerCase();
  const methodMatch = method === "POST";
  const hasContentType = headers.some(
    (h) =>
      h.key.trim().toLowerCase() === "content-type" &&
      h.value.trim().toLowerCase().includes("application/json")
  );

  if (!urlMatch) {
    return {
      status: 404,
      statusText: "Not Found",
      timeMs: Math.floor(Math.random() * 40 + 30),
      body: JSON.stringify({ error: "Not Found", message: "Endpoint não existe." }, null, 2),
    };
  }

  if (!methodMatch) {
    return {
      status: 405,
      statusText: "Method Not Allowed",
      timeMs: Math.floor(Math.random() * 30 + 20),
      body: JSON.stringify(
        { error: "Method Not Allowed", message: "Use POST para autenticação." },
        null,
        2
      ),
    };
  }

  if (!hasContentType) {
    return {
      status: 415,
      statusText: "Unsupported Media Type",
      timeMs: Math.floor(Math.random() * 40 + 30),
      body: JSON.stringify(
        {
          error: "Unsupported Media Type",
          message: "Header obrigatório ausente: Content-Type: application/json",
        },
        null,
        2
      ),
    };
  }

  const parsed = parseBody(body);

  if (!parsed.valid || !parsed.email || !parsed.password) {
    return {
      status: 422,
      statusText: "Unprocessable Entity",
      timeMs: Math.floor(Math.random() * 40 + 35),
      body: JSON.stringify(
        {
          error: "Unprocessable Entity",
          message: "O body deve conter os campos 'email' e 'password' preenchidos.",
        },
        null,
        2
      ),
    };
  }

  if (parsed.email !== TARGET_EMAIL || parsed.password !== TARGET_PASSWORD) {
    return {
      status: 401,
      statusText: "Unauthorized",
      timeMs: Math.floor(Math.random() * 60 + 40),
      body: JSON.stringify(
        { error: "Unauthorized", message: "Credenciais inválidas." },
        null,
        2
      ),
    };
  }

  return {
    status: 200,
    statusText: "OK",
    timeMs: Math.floor(Math.random() * 80 + 120),
    body: JSON.stringify({ token: MOCK_JWT, type: "Bearer", expiresIn: 86400 }, null, 2),
  };
}

function statusColor(status: number) {
  if (status < 300)
    return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
  if (status < 400)
    return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
  return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
}

let nextHeaderId = 100;

const BODY_TEMPLATE = `{\n  "email": "",\n  "password": ""\n}`;

export function AuthTask() {
  const [method, setMethod] = useState<Method>("POST");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Header[]>([
    { id: nextHeaderId++, key: "", value: "" },
  ]);
  const [body, setBody] = useState(BODY_TEMPLATE);
  const [activeTab, setActiveTab] = useState<ActiveTab>("body");
  const [methodOpen, setMethodOpen] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [jwtSection, setJwtSection] = useState<"header" | "payload" | null>(null);
  const [showModal, setShowModal] = useState(true);
  const [responseTab, setResponseTab] = useState<"visual" | "json">("visual");
  const resetTask = useProgressStore((s) => s.resetTask);
  const router = useRouter();
  const tutorial = useGuidedTutorial("backend_auth");

  const parsedBody = parseBody(body);
  const hasContentType = headers.some(
    (h) =>
      h.key.trim().toLowerCase() === "content-type" &&
      h.value.trim().toLowerCase().includes("application/json")
  );

  const { isComplete } = useTaskValidation({
    taskId: "backend_auth",
    currentState: { method, url, headers, body, responseStatus: response?.status },
    validate: (s) => s.responseStatus === 200,
  });

  useEffect(() => {
    if (!isComplete || response) return;
    const saved = localStorage.getItem("resp_backend_auth");
    if (!saved) return;
    try {
      setResponse(JSON.parse(saved) as ResponseData);
      setResponseTab("json");
    } catch {}
  }, [isComplete, response]);

  const handleSend = useCallback(() => {
    if (!url.trim()) return;
    setIsSending(true);
    setResponse(null);
    setJwtSection(null);

    setTimeout(() => {
      const result = getMockResponse(method, url, headers, body);
      setResponse(result);
      if (result.status === 200) {
        setResponseTab("json");
        try { localStorage.setItem("resp_backend_auth", JSON.stringify(result)); } catch {}
      }
      setIsSending(false);
    }, 700);
  }, [method, url, headers, body]);

  const addHeader = () =>
    setHeaders((prev) => [...prev, { id: nextHeaderId++, key: "", value: "" }]);

  const removeHeader = (id: number) =>
    setHeaders((prev) => prev.filter((h) => h.id !== id));

  const updateHeader = (id: number, field: "key" | "value", val: string) =>
    setHeaders((prev) => prev.map((h) => (h.id === id ? { ...h, [field]: val } : h)));

  const handleReset = () => {
    setMethod("POST");
    setUrl("");
    setHeaders([{ id: nextHeaderId++, key: "", value: "" }]);
    setBody(BODY_TEMPLATE);
    setResponse(null);
    setJwtSection(null);
    setShowModal(true);
    setResponseTab("visual");
    try { localStorage.removeItem("resp_backend_auth"); } catch {}
    resetTask("backend_auth");
  };

  const isJwtResponse = response?.status === 200;
  const jwtParts = MOCK_JWT.split(".");

  return (
    <TaskShell
      title="Autenticação"
      subtitle="Construa um payload POST para obter um token JWT."
      backHref="/backend"
      onHelpClick={() => setHelpOpen(true)}
      onReplayTutorial={tutorial.start}
    >
      <div className="flex flex-1 flex-col lg:flex-row h-full overflow-hidden">
        {/* Brief sidebar */}
        <aside className="w-full lg:w-72 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 overflow-y-auto shrink-0">
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Contexto
              </span>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Os endpoints de escrita da API são protegidos. Para criar um produto você precisa
                de um <strong className="text-zinc-900 dark:text-zinc-100">JWT</strong>. Obtenha-o
                autenticando-se no endpoint de login.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50 p-4 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Documentação da API
              </span>
              <div className="space-y-2">
                <DocRow label="Método" value="POST" accent="amber" />
                <DocRow label="URL" value={TARGET_URL} accent="zinc" mono />
                <DocRow label="Header" value="Content-Type: application/json" accent="blue" mono />
                <DocRow label="Body" value={`{ "email": "${TARGET_EMAIL}", "password": "${TARGET_PASSWORD}" }`} accent="zinc" mono />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Checklist
              </span>
              <ul className="mt-2 space-y-2">
                <CheckItem
                  done={method === "POST"}
                  label="Método: POST"
                  onInfo={() => setTooltip(DEFINITIONS.post)}
                />
                <CheckItem
                  done={url.trim().toLowerCase() === TARGET_URL.toLowerCase()}
                  label="URL correta"
                  onInfo={() => setTooltip(DEFINITIONS.post)}
                />
                <CheckItem
                  done={hasContentType}
                  label="Header Content-Type: application/json"
                  onInfo={() => setTooltip(DEFINITIONS.contentType)}
                />
                <CheckItem
                  done={
                    parsedBody.valid &&
                    parsedBody.email === TARGET_EMAIL &&
                    parsedBody.password === TARGET_PASSWORD
                  }
                  label="Body com credenciais corretas"
                  onInfo={() => setTooltip(DEFINITIONS.body)}
                />
                <CheckItem
                  done={response?.status === 200}
                  label="Resposta 200 com JWT"
                  onInfo={() => setTooltip(DEFINITIONS.jwt)}
                />
              </ul>
            </div>
          </div>
        </aside>

        {/* Main workspace */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Request builder */}
          <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-3">
            {/* Method + URL + Send */}
            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setMethodOpen((o) => !o)}
                  className={`flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm font-bold transition hover:bg-zinc-50 dark:hover:bg-zinc-900 ${METHOD_COLORS[method]} ${METHOD_BG[method]}`}
                >
                  {method}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
                <AnimatePresence>
                  {methodOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      className="absolute left-0 top-12 z-20 w-36 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg overflow-hidden"
                    >
                      {(["GET", "POST", "PUT", "PATCH", "DELETE"] as Method[]).map((m) => (
                        <button
                          key={m}
                          onClick={() => { setMethod(m); setMethodOpen(false); }}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold transition hover:bg-zinc-50 dark:hover:bg-zinc-900 ${METHOD_COLORS[m]}`}
                        >
                          {m}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.loja.dev/v1/auth/login"
                className="h-10 flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 font-mono text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <button
                onClick={handleSend}
                disabled={isSending || !url.trim()}
                className="flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              >
                <Send className="h-4 w-4" />
                {isSending ? "Enviando…" : "Enviar"}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-zinc-100 dark:border-zinc-900">
              {(["headers", "body"] as ActiveTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
                      : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  }`}
                >
                  {tab === "body" ? (
                    <span className="flex items-center gap-1.5">
                      <FileJson className="h-3.5 w-3.5" />
                      Body
                    </span>
                  ) : (
                    "Headers"
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "headers" && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Headers
                  </span>
                  <button
                    onClick={() => setTooltip(DEFINITIONS.contentType)}
                    className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Info className="h-3 w-3" />
                    O que é Content-Type?
                  </button>
                </div>
                {headers.map((header) => (
                  <div key={header.id} className="flex gap-2">
                    <input
                      type="text"
                      value={header.key}
                      onChange={(e) => updateHeader(header.id, "key", e.target.value)}
                      placeholder="Chave (ex: Content-Type)"
                      className="h-8 w-2/5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) => updateHeader(header.id, "value", e.target.value)}
                      placeholder="Valor (ex: application/json)"
                      className="h-8 flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                    <button
                      onClick={() => removeHeader(header.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-900"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addHeader}
                  className="mt-1 flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-700 dark:hover:border-zinc-600 dark:hover:text-zinc-300"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar Header
                </button>
              </div>
            )}

            {activeTab === "body" && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <FileJson className="h-3.5 w-3.5" />
                    JSON Body
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTooltip(DEFINITIONS.body)}
                      className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Info className="h-3 w-3" />
                      O que é isso?
                    </button>
                    <button
                      onClick={() => setBody(BODY_TEMPLATE)}
                      className="text-[10px] text-zinc-500 dark:text-zinc-400 hover:underline"
                    >
                      Resetar template
                    </button>
                  </div>
                </div>
                <textarea
                  data-tutorial="backend-auth-payload"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  spellCheck={false}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 px-4 py-3 font-mono text-xs text-emerald-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 resize-none leading-relaxed"
                />
                {body.trim() && !parsedBody.valid && (
                  <p className="text-[11px] text-red-500 dark:text-red-400 flex items-center gap-1">
                    <span className="font-bold">⚠</span> JSON inválido — verifique vírgulas e aspas duplas.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Response panel */}
          <div className="flex flex-1 flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-900/50">
            {/* Tab switchers if response or initial */}
            {!isSending && (
              <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-1.5 gap-2">
                <button
                  onClick={() => setResponseTab("visual")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                    responseTab === "visual"
                      ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  }`}
                >
                  Fluxo de Rede (Visual)
                </button>
                <button
                  onClick={() => setResponseTab("json")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                    responseTab === "json"
                      ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  }`}
                >
                  JSON da Resposta (Dados)
                </button>
              </div>
            )}

            {isSending && (
              <div className="flex flex-1 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-6 w-6 rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-600 dark:border-t-zinc-200"
                />
              </div>
            )}

            {!isSending && responseTab === "visual" && (
              <NetworkVisualizer
                method={method}
                url={url}
                headers={headers}
                body={body}
                response={response}
                isSending={isSending}
                taskId="backend_auth"
              />
            )}

            {!isSending && responseTab === "json" && (
              <>
                {!response ? (
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-sm text-zinc-400 dark:text-zinc-600">
                      A resposta aparecerá aqui após enviar a requisição.
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-1 flex-col overflow-hidden p-4 gap-3"
                  >
                    {/* Status bar */}
                    <div className="flex items-center gap-3">
                      <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${statusColor(response.status)}`}>
                        {response.status} {response.statusText}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {response.timeMs}ms
                      </span>
                      {response.status === 200 && (
                        <button
                          onClick={() => setTooltip(DEFINITIONS.jwt)}
                          className="ml-auto text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <Info className="h-3 w-3" />
                          O que é um JWT?
                        </button>
                      )}
                    </div>

                    {/* JWT Decoder (only on success) */}
                    {isJwtResponse ? (
                      <div className="flex flex-1 flex-col gap-3 overflow-auto">
                        <div data-tutorial="backend-auth-token" className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Key className="h-4 w-4 text-amber-500" />
                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">
                              Token JWT recebido
                            </span>
                            <span className="ml-auto text-[10px] text-zinc-400">
                              Clique em uma parte para decodificar
                            </span>
                          </div>

                          {/* JWT visual — 3 clickable parts */}
                          <div className="flex flex-wrap gap-0.5 font-mono text-[11px] leading-relaxed break-all">
                            <button
                              onClick={() => setJwtSection((s) => (s === "header" ? null : "header"))}
                              className={`rounded px-1 py-0.5 transition ${
                                jwtSection === "header"
                                  ? "bg-rose-500 text-white"
                                  : "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300"
                              }`}
                            >
                              {jwtParts[0]}
                            </button>
                            <span className="text-zinc-400">.</span>
                            <button
                              onClick={() => setJwtSection((s) => (s === "payload" ? null : "payload"))}
                              className={`rounded px-1 py-0.5 transition ${
                                jwtSection === "payload"
                                  ? "bg-violet-500 text-white"
                                  : "bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300"
                              }`}
                            >
                              {jwtParts[1]}
                            </button>
                            <span className="text-zinc-400">.</span>
                            <span className="rounded px-1 py-0.5 bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 cursor-default">
                              {jwtParts[2]}
                            </span>
                          </div>

                          {/* Decoded section */}
                          <AnimatePresence>
                            {jwtSection && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className={`mt-3 rounded-lg p-3 ${jwtSection === "header" ? "bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800" : "bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800"}`}>
                                  <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${jwtSection === "header" ? "text-rose-600 dark:text-rose-400" : "text-violet-600 dark:text-violet-400"}`}>
                                    {jwtSection === "header" ? "Header — algoritmo e tipo" : "Payload — dados do usuário (base64, não criptografado)"}
                                  </div>
                                  <pre className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                                    {jwtSection === "header" ? JWT_DECODED.header : JWT_DECODED.payload}
                                  </pre>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {!jwtSection && (
                            <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-center">
                              <div className="rounded-lg bg-rose-50 dark:bg-rose-900/20 p-2 text-rose-700 dark:text-rose-300">
                                <div className="font-bold">Header</div>
                                <div className="text-rose-500 dark:text-rose-400">Algoritmo</div>
                              </div>
                              <div className="rounded-lg bg-violet-50 dark:bg-violet-900/20 p-2 text-violet-700 dark:text-violet-300">
                                <div className="font-bold">Payload</div>
                                <div className="text-violet-500 dark:text-violet-400">Dados do user</div>
                              </div>
                              <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-2 text-zinc-500 dark:text-zinc-400">
                                <div className="font-bold">Signature</div>
                                <div>Verificação</div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-auto">
                          <pre className="p-4 text-[11px] leading-relaxed font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                            {response.body}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <pre className="p-4 text-[11px] leading-relaxed font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-words">
                          {response.body}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen success overlay */}
      <AnimatePresence>
        {isComplete && showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-2xl text-center max-w-sm w-full mx-4"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/50">
                <Key size={32} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">JWT em mãos!</h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Token gerado com sucesso. Guarde-o para a próxima tarefa.</p>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  <RotateCcw size={16} />
                  Repetir
                </button>
                <button
                  onClick={() => router.push("/backend/backend_data_fetching")}
                  className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                >
                  Acessar próxima tarefa →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EducationalTooltip
        isOpen={tooltip !== null}
        onClose={() => setTooltip(null)}
        title={tooltip?.title ?? ""}
        content={tooltip?.content ?? ""}
        hint={tooltip?.hint}
      />
      <EducationalTooltip
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Como completar esta tarefa"
        content="Use POST como método. Adicione o header Content-Type: application/json na aba Headers. Na aba Body, preencha o JSON com o email e a senha que aparecem na documentação à esquerda."
        hint="A aba Body já tem o template com a estrutura correta. Basta preencher os valores com as credenciais da documentação."
      />
      <GuidedTutorialOverlay tutorial={tutorial} />
    </TaskShell>
  );
}

function DocRow({
  label,
  value,
  accent,
  mono,
}: {
  label: string;
  value: string;
  accent: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {label}
      </span>
      <span
        className={`text-xs break-all ${mono ? "font-mono" : "font-medium"} ${
          accent === "amber"
            ? "text-amber-700 dark:text-amber-400"
            : accent === "blue"
            ? "text-blue-700 dark:text-blue-400"
            : "text-zinc-700 dark:text-zinc-300"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function CheckItem({
  done,
  label,
  onInfo,
}: {
  done: boolean;
  label: string;
  onInfo: () => void;
}) {
  return (
    <li className="flex items-center gap-2">
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-zinc-300 dark:border-zinc-700 text-transparent"
        }`}
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
      </div>
      <span
        className={`text-xs flex-1 ${
          done
            ? "line-through text-zinc-400 dark:text-zinc-600"
            : "text-zinc-700 dark:text-zinc-300"
        }`}
      >
        {label}
      </span>
      <button
        onClick={onInfo}
        className="text-zinc-400 hover:text-blue-500 dark:text-zinc-600 dark:hover:text-blue-400 transition"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}
