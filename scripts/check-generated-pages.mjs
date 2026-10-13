import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const expectedRoutes = [
  ['index.html', 'Эллаб'],
  ['lessons/00-introduction/index.html', 'невидимая сила'],
  ['lessons/01-quantities/index.html', 'Почему одни и те же 12 вольт'],
  ['lessons/01-quantities-audio/index.html', 'Урок второй'],
  ['lessons/02-ohms-law/index.html', 'Закон Ома'],
  ['lessons/03-alternating-current/index.html', 'синусоида'],
  ['practice/01-virtual-circuit/index.html', 'цепь'],
  ['reference/glossary/index.html', 'Deutsch'],
  ['reference/roadmap/index.html', 'Маршрут'],
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
  if (!contents.includes(marker)) problems.push('Expected content missing in ' + file + ': ' + marker);
  if (!contents.includes('/ellab/')) problems.push('Site base /ellab/ missing in ' + file);
}

if (problems.length) {
  console.error('Published website validation FAILED:');
  for (const problem of problems) console.error('- ' + problem);
  process.exitCode = 1;
} else {
  console.log('Generated website validated: ' + expectedRoutes.length + ' routes including both lesson 2 versions.');
}
