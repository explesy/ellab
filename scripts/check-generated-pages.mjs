import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const expectedRoutes = [
  ['index.html', 'Эллаб'],
  ['lessons/00-introduction/index.html', 'невидимая сила'],
  ['lessons/01-quantities/index.html', 'Почему одни и те же 12 вольт'],
  ['lessons/01-quantities-audio/index.html', 'Урок второй'],
  ['lessons/02-ohms-law-audio/index.html', 'Куда девается электрическая энергия'],
  ['lessons/03-series-parallel-audio/index.html', 'Урок четвёртый'],
  ['lessons/04-alternating-current-audio/index.html', 'Урок пятый'],
  ['lessons/02-ohms-law/index.html', 'Мощность'],
  ['lessons/03-series-parallel/index.html', 'Параллельно'],
  ['lessons/03-alternating-current/index.html', 'материал перемещён'],
  ['lessons/04-alternating-current/index.html', 'синусоида'],
  ['practice/01-virtual-circuit/index.html', 'цепь'],
  ['reference/glossary/index.html', 'Deutsch'],
  ['reference/roadmap/index.html', 'Карта обучения'],
  ['reference/profession/index.html', 'Германия'],
];

const problems = [];
for (const [file, marker] of expectedRoutes) {
  const absolute = join(process.cwd(), 'dist', file);
  if (!existsSync(absolute)) {
    problems.push('Missing page: ' + file);
    continue;
  }
  const contents = readFileSync(absolute, 'utf8');
  if (!contents.toLocaleLowerCase('ru-RU').includes(marker.toLocaleLowerCase('ru-RU'))) problems.push('Expected content missing in ' + file + ': ' + marker);
  if (!contents.includes('/ellab/')) problems.push('Site base /ellab/ missing in ' + file);
}

// KaTeX is pre-rendered into the actual lesson HTML, including a stacked fraction.
const formulaPagePath = join(process.cwd(), 'dist', 'lessons/01-quantities/index.html');
if (existsSync(formulaPagePath)) {
  const formulaPage = readFileSync(formulaPagePath, 'utf8');
  if (!formulaPage.includes('katex-mathml') || !formulaPage.includes('<mfrac>')) {
    problems.push('KaTeX/MathML stacked fraction missing from lesson 2');
  }
}

// The rendered sidebar must follow the order declared in astro.config.mjs.
const configSource = readFileSync(join(process.cwd(), 'astro.config.mjs'), 'utf8');
const configuredSidebarSlugs = [...configSource.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
if (configuredSidebarSlugs.length === 0) problems.push('No sidebar slugs found in astro.config.mjs');

const sidebarSlugs = (html) => {
  const nav = html.match(/<nav class="sidebar[^"]*"[^>]*>([\s\S]*?)<\/nav>/);
  if (!nav) return null;
  return [...nav[1].matchAll(/href="\/ellab\/([^"]*)"/g)].map((match) => match[1].replace(/\/$/, ''));
};

// Lessons live in dist/lessons/<slug>/index.html; every one needs both desktop controls.
const lessonsDir = join(process.cwd(), 'dist', 'lessons');
const lessonPages = existsSync(lessonsDir)
  ? readdirSync(lessonsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(join(lessonsDir, entry.name, 'index.html')))
      .map((entry) => join('lessons', entry.name, 'index.html'))
  : [];

for (const file of lessonPages) {
  const html = readFileSync(join(process.cwd(), 'dist', file), 'utf8');

  const renderedSlugs = sidebarSlugs(html);
  if (!renderedSlugs) {
    problems.push('Sidebar navigation missing in ' + file);
  } else if (renderedSlugs.join('|') !== configuredSidebarSlugs.join('|')) {
    problems.push('Sidebar order mismatch in ' + file + ': ' + renderedSlugs.join(', '));
  }

  for (const side of ['left', 'right']) {
    if (!html.includes('data-ellab-toggle="' + side + '"')) {
      problems.push('Missing desktop panel control in ' + file + ': ' + side);
    }
  }
}

if (problems.length) {
  console.error('Published website validation FAILED:');
  for (const problem of problems) console.error('- ' + problem);
  process.exitCode = 1;
} else {
  console.log('Generated website validated: ' + expectedRoutes.length + ' routes, sidebar order against astro.config.mjs, and desktop panel controls on ' + lessonPages.length + ' lesson pages.');
}
