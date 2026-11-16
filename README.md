# markdown-render-speed-02-entry

SPDX-License-Identifier: MIT

A fast, dependency-free Markdown-to-HTML renderer written from scratch,
matching marked 18.1.3 with its default options (GFM on, breaks off).

Entry for the markdown-render-speed-02 bounty on make.fun:
https://make.fun/competitions/markdown-render-speed-02

`parse.js` exports `parse(markdown)`; `main.ts` reads `/input/cases.json`
and writes the rendered HTML array to `/output/html.json`.
