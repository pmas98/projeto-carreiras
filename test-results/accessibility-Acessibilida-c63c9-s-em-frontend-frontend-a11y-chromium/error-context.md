# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Acessibilidade (axe) >> sem violações críticas em /frontend/frontend_a11y
- Location: e2e\accessibility.spec.ts:16:9

# Error details

```
Error: violações em /frontend/frontend_a11y

expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 316

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#0d0d0f",
+               "contrastRatio": 2.51,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#52525c",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.51 (foreground color: #52525c, background color: #0d0d0f, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"flex items-center justify-between p-2 rounded-lg bg-zinc-950/40 border border-zinc-900/60\">",
+                 "target": Array [
+                   ".rounded-lg.bg-zinc-950\\/40.border-zinc-900\\/60:nth-child(2)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"border-t border-zinc-900 bg-zinc-900/40 p-4 space-y-3\">",
+                 "target": Array [
+                   ".border-zinc-900",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"w-full lg:w-[480px] border-r border-zinc-200 bg-zinc-950 p-0 flex flex-col dark:border-zinc-800\">",
+                 "target": Array [
+                   ".lg\\:w-\\[480px\\]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.51 (foreground color: #52525c, background color: #0d0d0f, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-zinc-600\">Falta</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded-lg.bg-zinc-950\\/40.border-zinc-900\\/60:nth-child(2) > .text-zinc-600",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#0d0d0f",
+               "contrastRatio": 2.51,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#52525c",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.51 (foreground color: #52525c, background color: #0d0d0f, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"flex items-center justify-between p-2 rounded-lg bg-zinc-950/40 border border-zinc-900/60\">",
+                 "target": Array [
+                   ".rounded-lg.bg-zinc-950\\/40.border-zinc-900\\/60:nth-child(3)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"border-t border-zinc-900 bg-zinc-900/40 p-4 space-y-3\">",
+                 "target": Array [
+                   ".border-zinc-900",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"w-full lg:w-[480px] border-r border-zinc-200 bg-zinc-950 p-0 flex flex-col dark:border-zinc-800\">",
+                 "target": Array [
+                   ".lg\\:w-\\[480px\\]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.51 (foreground color: #52525c, background color: #0d0d0f, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-zinc-600\">Falta</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded-lg.bg-zinc-950\\/40.border-zinc-900\\/60:nth-child(3) > .text-zinc-600",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#0d0d0f",
+               "contrastRatio": 2.51,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#52525c",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.51 (foreground color: #52525c, background color: #0d0d0f, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"flex items-center justify-between p-2 rounded-lg bg-zinc-950/40 border border-zinc-900/60\">",
+                 "target": Array [
+                   ".rounded-lg.bg-zinc-950\\/40.border-zinc-900\\/60:nth-child(4)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"border-t border-zinc-900 bg-zinc-900/40 p-4 space-y-3\">",
+                 "target": Array [
+                   ".border-zinc-900",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"w-full lg:w-[480px] border-r border-zinc-200 bg-zinc-950 p-0 flex flex-col dark:border-zinc-800\">",
+                 "target": Array [
+                   ".lg\\:w-\\[480px\\]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.51 (foreground color: #52525c, background color: #0d0d0f, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-zinc-600\">Falta</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded-lg.bg-zinc-950\\/40.border-zinc-900\\/60:nth-child(4) > .text-zinc-600",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 1.14,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#ebebed",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.14 (foreground color: #ebebed, background color: #fafafa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-4 rounded-xl transition-all duration-300 bg-zinc-50 text-zinc-300/40\"><p class=\"text-xs font-medium\">Este é um aviso importante que todos devem ler com clareza.</p></div>",
+                 "target": Array [
+                   ".text-zinc-300\\/40",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.14 (foreground color: #ebebed, background color: #fafafa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-xs font-medium\">Este é um aviso importante que todos devem ler com clareza.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".text-zinc-300\\/40 > .font-medium",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#18181b",
+               "contrastRatio": 4.46,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#369058",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.46 (foreground color: #369058, background color: #18181b, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div data-tutorial=\"frontend-a11y-tree\" class=\"bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-800 font-mono text-xs min-h-[300px] space-y-4\" style=\"color:#4ade80\">",
+                 "target": Array [
+                   ".shadow-xl",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.46 (foreground color: #369058, background color: #18181b, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"animate-pulse\" style=\"color:#4ade80\">&gt; Carregando página...</div>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".shadow-xl > .animate-pulse",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#231c1f",
+               "contrastRatio": 3.05,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#a45051",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.05 (foreground color: #a45051, background color: #231c1f, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"flex items-center gap-2 border p-2 rounded transition-all duration-300\" style=\"border-color:rgba(248,113,113,0.3);background-color:rgba(248,113,113,0.05)\">",
+                 "target": Array [
+                   ".pl-4.space-y-3 > .rounded.p-2.duration-300:nth-child(2)",
+                 ],
+               },
+               Object {
+                 "html": "<div data-tutorial=\"frontend-a11y-tree\" class=\"bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-800 font-mono text-xs min-h-[300px] space-y-4\" style=\"color:#4ade80\">",
+                 "target": Array [
+                   ".shadow-xl",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.05 (foreground color: #a45051, background color: #231c1f, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span style=\"color:#f87171\" class=\"animate-pulse underline font-semibold\">\"Sem nome/descrição\"</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded.p-2.duration-300:nth-child(2) > .underline.animate-pulse.font-semibold",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#231e1d",
+               "contrastRatio": 3.54,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#a66530",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.54 (foreground color: #a66530, background color: #231e1d, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"flex items-center gap-2 border p-2 rounded transition-all duration-300\" style=\"border-color:rgba(251,146,60,0.3);background-color:rgba(251,146,60,0.05)\">",
+                 "target": Array [
+                   ".rounded.p-2.duration-300:nth-child(3)",
+                 ],
+               },
+               Object {
+                 "html": "<div data-tutorial=\"frontend-a11y-tree\" class=\"bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-800 font-mono text-xs min-h-[300px] space-y-4\" style=\"color:#4ade80\">",
+                 "target": Array [
+                   ".shadow-xl",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.54 (foreground color: #a66530, background color: #231e1d, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span style=\"color:#fb923c\" class=\"animate-pulse underline font-semibold\">\"Contraste muito baixo - Pular leitura\"</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded.p-2.duration-300:nth-child(3) > .underline.animate-pulse.font-semibold",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e4]:
    - banner [ref=e5]:
      - generic [ref=e6]:
        - link "Voltar" [ref=e7] [cursor=pointer]:
          - /url: /frontend
          - img [ref=e8]
        - generic [ref=e10]:
          - heading "O Pesadelo do Leitor de Tela" [level=1] [ref=e11]
          - paragraph [ref=e12]: Corrija a semântica e a acessibilidade deste dashboard.
      - button "Mostrar tutorial" [ref=e14]
    - main [ref=e15]:
      - generic [ref=e16]:
        - generic [ref=e17]:
          - generic [ref=e18]:
            - generic [ref=e19]:
              - generic [ref=e21]: Editor de HTML / React
              - generic [ref=e22]:
                - generic [ref=e23]:
                  - generic [ref=e24]: "1"
                  - generic [ref=e25]: "2"
                  - generic [ref=e26]: "3"
                  - generic [ref=e27]: "4"
                  - generic [ref=e28]: "5"
                  - generic [ref=e29]: "6"
                  - generic [ref=e30]: "7"
                - textbox "Editor de código HTML" [ref=e31]: "<div onClick={closeModal}> <img src=\"close.png\" /> </div> <div className=\"text-gray-200 bg-gray-100\"> Texto ilegível </div>"
              - generic [ref=e32]:
                - generic [ref=e33]: Diagnóstico de Acessibilidade
                - generic [ref=e34]:
                  - generic [ref=e35]:
                    - generic [ref=e38]: Estrutura de Tags
                    - generic [ref=e39]: OK
                  - generic [ref=e40]:
                    - generic [ref=e43]: Elemento Modal
                    - generic [ref=e44]: Falta
                  - generic [ref=e45]:
                    - generic [ref=e48]: Filtro de Leitor
                    - generic [ref=e49]: Falta
                  - generic [ref=e50]:
                    - generic [ref=e53]: Contraste de Cor
                    - generic [ref=e54]: Falta
            - generic [ref=e55]:
              - generic [ref=e56]:
                - generic [ref=e57]:
                  - img [ref=e58]
                  - generic [ref=e61]: 20%
                - generic [ref=e62]:
                  - heading "Acessibilidade Crítica" [level=4] [ref=e63]
                  - paragraph [ref=e64]: Pontuação global de conformidade
              - heading "Simulador de Leitor de Tela (Visão do Robô)" [level=3] [ref=e66]:
                - img [ref=e67]
                - text: Simulador de Leitor de Tela (Visão do Robô)
              - generic [ref=e73]:
                - generic [ref=e74]:
                  - text: Visão do Usuário
                  - generic [ref=e75]:
                    - generic [ref=e76]:
                      - heading "Meu Dashboard" [level=4] [ref=e77]
                      - generic [ref=e80] [cursor=pointer]: X
                    - paragraph [ref=e82]: Este é um aviso importante que todos devem ler com clareza.
                - generic [ref=e83]:
                  - text: O que o Robô ouve
                  - generic [ref=e84]:
                    - generic [ref=e85]: "> Carregando página..."
                    - generic [ref=e86]: "Árvore de Acessibilidade:"
                    - generic [ref=e87]:
                      - generic [ref=e88]:
                        - generic [ref=e89]: "- Heading:"
                        - text: "\"Meu Dashboard\""
                      - generic [ref=e90]:
                        - generic [ref=e91]: "- Generic (Div):"
                        - generic [ref=e92]: "\"Sem nome/descrição\""
                      - generic [ref=e93]:
                        - generic [ref=e94]: "- Text Content:"
                        - generic [ref=e95]: "\"Contraste muito baixo - Pular leitura\""
          - generic [ref=e98]:
            - generic [ref=e99]:
              - generic [ref=e101]: Objetivo Atual
              - heading "Semântica Correta" [level=4] [ref=e102]
              - paragraph [ref=e103]: Substitua a tag <div> externa por um <button>.
            - generic [ref=e104]:
              - generic [ref=e105]:
                - img [ref=e106]
                - generic [ref=e109]: O que escrever
              - code [ref=e110]: "<button onClick={closeModal}> ... </button>"
            - generic [ref=e111]:
              - generic [ref=e112]:
                - img [ref=e113]
                - generic [ref=e115]: Por que?
              - paragraph [ref=e116]: "\"Botões são focáveis via teclado e anunciados corretamente por leitores de tela.\""
        - dialog "Ajustar HTML" [ref=e117]:
          - generic [ref=e118]: "Passo 1 de 2: Ajustar HTML"
          - generic [ref=e119]:
            - generic [ref=e120]:
              - generic [ref=e121]: Passo 1 de 2
              - heading "Ajustar HTML" [level=3] [ref=e122]
            - generic [ref=e123]:
              - generic [ref=e124]:
                - paragraph [ref=e125]: Instrucao
                - paragraph [ref=e126]: Corrija a semântica
              - generic [ref=e127]:
                - paragraph [ref=e128]: Por que isso importa
                - paragraph [ref=e129]: Troque elementos genéricos por tags adequadas para interação.
            - generic [ref=e130]:
              - button "Pular" [active] [ref=e131]
              - generic [ref=e132]:
                - button "Voltar" [disabled] [ref=e133]
                - button "Proximo" [ref=e134]
  - alert [ref=e135]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import AxeBuilder from "@axe-core/playwright";
  3  | 
  4  | const PAGES_TO_SCAN = [
  5  |   "/",
  6  |   "/product-owner",
  7  |   "/frontend",
  8  |   "/devops",
  9  |   "/backend",
  10 |   "/product-owner/stakeholder-meeting",
  11 |   "/frontend/frontend_a11y",
  12 | ] as const;
  13 | 
  14 | test.describe("Acessibilidade (axe)", () => {
  15 |   for (const path of PAGES_TO_SCAN) {
  16 |     test(`sem violações críticas em ${path}`, async ({ page }) => {
  17 |       await page.goto(path);
  18 |       await page.waitForLoadState("networkidle");
  19 | 
  20 |       const results = await new AxeBuilder({ page })
  21 |         .withTags(["wcag2a", "wcag2aa", "best-practice"])
  22 |         .analyze();
  23 | 
  24 |       const critical = results.violations.filter(
  25 |         (v) => v.impact === "critical" || v.impact === "serious"
  26 |       );
  27 | 
  28 |       if (critical.length > 0) {
  29 |         console.log(
  30 |           JSON.stringify(
  31 |             critical.map((v) => ({
  32 |               id: v.id,
  33 |               impact: v.impact,
  34 |               description: v.description,
  35 |               nodes: v.nodes.length,
  36 |             })),
  37 |             null,
  38 |             2
  39 |           )
  40 |         );
  41 |       }
  42 | 
> 43 |       expect(critical, `violações em ${path}`).toEqual([]);
     |                                                ^ Error: violações em /frontend/frontend_a11y
  44 |     });
  45 |   }
  46 | 
  47 |   test("html lang é pt-BR", async ({ page }) => {
  48 |     await page.goto("/");
  49 |     const lang = await page.locator("html").getAttribute("lang");
  50 |     expect(lang).toBe("pt-BR");
  51 |   });
  52 | 
  53 |   test("botão voltar em tarefa frontend tem aria-label", async ({ page }) => {
  54 |     await page.goto("/frontend/frontend_inspector");
  55 |     await expect(page.getByRole("link", { name: "Voltar" })).toBeVisible();
  56 |   });
  57 | });
  58 | 
```