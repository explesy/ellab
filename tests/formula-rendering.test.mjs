import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import katex from 'katex';

const lessonPaths = [
  'src/content/docs/lessons/01-quantities.mdx',
  'src/content/docs/lessons/02-ohms-law.mdx',
  'src/content/docs/lessons/03-series-parallel.mdx',
];

test('all FormulaCard expressions render as accessible KaTeX math', () => {
  let count = 0;
  for (const path of lessonPaths) {
    const source = readFileSync(new URL('../' + path, import.meta.url), 'utf8');
    const matches = [...source.matchAll(/<FormulaCard\b[^>]*expression="([^"]+)"/g)];
    assert.ok(matches.length > 0, 'No FormulaCard formulas found in ' + path);
    for (const [, expression] of matches) {
      const html = katex.renderToString(expression, {
        displayMode: true,
        output: 'htmlAndMathml',
        throwOnError: true,
      });
      assert.match(html, /katex-mathml/, expression);
      count++;
    }
  }
  assert.equal(count, 10);
});

test('the average-current formula has a stacked fraction and subscript', () => {
  const source = readFileSync(new URL('../src/content/docs/lessons/01-quantities.mdx', import.meta.url), 'utf8');
  const expression = [...source.matchAll(/<FormulaCard\b[^>]*expression="([^"]+)"/g)][0][1];
  const html = katex.renderToString(expression, { displayMode: true, throwOnError: true });
  assert.match(html, /<mfrac>/);
  assert.match(html, /<msub>/);
});
