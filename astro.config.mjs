import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://explesy.github.io',
  base: '/ellab',
  integrations: [
    starlight({
      title: 'Эллаб · Электротехника с нуля',
      description: 'Электротехника, схемы и безопасные эксперименты: Германия и Испания',
      sidebar: [
        { label: 'Теория', autogenerate: { directory: 'lessons' } },
        { label: 'Практика', autogenerate: { directory: 'practice' } },
        { label: 'Справочник', autogenerate: { directory: 'reference' } },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/explesy/ellab' }],
    }),
  ],
});
