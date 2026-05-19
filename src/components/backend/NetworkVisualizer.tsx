"use client";

import { motion } from "framer-motion";
import {
  Laptop,
  Server,
  Database,
  Lock,
  Unlock,
  Wifi,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  FileJson,
  Activity,
} from "lucide-react";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type Header = { id: number; key: string; value: string };

type ResponseData = {
  status: number;
  statusText: string;
  timeMs: number;
  body: string;
};

interface NetworkVisualizerProps {
  method: Method;
  url: string;
  headers: Header[];
  body?: string;
  response: ResponseData | null;
  isSending: boolean;
  taskId: string;
}

export function NetworkVisualizer({
  method,
  url,
  headers,
  body = "",
  response,
  isSending,
  taskId,
}: NetworkVisualizerProps) {
  // Determine if the parameters/inputs are partially or fully set up
  const isUrlEntered = url.trim().length > 0;
  const hasHeaders = headers.some((h) => h.key.trim() && h.value.trim());

  // Get status details
  const status = response?.status;

  // Analogy content generator based on state
  const getAnalogyContent = () => {
    if (isSending) {
      return {
        title: "Mensagem em trânsito...",
        analogy: "O seu navegador empacotou a requisição e a enviou como pulsos elétricos pelos cabos de fibra óptica sob o asfalto e oceanos. Ela está correndo a quase 300.000 km/s rumo ao servidor!",
        tip: "Aguardando o processamento do servidor...",
      };
    }

    if (!response) {
      switch (taskId) {
        case "backend_api_client":
          return {
            title: "Professor Bit: Vamos começar!",
            analogy: "Imagine uma API como um garçom de restaurante: você (cliente) faz o pedido (requisição) e ele traz a comida (resposta). Para ver o catálogo de produtos da nossa loja, você precisa fazer um pedido do tipo de leitura (GET) no endereço correto.",
            tip: "Configure o método como GET, digite a URL exatamente como 'https://api.loja.dev/v1/products', adicione o header 'Accept' com valor 'application/json' e aperte Enviar!",
          };
        case "backend_auth":
          return {
            title: "Professor Bit: Área Restrita!",
            analogy: "Algumas portas da API são trancadas. Para entrar, precisamos de uma pulseira VIP (um token JWT). Para conseguir um, você deve ir até a 'bilheteria' da API (enviar um POST para /v1/auth/login) e provar sua identidade enviando seu email e senha de desenvolvedor no corpo da carta (Body).",
            tip: "Defina o método como POST, digite a URL do login, adicione o header 'Content-Type' com 'application/json', vá até a aba 'Body' para preencher as credenciais e clique em Enviar!",
          };
        case "backend_data_fetching":
          return {
            title: "Professor Bit: O Desafio Final!",
            analogy: "Agora você tem a pulseira VIP (JWT) da tarefa anterior. Vamos acessar o banco de dados restrito de produtos de calçados! Para provar que é admin, anexe a pulseira no header 'Authorization' usando o padrão 'Bearer <seu-token>'. Além disso, use a aba 'Query Params' para filtrar apenas pela categoria desejada.",
            tip: "Método GET, URL /v1/admin/products. Adicione o header 'Authorization' com 'Bearer <token>' (copie no painel esquerdo!) e o parâmetro 'category=calcados' para concluir!",
          };
        default:
          return {
            title: "Professor Bit: Pronto para enviar?",
            analogy: "A internet é uma grande rede de computadores conversando. Preencha os campos acima para estruturar a sua mensagem HTTP e clique em Enviar para ver a mágica acontecer.",
            tip: "Siga o checklist no menu lateral esquerdo.",
          };
      }
    }

    // Handled response states
    if (status === 200) {
      switch (taskId) {
        case "backend_api_client":
          return {
            title: "200 OK — Sucesso Absoluto!",
            analogy: "Perfeito! O garçom (servidor) entendeu seu pedido, viu que você fala a mesma língua dele (JSON) por conta do header 'Accept', buscou as prateleiras de tênis e camisetas no banco de dados e te entregou uma bandeja cheia de dados!",
            tip: "Excelente! Agora clique no botão abaixo do modal para avançar para o login de segurança.",
          };
        case "backend_auth":
          return {
            title: "200 OK — Pulseira VIP gerada!",
            analogy: "Incrível! O servidor validou seu email e senha, abriu um cofre de chaves criptográficas e te devolveu um token JWT! Esse token contém seus dados de acesso (como seu cargo de admin e expiração) compactados de forma segura.",
            tip: "Veja o token gerado acima. Você pode clicar no cabeçalho vermelho (Header) ou roxo (Payload) para decodificar e ler os metadados reais!",
          };
        case "backend_data_fetching":
          return {
            title: "200 OK — Missão Cumprida!",
            analogy: "Extraordinário! O segurança do servidor leu o seu header 'Authorization', confirmou que a assinatura do seu JWT era válida, liberou o acesso ao cofre de dados, filtrou a lista para retornar apenas 'calçados' (category=calcados) e te enviou de volta!",
            tip: "Parabéns! Você aprendeu as bases fundamentais do desenvolvimento backend: APIs, Autenticação JWT e Filtros de Consulta!",
          };
        default:
          return {
            title: "200 OK — Requisição bem-sucedida!",
            analogy: "Tudo certo! O servidor processou sua requisição sem problemas e retornou os dados solicitados.",
            tip: "Tarefa completada!",
          };
      }
    }

    if (status === 404) {
      return {
        title: "404 Not Found — O endereço não existe!",
        analogy: "Pense na URL como o endereço físico de uma loja. Você tentou ir até a loja mas errou a rua ou o bairro. O carteiro da internet vasculhou todos os cantos e não encontrou esse caminho no servidor, voltando de mãos vazias.",
        tip: "Verifique se digitou a URL perfeitamente, caractere por caractere, de acordo com o painel de Documentação no lado esquerdo!",
      };
    }

    if (status === 405) {
      const expected = taskId === "backend_auth" ? "POST" : "GET";
      return {
        title: `405 Method Not Allowed — Ação incorreta!`,
        analogy: `Pense nos métodos HTTP como ações permitidas: GET é ler, POST é criar/enviar, PUT é atualizar, DELETE é apagar. Você tentou entrar no prédio usando a porta giratória que está travada para essa ação! O endpoint aceita apenas requisições ${expected}.`,
        tip: `Ajuste o método de seleção à esquerda da barra de URL para ${expected} e tente enviar de novo!`,
      };
    }

    if (status === 406 || status === 415) {
      const headerName = taskId === "backend_auth" ? "Content-Type" : "Accept";
      return {
        title: `${status} — Barreira de Idiomas!`,
        analogy: `O servidor fala a linguagem JSON, mas você enviou uma mensagem sem especificar em qual idioma as informações estão empacotadas ou qual você entende. É como tentar pedir um prato em um restaurante estrangeiro fazendo mímica confusa.`,
        tip: `Adicione um Header no construtor de requisição: chave '${headerName}' e valor 'application/json' para que o servidor possa traduzir corretamente.`,
      };
    }

    if (status === 401) {
      return {
        title: "401 Unauthorized — Cadê o crachá VIP?",
        analogy: "O segurança da balada barrou a sua entrada! Este endereço de produtos administrativos é altamente protegido e exige um token de autorização. Sem o token JWT anexado ou se o formato estiver errado, você não passa do portão.",
        tip: "Vá na aba 'Headers', adicione um header com a chave 'Authorization' e o valor 'Bearer <seu-token-copiado-da-esquerda>'.",
      };
    }

    if (status === 422) {
      return {
        title: "422 Unprocessable Entity — Carta incompleta!",
        analogy: "O servidor recebeu a sua requisição, mas ao abrir o envelope (Body), percebeu que as informações de login estão incompletas ou com erro de digitação (JSON inválido). É como preencher o formulário de matrícula esquecendo o nome ou a assinatura.",
        tip: "Verifique a aba 'Body'. O JSON precisa estar com as aspas duplas corretas e com o email 'dev@loja.dev' e a senha 'senha123' preenchidos.",
      };
    }

    return {
      title: `${status} ${response.statusText} — Algo deu errado!`,
      analogy: "O servidor retornou uma falha na requisição. Há alguma configuração incompatível que impediu a transação de dados de completar com sucesso.",
      tip: "Verifique o checklist de requisitos e compare suas configurações com a Documentação da API.",
    };
  };

  const currentInfo = getAnalogyContent();

  return (
    <div className="flex flex-1 flex-col p-4 gap-4 bg-zinc-50 dark:bg-zinc-950 overflow-y-auto">
      {/* Network Animation Diagram */}
      <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm overflow-hidden min-h-[160px] flex items-center justify-center">
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg flex items-center justify-between gap-2">
          {/* Client Node */}
          <div className="flex flex-col items-center gap-1.5 w-20 shrink-0">
            <div className={`p-3 rounded-2xl shadow-sm border transition-all duration-300 ${
              isSending
                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-500 scale-105"
                : status === 200
                ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-500"
                : status && status >= 400
                ? "bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-500"
                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500"
            }`}>
              <Laptop className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 text-center uppercase tracking-wider">
              Cliente (Você)
            </span>
          </div>

          {/* Network Path */}
          <div className="flex-1 relative flex items-center justify-center h-8">
            {/* Base Wire Line */}
            <div className={`absolute left-0 right-0 h-0.5 transition-colors duration-300 ${
              isSending
                ? "bg-blue-300 dark:bg-blue-800"
                : status === 200
                ? "bg-emerald-400 dark:bg-emerald-800"
                : status && status >= 400
                ? "bg-red-400 dark:bg-red-900/50"
                : "bg-zinc-200 dark:bg-zinc-800"
            }`} />

            {/* Glowing Flow Animation */}
            {isSending && (
              <motion.div
                initial={{ x: "-220%" }}
                animate={{ x: "220%" }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="w-12 h-4 rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm absolute"
              />
            )}

            {/* Glowing Request Envelope */}
            {isSending && (
              <motion.div
                initial={{ x: "-200%" }}
                animate={{ x: "200%" }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="absolute bg-blue-500 text-white p-1 rounded shadow-md"
              >
                <span className="font-mono text-[8px] font-black tracking-wider px-1">
                  {method}
                </span>
              </motion.div>
            )}

            {/* Validation checkpoints along the way */}
            {status && !isSending && (
              <div className="absolute inset-0 flex items-center justify-center gap-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`flex h-6 w-6 items-center justify-center rounded-full border shadow-sm ${
                    status === 200
                      ? "bg-emerald-500 border-emerald-600 text-white"
                      : "bg-red-500 border-red-600 text-white"
                  }`}
                >
                  {status === 200 ? (
                    <CheckCircle className="h-3.5 w-3.5" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  )}
                </motion.div>
              </div>
            )}

            {/* Inactive instructional tooltip */}
            {!status && !isSending && (
              <div className="absolute text-[9px] font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-widest flex items-center gap-1 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-100 dark:border-zinc-800">
                <Wifi className="h-3 w-3 animate-pulse text-zinc-300 dark:text-zinc-700" />
                Rede Pronta
              </div>
            )}
          </div>

          {/* Server Node */}
          <div className="flex flex-col items-center gap-1.5 w-20 shrink-0">
            <div className={`p-3 rounded-2xl shadow-sm border transition-all duration-300 relative ${
              status === 200
                ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-500 scale-105"
                : status && status >= 400
                ? "bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-500"
                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500"
            }`}>
              <Server className="h-6 w-6" />

              {/* Lock/Unlock Gate visual on server */}
              {status === 401 && (
                <div className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full border border-white">
                  <Lock className="h-2.5 w-2.5" />
                </div>
              )}
              {status === 200 && taskId === "backend_data_fetching" && (
                <div className="absolute -top-1.5 -right-1.5 p-0.5 bg-emerald-500 text-white rounded-full border border-white">
                  <Unlock className="h-2.5 w-2.5" />
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 text-center uppercase tracking-wider">
              Servidor API
            </span>
          </div>

          {/* Database Path */}
          <div className="flex flex-col items-center gap-1 w-12 shrink-0">
            <div className={`h-8 w-0.5 border-l-2 border-dashed transition-colors duration-300 ${
              status === 200
                ? "border-emerald-400 dark:border-emerald-600"
                : "border-zinc-200 dark:border-zinc-800"
            }`} />
            
            {/* Database Node */}
            <div className={`p-2.5 rounded-xl shadow-xs border transition-all duration-300 ${
              status === 200
                ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-500 scale-105"
                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400"
            }`}>
              <Database className="h-4 w-4" />
            </div>
            <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center">
              Banco
            </span>
          </div>
        </div>
      </div>

      {/* Professor Bit Pedagogical Assistant Guide */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          {/* Virtual Tutor Avatar (Pixel Robot style SVG) */}
          <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 dark:from-indigo-600 dark:to-violet-700 flex items-center justify-center shadow-md">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M12 2v4" />
              <path d="M12 6H8a4 4 0 0 0-4 4v1" />
              <path d="M12 6h4a4 4 0 0 1 4 4v1" />
              <circle cx="9" cy="15" r="1" fill="currentColor" />
              <circle cx="15" cy="15" r="1" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Professor Bit responde:
            </h4>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-tight">
              {currentInfo.title}
            </h3>
          </div>
        </div>

        {/* Narrative Analogy */}
        <div className="relative rounded-xl border border-indigo-50 dark:border-zinc-800 bg-indigo-50/30 dark:bg-zinc-950 p-4">
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
            💡 <strong className="text-indigo-600 dark:text-indigo-400">Analogia:</strong> {currentInfo.analogy}
          </p>
        </div>

        {/* Action Tip */}
        <div className="flex items-start gap-2 text-xs">
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-[10px]">
            i
          </span>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <strong className="text-zinc-900 dark:text-zinc-200">Como resolver:</strong> {currentInfo.tip}
          </p>
        </div>
      </div>
    </div>
  );
}
