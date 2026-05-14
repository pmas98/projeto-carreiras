"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
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
  ShieldCheck,
  SlidersHorizontal,
  Copy,
  Check,
  X,
} from "lucide-react";
import { TaskShell } from "@/components/frontend/TaskShell";
import { EducationalTooltip } from "@/components/frontend/EducationalTooltip";
import { useTaskValidation } from "@/hooks/useTaskValidation";
import { useProgressStore } from "@/store/useProgressStore";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Header = { id: number; key: string; value: string };
type Param = { id: number; key: string; value: string; enabled: boolean };
type ActiveTab = "headers" | "params";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
};

type ResponseData = {
  status: number;
  statusText: string;
  timeMs: number;
  body: string;
};

const TARGET_URL = "https://api.loja.dev/v1/admin/products";

const TASK2_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
  ".eyJzdWIiOiI0MiIsImVtYWlsIjoiZGV2QGxvamEuZGV2Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE3MDEyMDAwLCJleHAiOjE3MTcwOTg0MDB9" +
  ".SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const PRODUCTS: Product[] = [
  { id: 1, name: "Tênis Runner X",     category: "calcados",   price: 299.9,  stock: 45,  sku: "TRX-001" },
  { id: 2, name: "Camiseta Tech Pro",  category: "vestuario",  price: 89.9,   stock: 120, sku: "CTP-002" },
  { id: 3, name: "Mochila Ultralight", category: "acessorios", price: 189.9,  stock: 30,  sku: "MUL-003" },
  { id: 4, name: "Tênis Urban Walk",   category: "calcados",   price: 249.9,  stock: 8,   sku: "TUW-004" },
  { id: 5, name: "Boné Dad Hat",       category: "acessorios", price: 59.9,   stock: 200, sku: "BDH-005" },
  { id: 6, name: "Short Cargo",        category: "vestuario",  price: 119.9,  stock: 65,  sku: "SCG-006" },
  { id: 7, name: "Tênis Lifestyle",    category: "calcados",   price: 349.9,  stock: 12,  sku: "TLS-007" },
  { id: 8, name: "Nécessaire Travel",  category: "acessorios", price: 79.9,   stock: 95,  sku: "NTR-008" },
];

const METHOD_COLORS: Record<Method, string> = {
  GET:    "text-emerald-600 dark:text-emerald-400",
  POST:   "text-amber-600 dark:text-amber-400",
  PUT:    "text-blue-600 dark:text-blue-400",
  PATCH:  "text-purple-600 dark:text-purple-400",
  DELETE: "text-red-600 dark:text-red-400",
};
const METHOD_BG: Record<Method, string> = {
  GET:    "bg-emerald-50 dark:bg-emerald-900/20",
  POST:   "bg-amber-50 dark:bg-amber-900/20",
  PUT:    "bg-blue-50 dark:bg-blue-900/20",
  PATCH:  "bg-purple-50 dark:bg-purple-900/20",
  DELETE: "bg-red-50 dark:bg-red-900/20",
};

type TooltipInfo = { title: string; content: string; hint?: string };
const DEFINITIONS: Record<string, TooltipInfo> = {
  authorization: {
    title: "O que é o header Authorization?",
    content:
      'Após autenticar, você inclui o JWT em toda requisição protegida via o header "Authorization". O valor segue o padrão "Bearer <token>" — "Bearer" indica o esquema de autenticação.',
    hint: 'O valor completo deve ser: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... Copie o JWT do painel esquerdo e cole aqui.',
  },
  params: {
    title: "O que são Query Parameters?",
    content:
      "Query params são pares chave=valor adicionados ao final da URL após o '?'. Eles permitem passar opções para a API sem mudar o endpoint — como filtros, paginação e ordenação.",
    hint: "Adicione category=calcados para filtrar apenas produtos de calçados. Múltiplos params são separados por '&': ?category=calcados&maxStock=50",
  },
  endpoint: {
    title: "Endpoint protegido",
    content:
      "Este endpoint é de uso administrativo — lista todos os produtos com dados de estoque que não devem ser públicos. Por isso exige autenticação via JWT.",
    hint: "Sem o header Authorization com um JWT válido, a API retorna 401 Unauthorized.",
  },
  stock: {
    title: "Por que filtrar por estoque?",
    content:
      "Em sistemas reais, é comum buscar apenas registros que atendam a um critério — como produtos com estoque baixo para reposição. Query params tornam esses filtros dinâmicos sem criar um endpoint por combinação.",
  },
};

function applyFilters(params: Param[]): Product[] {
  let result = [...PRODUCTS];
  for (const p of params) {
    if (!p.enabled || !p.key.trim() || !p.value.trim()) continue;
    const key = p.key.trim().toLowerCase();
    const val = p.value.trim().toLowerCase();
    if (key === "category") {
      result = result.filter((item) => item.category.toLowerCase() === val);
    } else if (key === "maxstock") {
      const n = Number(val);
      if (!isNaN(n)) result = result.filter((item) => item.stock <= n);
    } else if (key === "minprice") {
      const n = Number(val);
      if (!isNaN(n)) result = result.filter((item) => item.price >= n);
    } else if (key === "maxprice") {
      const n = Number(val);
      if (!isNaN(n)) result = result.filter((item) => item.price <= n);
    }
  }
  return result;
}

function getMockResponse(
  method: Method,
  url: string,
  headers: Header[],
  params: Param[]
): ResponseData {
  const urlMatch = url.trim().toLowerCase() === TARGET_URL.toLowerCase();
  const methodMatch = method === "GET";
  const authHeader = headers.find(
    (h) => h.key.trim().toLowerCase() === "authorization"
  );
  const hasValidAuth =
    !!authHeader &&
    authHeader.value.trim().toLowerCase().startsWith("bearer ey");

  if (!urlMatch) {
    return {
      status: 404, statusText: "Not Found", timeMs: rand(30, 50),
      body: JSON.stringify({ error: "Not Found", message: "Endpoint não encontrado." }, null, 2),
    };
  }
  if (!methodMatch) {
    return {
      status: 405, statusText: "Method Not Allowed", timeMs: rand(20, 40),
      body: JSON.stringify({ error: "Method Not Allowed", message: "Este endpoint aceita apenas GET." }, null, 2),
    };
  }
  if (!hasValidAuth) {
    return {
      status: 401, statusText: "Unauthorized", timeMs: rand(30, 55),
      body: JSON.stringify({ error: "Unauthorized", message: "Token JWT ausente ou inválido. Inclua o header Authorization: Bearer <token>." }, null, 2),
    };
  }

  const filtered = applyFilters(params);
  return {
    status: 200, statusText: "OK", timeMs: rand(100, 200),
    body: JSON.stringify({ data: filtered, total: filtered.length, filters: Object.fromEntries(params.filter(p => p.enabled && p.key.trim() && p.value.trim()).map(p => [p.key.trim(), p.value.trim()])) }, null, 2),
  };
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function statusColor(status: number) {
  if (status < 300) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
  if (status < 400) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
  return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
}


let nextId = 200;

export function DataFetchingTask() {
  const [method, setMethod]         = useState<Method>("GET");
  const [url, setUrl]               = useState("");
  const [headers, setHeaders]       = useState<Header[]>([{ id: nextId++, key: "", value: "" }]);
  const [params, setParams]         = useState<Param[]>([{ id: nextId++, key: "", value: "", enabled: true }]);
  const [activeTab, setActiveTab]   = useState<ActiveTab>("headers");
  const [methodOpen, setMethodOpen] = useState(false);
  const [response, setResponse]     = useState<ResponseData | null>(null);
  const [isSending, setIsSending]   = useState(false);
  const [tooltip, setTooltip]       = useState<TooltipInfo | null>(null);
  const [helpOpen, setHelpOpen]     = useState(false);
  const [copied, setCopied]         = useState(false);
  const [showModal, setShowModal]   = useState(true);
  const resetTask = useProgressStore((s) => s.resetTask);
  const router = useRouter();

  const effectiveUrl = useMemo(() => {
    const active = params.filter((p) => p.enabled && p.key.trim() && p.value.trim());
    if (!active.length || !url.trim()) return url.trim();
    const qs = active.map((p) => `${encodeURIComponent(p.key.trim())}=${encodeURIComponent(p.value.trim())}`).join("&");
    return `${url.trim()}?${qs}`;
  }, [url, params]);

  const hasValidAuth = headers.some(
    (h) =>
      h.key.trim().toLowerCase() === "authorization" &&
      h.value.trim().toLowerCase().startsWith("bearer ey")
  );
  const hasCategoryFilter = params.some(
    (p) =>
      p.enabled &&
      p.key.trim().toLowerCase() === "category" &&
      p.value.trim().toLowerCase() === "calcados"
  );

  const { isComplete } = useTaskValidation({
    taskId: "backend_data_fetching",
    currentState: { method, url, hasValidAuth, hasCategoryFilter, responseStatus: response?.status },
    validate: (s) =>
      s.method === "GET" &&
      s.url.trim().toLowerCase() === TARGET_URL.toLowerCase() &&
      s.hasValidAuth &&
      s.hasCategoryFilter &&
      s.responseStatus === 200,
  });

  useEffect(() => {
    if (!isComplete || response) return;
    const saved = localStorage.getItem("resp_backend_data_fetching");
    if (!saved) return;
    try { setResponse(JSON.parse(saved) as ResponseData); } catch {}
  }, [isComplete, response]);

  const handleSend = useCallback(() => {
    if (!url.trim()) return;
    setIsSending(true);
    setResponse(null);
    setTimeout(() => {
      const result = getMockResponse(method, url, headers, params);
      setResponse(result);
      if (result.status === 200) {
        try { localStorage.setItem("resp_backend_data_fetching", JSON.stringify(result)); } catch {}
      }
      setIsSending(false);
    }, 650);
  }, [method, url, headers, params]);

  const handleUseJwt = () => {
    const authIdx = headers.findIndex((h) => h.key.trim().toLowerCase() === "authorization");
    if (authIdx >= 0) {
      setHeaders((prev) => prev.map((h, i) => i === authIdx ? { ...h, value: `Bearer ${TASK2_JWT}` } : h));
    } else {
      setHeaders((prev) => [...prev, { id: nextId++, key: "Authorization", value: `Bearer ${TASK2_JWT}` }]);
    }
  };

  const handleCopyJwt = () => {
    navigator.clipboard.writeText(`Bearer ${TASK2_JWT}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const addHeader = () => setHeaders((p) => [...p, { id: nextId++, key: "", value: "" }]);
  const removeHeader = (id: number) => setHeaders((p) => p.filter((h) => h.id !== id));
  const updateHeader = (id: number, f: "key" | "value", v: string) =>
    setHeaders((p) => p.map((h) => (h.id === id ? { ...h, [f]: v } : h)));

  const addParam = () => setParams((p) => [...p, { id: nextId++, key: "", value: "", enabled: true }]);
  const removeParam = (id: number) => setParams((p) => p.filter((x) => x.id !== id));
  const updateParam = (id: number, f: "key" | "value" | "enabled", v: string | boolean) =>
    setParams((p) => p.map((x) => (x.id === id ? { ...x, [f]: v } : x)));

  const handleReset = () => {
    setMethod("GET");
    setUrl("");
    setHeaders([{ id: nextId++, key: "", value: "" }]);
    setParams([{ id: nextId++, key: "", value: "", enabled: true }]);
    setResponse(null);
    setShowModal(true);
    try { localStorage.removeItem("resp_backend_data_fetching"); } catch {}
    resetTask("backend_data_fetching");
  };

  return (
    <TaskShell
      title="Busca de Dados"
      subtitle="Use o JWT para acessar o endpoint protegido e filtre os resultados."
      backHref="/backend"
      onHelpClick={() => setHelpOpen(true)}
    >
      <div className="flex flex-1 flex-col lg:flex-row h-full overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 overflow-y-auto shrink-0">
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Contexto</span>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                O time de logística precisa repor o estoque de calçados. Você deve buscar todos os produtos da
                categoria <strong className="text-zinc-900 dark:text-zinc-100">calçados</strong> usando o endpoint protegido.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50 p-4 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Documentação da API</span>
              <div className="space-y-2">
                <DocRow label="Método"  value="GET"               accent="emerald" />
                <DocRow label="URL"     value={TARGET_URL}        accent="zinc" mono />
                <DocRow label="Header"  value="Authorization: Bearer <jwt>" accent="blue" mono />
                <DocRow label="Params"  value="category=calcados" accent="violet" mono />
              </div>
              <button
                onClick={() => setTooltip(DEFINITIONS.endpoint)}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Info className="h-3 w-3" /> Por que este endpoint é protegido?
              </button>
            </div>

            {/* JWT reference */}
            <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                    JWT da tarefa anterior
                  </span>
                </div>
                <button
                  onClick={handleCopyJwt}
                  className="flex items-center justify-center gap-1 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-amber-950/40 px-2 py-1 text-[11px] text-amber-700 dark:text-amber-300 transition hover:bg-amber-100 dark:hover:bg-amber-900/30"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
              <p className="font-mono text-[9px] text-amber-700 dark:text-amber-300 break-all leading-relaxed line-clamp-3">
                Bearer {TASK2_JWT.slice(0, 40)}…
              </p>
            </div>

            {/* Checklist */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Checklist</span>
              <ul className="mt-2 space-y-2">
                <CheckItem done={method === "GET"}                                           label="Método: GET"                          onInfo={() => setTooltip(DEFINITIONS.endpoint)} />
                <CheckItem done={url.trim().toLowerCase() === TARGET_URL.toLowerCase()}     label="URL correta"                          onInfo={() => setTooltip(DEFINITIONS.endpoint)} />
                <CheckItem done={hasValidAuth}                                               label="Header Authorization: Bearer <jwt>"   onInfo={() => setTooltip(DEFINITIONS.authorization)} />
                <CheckItem done={hasCategoryFilter}                                          label="Param category=calcados"              onInfo={() => setTooltip(DEFINITIONS.params)} />
                <CheckItem done={response?.status === 200}                                   label="Resposta 200 com dados filtrados"     onInfo={() => setTooltip(DEFINITIONS.stock)} />
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
                        <button key={m} onClick={() => { setMethod(m); setMethodOpen(false); }}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold transition hover:bg-zinc-50 dark:hover:bg-zinc-900 ${METHOD_COLORS[m]}`}
                        >{m}</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <input
                type="text" value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.loja.dev/v1/admin/products"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="h-10 flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 font-mono text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />

              <button
                onClick={handleSend} disabled={isSending || !url.trim()}
                className="flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              >
                <Send className="h-4 w-4" />
                {isSending ? "Enviando…" : "Enviar"}
              </button>
            </div>

            {/* Effective URL preview */}
            <AnimatePresence>
              {effectiveUrl !== url.trim() && url.trim() && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 px-3 py-2 flex items-start gap-2">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-violet-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">URL efetiva</span>
                      <p className="font-mono text-[11px] text-violet-700 dark:text-violet-300 break-all mt-0.5">{effectiveUrl}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-zinc-100 dark:border-zinc-900">
              {(["headers", "params"] as ActiveTab[]).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
                      : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  }`}
                >
                  {tab === "params" ? (
                    <span className="flex items-center gap-1.5">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Query Params
                    </span>
                  ) : "Headers"}
                </button>
              ))}
            </div>

            {/* Tab: Headers */}
            {activeTab === "headers" && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Headers</span>
                  <button onClick={() => setTooltip(DEFINITIONS.authorization)}
                    className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    <Info className="h-3 w-3" /> O que é Authorization?
                  </button>
                </div>
                {headers.map((h) => (
                  <div key={h.id} className="flex gap-2">
                    <input type="text" value={h.key} onChange={(e) => updateHeader(h.id, "key", e.target.value)}
                      placeholder="Chave (ex: Authorization)"
                      className="h-8 w-2/5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                    <input type="text" value={h.value} onChange={(e) => updateHeader(h.id, "value", e.target.value)}
                      placeholder="Valor (ex: Bearer eyJ…)"
                      className="h-8 flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                    <button onClick={() => removeHeader(h.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-900">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button onClick={addHeader}
                  className="mt-1 flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 dark:hover:border-zinc-600 dark:hover:text-zinc-300">
                  <Plus className="h-3.5 w-3.5" /> Adicionar Header
                </button>
              </div>
            )}

            {/* Tab: Params */}
            {activeTab === "params" && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5" /> Query Parameters
                  </span>
                  <button onClick={() => setTooltip(DEFINITIONS.params)}
                    className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    <Info className="h-3 w-3" /> O que são params?
                  </button>
                </div>
                {params.map((p) => (
                  <div key={p.id} className="flex gap-2 items-center">
                    <button
                      onClick={() => updateParam(p.id, "enabled", !p.enabled)}
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                        p.enabled
                          ? "border-violet-500 bg-violet-500 text-white"
                          : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      }`}
                    >
                      {p.enabled && <Check className="h-2.5 w-2.5" />}
                    </button>
                    <input type="text" value={p.key} onChange={(e) => updateParam(p.id, "key", e.target.value)}
                      placeholder="Chave (ex: category)"
                      className={`h-8 w-2/5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2.5 font-mono text-xs placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition ${
                        p.enabled ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-600"
                      }`}
                    />
                    <input type="text" value={p.value} onChange={(e) => updateParam(p.id, "value", e.target.value)}
                      placeholder="Valor (ex: calcados)"
                      className={`h-8 flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2.5 font-mono text-xs placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition ${
                        p.enabled ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-600"
                      }`}
                    />
                    <button onClick={() => removeParam(p.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-900">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button onClick={addParam}
                  className="mt-1 flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 dark:hover:border-zinc-600 dark:hover:text-zinc-300">
                  <Plus className="h-3.5 w-3.5" /> Adicionar Parâmetro
                </button>
              </div>
            )}
          </div>

          {/* Response panel */}
          <div className="flex flex-1 flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-900/50">
            {isSending && (
              <div className="flex flex-1 items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-6 w-6 rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-600 dark:border-t-zinc-200" />
              </div>
            )}

            {!isSending && !response && (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-zinc-400 dark:text-zinc-600">A resposta aparecerá aqui após enviar.</p>
              </div>
            )}

            {!isSending && response && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-1 flex-col overflow-hidden p-4 gap-3">
                  {/* Status bar */}
                  <div className="flex items-center gap-3">
                    <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${statusColor(response.status)}`}>
                      {response.status} {response.statusText}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                      <Clock className="h-3 w-3" /> {response.timeMs}ms
                    </span>
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
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Trilha concluída!</h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Você buscou os dados de calçados com autenticação JWT.</p>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  <RotateCcw size={16} />
                  Repetir
                </button>
                <button
                  onClick={() => router.push("/backend")}
                  className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                >
                  Acessar trilha →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EducationalTooltip isOpen={tooltip !== null} onClose={() => setTooltip(null)}
        title={tooltip?.title ?? ""} content={tooltip?.content ?? ""} hint={tooltip?.hint} />
      <EducationalTooltip isOpen={helpOpen} onClose={() => setHelpOpen(false)}
        title="Como completar esta tarefa"
        content="Na aba Headers, adicione Authorization com o valor Bearer seguido do JWT (disponível no painel esquerdo para copiar). Na aba Params, adicione category=calcados para filtrar os produtos."
        hint="Use o botão Copiar no painel esquerdo para pegar o valor completo do JWT e cole no campo de valor do header Authorization." />
    </TaskShell>
  );
}

function DocRow({ label, value, accent, mono }: { label: string; value: string; accent: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{label}</span>
      <span className={`text-xs break-all ${mono ? "font-mono" : "font-medium"} ${
        accent === "emerald" ? "text-emerald-700 dark:text-emerald-400"
        : accent === "blue"   ? "text-blue-700 dark:text-blue-400"
        : accent === "violet" ? "text-violet-700 dark:text-violet-400"
        : "text-zinc-700 dark:text-zinc-300"
      }`}>{value}</span>
    </div>
  );
}

function CheckItem({ done, label, onInfo }: { done: boolean; label: string; onInfo: () => void }) {
  return (
    <li className="flex items-center gap-2">
      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
        done ? "border-emerald-500 bg-emerald-500 text-white" : "border-zinc-300 dark:border-zinc-700 text-transparent"
      }`}>
        <CheckCircle2 className="h-3.5 w-3.5" />
      </div>
      <span className={`text-xs flex-1 ${done ? "line-through text-zinc-400 dark:text-zinc-600" : "text-zinc-700 dark:text-zinc-300"}`}>
        {label}
      </span>
      <button onClick={onInfo} className="text-zinc-400 hover:text-blue-500 dark:text-zinc-600 dark:hover:text-blue-400 transition">
        <Info className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}
