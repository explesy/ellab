import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const lesson = readFileSync(
  new URL('../src/content/docs/lessons/01-quantities.mdx', import.meta.url),
  'utf8',
);
test('lesson starts with an understandable observation rather than unknown calculations', () => {
  const lead = lesson.slice(lesson.indexOf('*Рекомендуемое время'), lesson.indexOf('## 1.'));
  assert.match(lead, /ламп/);
  assert.doesNotMatch(lead, /24\s?(?:Ω|Ом)|48\s?(?:Ω|Ом)|0[,.]5\s?А/);
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

const readLesson = slug => readFileSync(new URL('../src/content/docs/lessons/' + slug + '.mdx', import.meta.url), 'utf8');

test('lesson 3 keeps its worked problem within familiar DC concepts', () => {
  const lesson3 = readLesson('02-ohms-law');
  assert.match(lesson3, /низковольтный нагревательный элемент/);
  assert.match(lesson3, /144/);
  assert.doesNotMatch(lesson3, /водонагреватель — чисто активная нагрузка|230 В и потребляет 2,2 кВт/);
});

test('lesson 4 derives rather than memorizes both connection rules', () => {
  const connections = readLesson('03-series-parallel');
  const steps = [
    '## 1. Сначала представим',
    '## 2. Последовательно',
    '## 3. Параллельно',
    '### Почему параллельное сопротивление становится меньше?',
    '## 4. Посмотри на схему',
    '## 5. Почему законы Кирхгофа',
  ].map(phrase => connections.indexOf(phrase));
  assert.ok(steps.every(x => x >= 0), 'Missing conceptual step');
  assert.ok(steps.every((x, i) => i === 0 || x > steps[i - 1]), 'Rules must follow their physical explanation');
  assert.match(connections, /Электроны \*\*не расходуются\*\*/);
  assert.ok(connections.includes(String.raw`I_{\text{ист}}=I_1+I_2`));
});

test('lesson 5 explains magnet and coil before sine waves and does not require RMS', () => {
  const induction = readLesson('04-alternating-current');
  const steps = ['## 1. Что магнит', '## 2. Из одного', '<GeneratorCycle />', '## 5. Почему получается синусоида', '## 6. Частота'];
  const positions = steps.map(x => induction.indexOf(x));
  assert.ok(positions.every(x => x >= 0));
  assert.ok(positions.every((x, i) => i === 0 || x > positions[i - 1]));
  assert.doesNotMatch(induction, /U_\\{\\text\\{действ\\}\\}|<ACWaveLab \/>/);
  assert.match(induction, /электроны проводимости/);
});

test('lesson 6 introduces RMS through resistive heating before 230 V', () => {
  const rms = readLesson('05-ac-rms');
  const steps = ['## 1. Начнём с резистора', '## 2. Почему при отрицательном', '## 3. Идея действующего', '## 4. Где здесь бытовые 230 В', '<ACWaveLab />'];
  const positions = steps.map(x => rms.indexOf(x));
  assert.ok(positions.every(x => x >= 0));
  assert.ok(positions.every((x, i) => i === 0 || x > positions[i - 1]));
  assert.match(rms, /не всегда даёт активную мощность/);
});

test('Starlight pages use frontmatter title, not a duplicated Markdown H1', () => {
  const paths = [
    'src/content/docs/lessons/00-introduction.md',
    'src/content/docs/lessons/01-quantities.mdx',
    'src/content/docs/lessons/02-ohms-law.mdx',
    'src/content/docs/lessons/03-series-parallel.mdx',
    'src/content/docs/lessons/04-alternating-current.mdx',
    'src/content/docs/lessons/05-ac-rms.mdx',
    'src/content/docs/lessons/03-alternating-current.mdx',
    'src/content/docs/practice/index.md',
    'src/content/docs/practice/01-virtual-circuit.md',
    'src/content/docs/reference/roadmap.md',
    'src/content/docs/reference/profession.md',
    'src/content/docs/reference/glossary.md',
  ];
  for (const path of paths) {
    const source = readFileSync(new URL('../' + path, import.meta.url), 'utf8');
    assert.match(source, /^---\n(?:.|\n)*?^title:/m, 'Missing page title: ' + path);
    assert.doesNotMatch(source, /^#\s+\S/m, 'Second top-level heading in ' + path);
  }
});

test('practical progression is explicit and keeps hazardous work outside the course', () => {
  const practice = readFileSync(new URL('../src/content/docs/practice/index.md', import.meta.url), 'utf8');
  for (const required of [
    '## Этап 1.', '## Этап 2.', '## Этап 3.', '## Этап 4.',
    '## Этап 5A.', '## Этап 5B.', 'Германи', 'Испани',
    '230/400 В', 'Зачёт',
  ]) assert.ok(practice.includes(required), 'Practice roadmap missing ' + required);
  assert.match(practice, /прогноз|предсказание/i);
});
