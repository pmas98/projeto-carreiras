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
  X,
} from "lucide-react";
import { TaskShell } from "@/components/frontend/TaskShell";
import { EducationalTooltip } from "@/components/frontend/EducationalTooltip";
import { useTaskValidation } from "@/hooks/useTaskValidation";
import { useProgressStore } from "@/store/useProgressStore";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type Header = { id: number; key: string; value: string };

type ResponseData = {
  status: number;
  statusText: string;
  timeMs: number;
  body: string;
};

const TARGET_URL = "https://api.loja.dev/v1/products";
const TARGET_METHOD: Method = "GET";

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

const SUCCESS_BODY = JSON.stringify(
  {
    data: [
      { id: 1, name: "Tênis Runner X", price: 299.9, stock: 45 },
      { id: 2, name: "Camiseta Tech Pro", price: 89.9, stock: 120 },
      { id: 3, name: "Mochila Ultralight", price: 189.9, stock: 30 },
    ],
    total: 3,
    page: 1,
    perPage: 20,
  },
  null,
  2
);

function getMockResponse(
  method: Method,
  url: string,
  headers: Header[]
): ResponseData {
  const urlMatch = url.trim().toLowerCase() === TARGET_URL.toLowerCase();
  const methodMatch = method === TARGET_METHOD;
  const hasAcceptHeader = headers.some(
    (h) =>
      h.key.trim().toLowerCase() === "accept" &&
      h.value.trim().toLowerCase() === "application/json"
  );

  if (!urlMatch) {
    return {
      status: 404,
      statusText: "Not Found",
      timeMs: Math.floor(Math.random() * 40 + 30),
      body: JSON.stringify(
        { error: "Not Found", message: "O recurso solicitado não existe." },
        null,
        2
      ),
    };
  }

  if (!methodMatch) {
    return {
      status: 405,
      statusText: "Method Not Allowed",
      timeMs: Math.floor(Math.random() * 30 + 20),
      body: JSON.stringify(
        {
          error: "Method Not Allowed",
          message: "Esse endpoint aceita apenas requisições GET.",
        },
        null,
        2
      ),
    };
  }

  if (!hasAcceptHeader) {
    return {
      status: 406,
      statusText: "Not Acceptable",
      timeMs: Math.floor(Math.random() * 50 + 40),
      body: JSON.stringify(
        {
          error: "Not Acceptable",
          message:
            "Header obrigatório ausente: Accept: application/json",
        },
        null,
        2
      ),
    };
  }

  return {
    status: 200,
    statusText: "OK",
    timeMs: Math.floor(Math.random() * 80 + 100),
    body: SUCCESS_BODY,
  };
}

function statusColor(status: number) {
  if (status < 300) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
  if (status < 400) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
  if (status < 500) return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
  return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
}

type TooltipInfo = { title: string; content: string; hint?: string };

const DEFINITIONS: Record<string, TooltipInfo> = {
  method: {
    title: "O que é um Método HTTP?",
    content:
      "O método HTTP diz ao servidor o que você quer fazer. GET busca dados, POST cria, PUT atualiza e DELETE remove. É como a 'ação' de um pedido.",
    hint: "Para buscar uma lista de produtos, use GET — você só quer ler, não modificar nada.",
  },
  url: {
    title: "O que é uma URL REST?",
    content:
      "A URL identifica o recurso que você quer acessar. Em APIs REST, o caminho costuma seguir um padrão: /versão/recurso. Ex: /v1/products.",
    hint: "A URL completa é: https://api.loja.dev/v1/products",
  },
  headers: {
    title: "O que são Headers HTTP?",
    content:
      "Headers são metadados da requisição — informações extras que o servidor usa para interpretar o pedido. 'Accept' diz ao servidor o formato de resposta que o cliente entende.",
    hint: "Adicione o header Accept com o valor application/json para indicar que espera uma resposta em JSON.",
  },
  statusCode: {
    title: "O que é um Status Code?",
    content:
      "O código de status indica o resultado da requisição. 200 = sucesso, 404 = não encontrado, 405 = método errado, 406 = formato não aceito, 500 = erro no servidor.",
    hint: "Uma resposta 200 OK significa que tudo correu bem e os dados foram retornados.",
  },
};

let nextHeaderId = 1;

export function ApiClientTask() {
  const [method, setMethod] = useState<Method>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Header[]>([
    { id: nextHeaderId++, key: "", value: "" },
  ]);
  const [methodOpen, setMethodOpen] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const resetTask = useProgressStore((s) => s.resetTask);
  const router = useRouter();

  const requestState = { method, url, headers };

  const { isComplete } = useTaskValidation({
    taskId: "backend_api_client",
    currentState: requestState,
    validate: (s) =>
      s.method === TARGET_METHOD &&
      s.url.trim().toLowerCase() === TARGET_URL.toLowerCase() &&
      s.headers.some(
        (h) =>
          h.key.trim().toLowerCase() === "accept" &&
          h.value.trim().toLowerCase() === "application/json"
      ) &&
      response?.status === 200,
  });

  useEffect(() => {
    if (!isComplete || response) return;
    const saved = localStorage.getItem("resp_backend_api_client");
    if (!saved) return;
    try { setResponse(JSON.parse(saved) as ResponseData); } catch {}
  }, [isComplete, response]);

  const handleSend = useCallback(() => {
    if (!url.trim()) return;
    setIsSending(true);
    setResponse(null);

    setTimeout(() => {
      const result = getMockResponse(method, url, headers);
      setResponse(result);
      if (result.status === 200) {
        try { localStorage.setItem("resp_backend_api_client", JSON.stringify(result)); } catch {}
      }
      setIsSending(false);
    }, 600);
  }, [method, url, headers]);

  const addHeader = () => {
    setHeaders((prev) => [...prev, { id: nextHeaderId++, key: "", value: "" }]);
  };

  const removeHeader = (id: number) => {
    setHeaders((prev) => prev.filter((h) => h.id !== id));
  };

  const updateHeader = (id: number, field: "key" | "value", val: string) => {
    setHeaders((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: val } : h))
    );
  };

  const handleReset = () => {
    setMethod("GET");
    setUrl("");
    setHeaders([{ id: nextHeaderId++, key: "", value: "" }]);
    setResponse(null);
    setShowModal(true);
    try { localStorage.removeItem("resp_backend_api_client"); } catch {}
    resetTask("backend_api_client");
  };

  return (
    <TaskShell
      title="O Cliente de API"
      subtitle="Construa a requisição HTTP correta para acessar os dados."
      backHref="/backend"
      onHelpClick={() => setHelpOpen(true)}
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
                O time de frontend precisa integrar o catálogo de produtos, mas
                antes você precisa <strong className="text-zinc-900 dark:text-zinc-100">confirmar que o endpoint funciona</strong> usando
                um cliente de API.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50 p-4 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Documentação da API
              </span>
              <div className="space-y-2">
                <DocRow label="Método" value="GET" accent="emerald" />
                <DocRow label="URL" value="https://api.loja.dev/v1/products" accent="zinc" mono />
                <DocRow label="Header" value="Accept: application/json" accent="blue" mono />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Checklist
              </span>
              <ul className="mt-2 space-y-2">
                <CheckItem
                  done={method === "GET"}
                  label="Método: GET"
                  onInfo={() => setTooltip(DEFINITIONS.method)}
                />
                <CheckItem
                  done={url.trim().toLowerCase() === TARGET_URL.toLowerCase()}
                  label="URL correta"
                  onInfo={() => setTooltip(DEFINITIONS.url)}
                />
                <CheckItem
                  done={headers.some(
                    (h) =>
                      h.key.trim().toLowerCase() === "accept" &&
                      h.value.trim().toLowerCase() === "application/json"
                  )}
                  label="Header Accept: application/json"
                  onInfo={() => setTooltip(DEFINITIONS.headers)}
                />
                <CheckItem
                  done={response?.status === 200}
                  label="Resposta 200 OK"
                  onInfo={() => setTooltip(DEFINITIONS.statusCode)}
                />
              </ul>
            </div>
          </div>
        </aside>

        {/* Main workspace */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Request builder */}
          <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-4">
            {/* Method + URL + Send */}
            <div className="flex gap-2">
              {/* Method selector */}
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
                      {(["GET", "POST", "PUT", "PATCH", "DELETE"] as Method[]).map(
                        (m) => (
                          <button
                            key={m}
                            onClick={() => {
                              setMethod(m);
                              setMethodOpen(false);
                            }}
                            className={`flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold transition hover:bg-zinc-50 dark:hover:bg-zinc-900 ${METHOD_COLORS[m]}`}
                          >
                            {m}
                          </button>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* URL input */}
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.loja.dev/v1/products"
                className="h-10 flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 font-mono text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={isSending || !url.trim()}
                className="flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              >
                <Send className="h-4 w-4" />
                {isSending ? "Enviando…" : "Enviar"}
              </button>
            </div>

            {/* Headers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Headers
                </span>
                <button
                  onClick={() => setTooltip(DEFINITIONS.headers)}
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Info className="h-3 w-3" />
                  O que é isso?
                </button>
              </div>

              <div className="space-y-1.5">
                {headers.map((header) => (
                  <div key={header.id} className="flex gap-2">
                    <input
                      type="text"
                      value={header.key}
                      onChange={(e) =>
                        updateHeader(header.id, "key", e.target.value)
                      }
                      placeholder="Chave (ex: Accept)"
                      className="h-8 w-2/5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) =>
                        updateHeader(header.id, "value", e.target.value)
                      }
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
              </div>

              <button
                onClick={addHeader}
                className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-700 dark:hover:border-zinc-600 dark:hover:text-zinc-300"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar Header
              </button>
            </div>
          </div>

          {/* Response panel */}
          <div className="flex flex-1 flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-900/50">
            {isSending && (
              <div className="flex flex-1 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-6 w-6 rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-600 dark:border-t-zinc-200"
                />
              </div>
            )}

            {!isSending && !response && (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-zinc-400 dark:text-zinc-600">
                  A resposta aparecerá aqui após enviar a requisição.
                </p>
              </div>
            )}

            {!isSending && response && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-1 flex-col overflow-hidden p-4 gap-3"
              >
                {/* Status bar */}
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${statusColor(response.status)}`}
                  >
                    {response.status} {response.statusText}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                    <Clock className="h-3 w-3" />
                    {response.timeMs}ms
                  </span>
                  <button
                    onClick={() => setTooltip(DEFINITIONS.statusCode)}
                    className="ml-auto text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Info className="h-3 w-3" />
                    O que é isso?
                  </button>
                </div>

                {/* Response body */}
                <div className="flex-1 overflow-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                  <pre className="p-4 text-[11px] leading-relaxed font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-words">
                    {response.body}
                  </pre>
                </div>
              </motion.div>
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/50">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Requisição perfeita!</h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">200 OK — o endpoint respondeu com os dados do catálogo.</p>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  <RotateCcw size={16} />
                  Repetir
                </button>
                <button
                  onClick={() => router.push("/backend/backend_auth")}
                  className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                >
                  Acessar próxima tarefa →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Educational tooltips */}
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
        content="Use o dropdown para selecionar o método HTTP. Digite a URL no campo ao lado. Adicione um header preenchendo a chave e o valor, depois clique em Enviar."
        hint="A documentação da API no painel esquerdo tem tudo que você precisa. Siga o checklist de cima para baixo."
      />
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
          accent === "emerald"
            ? "text-emerald-700 dark:text-emerald-400"
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
