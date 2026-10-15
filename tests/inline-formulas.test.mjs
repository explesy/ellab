import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import katex from 'katex';

const lessons = [
  '01-quantities.mdx',
  '02-ohms-law.mdx',
  '03-series-parallel.mdx',
  '04-alternating-current.mdx',
  '05-ac-rms.mdx',
];

test('all inline lesson formulas compile to accessible KaTeX MathML', () => {
  let total = 0;
  for (const filename of lessons) {
    const source = readFileSync(new URL('../src/content/docs/lessons/' + filename, import.meta.url), 'utf8');
    assert.match(source, /import InlineMath from/);
    const formulas = [...source.matchAll(/<InlineMath expression="([^"]+)"\s*\/>/g)];
    assert.ok(formulas.length >= 8, 'Expected inline math in ' + filename);
    for (const [, expression] of formulas) {
      const html = katex.renderToString(expression, {
        displayMode: false,
        output: 'htmlAndMathml',
        throwOnError: true,
      });
      assert.match(html, /katex-mathml/, expression);
      total++;
    }
  }
  assert.ok(total >= 60, 'Unexpectedly few inline expressions: ' + total);
});

test('instantaneous current uses an actual mathematical fraction', () => {
  const source = readFileSync(
    new URL('../src/content/docs/lessons/01-quantities.mdx', import.meta.url), 'utf8'
  );
  assert.doesNotMatch(source, /I\s*=\s*dQ\/dt/);
  const expression = [...source.matchAll(/<InlineMath expression="([^"]+)"\s*\/>/g)]
    .map(([, tex]) => tex)
    .find((tex) => tex.includes('dQ'));
  assert.ok(expression);
  const html = katex.renderToString(expression, { throwOnError: true });
  assert.match(html, /<mfrac>/);
});

test('worked equations are not displayed as computer code', () => {
  for (const filename of lessons) {
    const source = readFileSync(new URL('../src/content/docs/lessons/' + filename, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /~~~text/);
    const monospaceSections = source.split(String.fromCharCode(96)).filter((_, i) => i % 2 === 1);
    assert.deepEqual(monospaceSections.filter(s => /[=/×²≈]/.test(s)), [], filename);
  }
});
