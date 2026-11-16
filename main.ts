import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { parse } from './parse.js';

// Thin driver: read every case, render each with parse, write the HTML array.
const inputPath = process.argv[2] || '/input/cases.json';
const outputPath = process.argv[3] || '/output/html.json';
const cases = JSON.parse(readFileSync(inputPath, 'utf8'));
const html = cases.map((c) => parse(c.markdown));
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(html));
