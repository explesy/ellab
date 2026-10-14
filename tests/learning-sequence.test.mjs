import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const lesson = readFileSync(
  new URL('../src/content/docs/lessons/01-quantities.mdx', import.meta.url),
  'utf8',
);
const audio = readFileSync(
  new URL('../src/content/docs/lessons/01-quantities-audio.md', import.meta.url),
  'utf8',
);

test('lesson starts with an understandable observation rather than unknown calculations', () => {
  const lead = lesson.slice(lesson.indexOf('# Урок 2.'), lesson.indexOf('## 1.'));
  assert.match(lead, /ламп/);
  assert.doesNotMatch(lead, /24\s?(?:Ω|Ом)|48\s?(?:Ω|Ом)|0[,.]5\s?А/);
  const audioLead = audio.slice(audio.indexOf('# Урок второй'), audio.indexOf('## Первая часть'));
  assert.match(audioLead, /ламп/);
  assert.doesNotMatch(audioLead, /двадцать четыре ома|сорок восемь омов/);
});

test('microscopic picture precedes charge, voltage and Ohm calculations', () => {
  const positions = [
    lesson.indexOf('## 1. Атомы, протоны'),
    lesson.indexOf('<MetalLattice />'),
    lesson.indexOf('### Что делает батарейка?'),
    lesson.indexOf('### Что такое электрический ток?'),
    lesson.indexOf('## 2. Что заставляет заряд двигаться'),
    lesson.indexOf('### Закон Ома: расшифруем каждую букву'),
    lesson.indexOf('Например, если на резисторе 12 В'),
  ];
  assert.ok(positions.every(x => x >= 0), 'Missing key concepts');
  for (let i = 1; i < positions.length; i++) {
    assert.ok(positions[i] > positions[i - 1], 'Concept order must be gradual');
  }
});

test('Ohm law and current formulas explain each quantity with units', () => {
  assert.match(lesson, /\*\*U — напряжение \(В, вольты\)/);
  assert.match(lesson, /\*\*I — сила тока \(А, амперы\)/);
  assert.match(lesson, /\*\*R — сопротивление \(Ω, омы\)/);
  assert.match(lesson, /1\\,\\text{В}=1\\,\\text{А}\\cdot1\\,\\Omega/);
  assert.match(lesson, /омического элемента/);
});
