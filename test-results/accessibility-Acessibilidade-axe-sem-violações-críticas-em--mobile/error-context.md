# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Acessibilidade (axe) >> sem violações críticas em /
- Location: e2e\accessibility.spec.ts:16:9

# Error details

```
Error: violações em /

expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 490

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
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9f9fa9",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<body class=\"min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50\">",
+                 "target": Array [
+                   "body",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.62 (foreground color: #9f9fa9, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-zinc-400\">TASKS</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".text-zinc-400",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 1.93,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#4cd0a4",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.93 (foreground color: #4cd0a4, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<body class=\"min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50\">",
+                 "target": Array [
+                   "body",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.93 (foreground color: #4cd0a4, background color: #ffffff, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"opacity-70\">UPLOADING</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".opacity-70",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.47,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#00bc7d",
+               "fontSize": "10.5pt (14px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.47 (foreground color: #00bc7d, background color: #ffffff, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<body class=\"min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50\">",
+                 "target": Array [
+                   "body",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.47 (foreground color: #00bc7d, background color: #ffffff, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-sm font-semibold\">0<!-- -->%</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".text-emerald-500 > .font-semibold.text-sm",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 3.35,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#898989",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"rounded-lg bg-zinc-50 p-3 font-mono text-[10px] dark:bg-zinc-900/50\">",
+                 "target": Array [
+                   ".rounded-xl.bg-white\\/50.p-5:nth-child(1) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span>TASK_QUEUE</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded-xl.bg-white\\/50.p-5:nth-child(1) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50 > .mb-2.text-\\[8px\\].opacity-50 > span:nth-child(1)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 3.35,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#898989",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"rounded-lg bg-zinc-50 p-3 font-mono text-[10px] dark:bg-zinc-900/50\">",
+                 "target": Array [
+                   ".rounded-xl.bg-white\\/50.p-5:nth-child(1) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span>0<!-- -->/<!-- -->3</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded-xl.bg-white\\/50.p-5:nth-child(1) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50 > .mb-2.text-\\[8px\\].opacity-50 > span:nth-child(2)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 3.35,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#898989",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"rounded-lg bg-zinc-50 p-3 font-mono text-[10px] dark:bg-zinc-900/50\">",
+                 "target": Array [
+                   ".rounded-xl.bg-white\\/50.p-5:nth-child(2) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span>TASK_QUEUE</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded-xl.bg-white\\/50.p-5:nth-child(2) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50 > .mb-2.text-\\[8px\\].opacity-50 > span:nth-child(1)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 3.35,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#898989",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"rounded-lg bg-zinc-50 p-3 font-mono text-[10px] dark:bg-zinc-900/50\">",
+                 "target": Array [
+                   ".rounded-xl.bg-white\\/50.p-5:nth-child(2) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span>0<!-- -->/<!-- -->3</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded-xl.bg-white\\/50.p-5:nth-child(2) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50 > .mb-2.text-\\[8px\\].opacity-50 > span:nth-child(2)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 1.97,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#b8b8bd",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.97 (foreground color: #b8b8bd, background color: #ffffff, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"group relative overflow-hidden rounded-xl border border-zinc-200 bg-white/50 p-5 backdrop-blur-sm transition-all hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/50 hover:dark:border-zinc-600\">",
+                 "target": Array [
+                   ".rounded-xl.bg-white\\/50.p-5:nth-child(3)",
+                 ],
+               },
+               Object {
+                 "html": "<body class=\"min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50\">",
+                 "target": Array [
+                   "body",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.97 (foreground color: #b8b8bd, background color: #ffffff, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"absolute top-0 right-0 p-3 font-mono text-[8px] text-zinc-500 opacity-50\">MOD_<!-- -->DESENVOLVEDOR_FRONTEND</div>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded-xl.bg-white\\/50.p-5:nth-child(3) > .top-0.right-0.p-3",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 3.35,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#898989",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"rounded-lg bg-zinc-50 p-3 font-mono text-[10px] dark:bg-zinc-900/50\">",
+                 "target": Array [
+                   ".rounded-xl.bg-white\\/50.p-5:nth-child(3) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span>TASK_QUEUE</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded-xl.bg-white\\/50.p-5:nth-child(3) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50 > .mb-2.text-\\[8px\\].opacity-50 > span:nth-child(1)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 3.35,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#898989",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"rounded-lg bg-zinc-50 p-3 font-mono text-[10px] dark:bg-zinc-900/50\">",
+                 "target": Array [
+                   ".rounded-xl.bg-white\\/50.p-5:nth-child(3) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span>0<!-- -->/<!-- -->3</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded-xl.bg-white\\/50.p-5:nth-child(3) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50 > .mb-2.text-\\[8px\\].opacity-50 > span:nth-child(2)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 1.97,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#b8b8bd",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.97 (foreground color: #b8b8bd, background color: #ffffff, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"group relative overflow-hidden rounded-xl border border-zinc-200 bg-white/50 p-5 backdrop-blur-sm transition-all hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/50 hover:dark:border-zinc-600\">",
+                 "target": Array [
+                   ".rounded-xl.bg-white\\/50.p-5:nth-child(4)",
+                 ],
+               },
+               Object {
+                 "html": "<body class=\"min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50\">",
+                 "target": Array [
+                   "body",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.97 (foreground color: #b8b8bd, background color: #ffffff, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"absolute top-0 right-0 p-3 font-mono text-[8px] text-zinc-500 opacity-50\">MOD_<!-- -->DESENVOLVEDOR_BACKEND</div>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded-xl.bg-white\\/50.p-5:nth-child(4) > .top-0.right-0.p-3",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 3.35,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#898989",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"rounded-lg bg-zinc-50 p-3 font-mono text-[10px] dark:bg-zinc-900/50\">",
+                 "target": Array [
+                   ".rounded-xl.bg-white\\/50.p-5:nth-child(4) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span>TASK_QUEUE</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded-xl.bg-white\\/50.p-5:nth-child(4) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50 > .mb-2.text-\\[8px\\].opacity-50 > span:nth-child(1)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fafafa",
+               "contrastRatio": 3.35,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#898989",
+               "fontSize": "6.0pt (8px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"rounded-lg bg-zinc-50 p-3 font-mono text-[10px] dark:bg-zinc-900/50\">",
+                 "target": Array [
+                   ".rounded-xl.bg-white\\/50.p-5:nth-child(4) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.35 (foreground color: #898989, background color: #fafafa, font size: 6.0pt (8px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span>0<!-- -->/<!-- -->3</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".rounded-xl.bg-white\\/50.p-5:nth-child(4) > .mt-6.space-y-4 > .rounded-lg.dark\\:bg-zinc-900\\/50.bg-zinc-50 > .mb-2.text-\\[8px\\].opacity-50 > span:nth-child(2)",
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
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - banner [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e8]:
          - generic [ref=e9]: "SYSTEM: ONLINE // v1.0.4"
          - heading "CAREER ARCHITECT" [level=1] [ref=e11]
        - generic [ref=e12]:
          - generic [ref=e13]:
            - generic [ref=e14]: TELEMETRY_SYNC
            - generic [ref=e15]:
              - generic [ref=e16]:
                - generic [ref=e17]: TASKS
                - generic [ref=e18]: 0/12
              - generic [ref=e20]:
                - generic [ref=e21]: UPLOADING
                - generic [ref=e22]: 0%
          - button "[INITIALIZE_RESET]" [ref=e23]: "[INITIALIZE_RESET]"
    - generic [ref=e28]:
      - generic [ref=e29]:
        - generic [ref=e30]: MOD_PRODUCT_OWNER
        - generic [ref=e32]:
          - heading "Product Owner" [level=3] [ref=e33]
          - paragraph [ref=e34]: Stakeholders, escopo e pensamento ágil.
        - generic [ref=e35]:
          - generic [ref=e36]:
            - generic [ref=e37]:
              - generic [ref=e38]: TASK_QUEUE
              - generic [ref=e39]: 0/3
            - generic [ref=e40]:
              - generic [ref=e41]:
                - generic [ref=e42]: "[ ]"
                - generic [ref=e43]: A Reunião com Stakeholder
              - generic [ref=e44]:
                - generic [ref=e45]: "[ ]"
                - generic [ref=e46]: Definindo o Produto
              - generic [ref=e47]:
                - generic [ref=e48]: "[ ]"
                - generic [ref=e49]: Criação de Tickets
          - link "INITIATE_PATH →" [ref=e50] [cursor=pointer]:
            - /url: /product-owner
            - text: INITIATE_PATH
            - generic [ref=e51]: →
      - generic [ref=e52]:
        - generic [ref=e53]: MOD_DEVOPS
        - generic [ref=e55]:
          - heading "DevOps" [level=3] [ref=e56]
          - paragraph [ref=e57]: Incidentes, logs e recuperação de sistemas.
        - generic [ref=e58]:
          - generic [ref=e59]:
            - generic [ref=e60]:
              - generic [ref=e61]: TASK_QUEUE
              - generic [ref=e62]: 0/3
            - generic [ref=e63]:
              - generic [ref=e64]:
                - generic [ref=e65]: "[ ]"
                - generic [ref=e66]: Gestão de Incidentes
              - generic [ref=e67]:
                - generic [ref=e68]: "[ ]"
                - generic [ref=e69]: Pipeline de Deploy
              - generic [ref=e70]:
                - generic [ref=e71]: "[ ]"
                - generic [ref=e72]: Infraestrutura e Escala
          - link "INITIATE_PATH →" [ref=e73] [cursor=pointer]:
            - /url: /devops
            - text: INITIATE_PATH
            - generic [ref=e74]: →
      - generic [ref=e75]:
        - generic [ref=e76]: MOD_DESENVOLVEDOR_FRONTEND
        - generic [ref=e78]:
          - heading "Desenvolvedor Frontend" [level=3] [ref=e79]
          - paragraph [ref=e80]: UI/UX, controle de CSS e feedback em tempo real.
        - generic [ref=e81]:
          - generic [ref=e82]:
            - generic [ref=e83]:
              - generic [ref=e84]: TASK_QUEUE
              - generic [ref=e85]: 0/3
            - generic [ref=e86]:
              - generic [ref=e87]:
                - generic [ref=e88]: "[ ]"
                - generic [ref=e89]: Inspetor de Design
              - generic [ref=e90]:
                - generic [ref=e91]: "[ ]"
                - generic [ref=e92]: Micro-interações
              - generic [ref=e93]:
                - generic [ref=e94]: "[ ]"
                - generic [ref=e95]: O Pesadelo do Leitor de Tela
          - link "INITIATE_PATH →" [ref=e96] [cursor=pointer]:
            - /url: /frontend
            - text: INITIATE_PATH
            - generic [ref=e97]: →
      - generic [ref=e98]:
        - generic [ref=e99]: MOD_DESENVOLVEDOR_BACKEND
        - generic [ref=e101]:
          - heading "Desenvolvedor Backend" [level=3] [ref=e102]
          - paragraph [ref=e103]: APIs, autenticação e fluxos de filtragem de dados.
        - generic [ref=e104]:
          - generic [ref=e105]:
            - generic [ref=e106]:
              - generic [ref=e107]: TASK_QUEUE
              - generic [ref=e108]: 0/3
            - generic [ref=e109]:
              - generic [ref=e110]:
                - generic [ref=e111]: "[ ]"
                - generic [ref=e112]: O Cliente de API
              - generic [ref=e113]:
                - generic [ref=e114]: "[ ]"
                - generic [ref=e115]: Autenticação
              - generic [ref=e116]:
                - generic [ref=e117]: "[ ]"
                - generic [ref=e118]: Busca de Dados
          - link "INITIATE_PATH →" [ref=e119] [cursor=pointer]:
            - /url: /backend
            - text: INITIATE_PATH
            - generic [ref=e120]: →
    - contentinfo [ref=e121]:
      - generic [ref=e122]:
        - generic [ref=e123]: "SYSTEM_ID: 0x9f2a4b"
        - generic [ref=e125]: "ENCRYPTION: AES_256_ACTIVE"
      - generic [ref=e128]: "LOCAL_STORAGE_PERSISTENCE: CONNECTED"
  - alert [ref=e129]
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
     |                                                ^ Error: violações em /
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