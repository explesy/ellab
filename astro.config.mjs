import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://explesy.github.io',
  base: '/ellab',
  integrations: [
    starlight({
      title: 'Эллаб · Электротехника с нуля',
      description: 'Интерактивный учебник по электротехнике с практикой и профессиональным словарём Германии и Испании',
      locales: {
        root: { label: 'Русский', lang: 'ru' },
      },
      customCss: ['./src/styles/ellab.css'],
      components: { Header: './src/components/EllabHeader.astro' },
      sidebar: [
        {
          label: 'Учебный маршрут',
          items: [
            { slug: 'lessons/00-introduction', label: '01 · Введение' },
            { slug: 'lessons/01-quantities', label: '02 · Ток, напряжение, сопротивление' },
            { slug: 'lessons/02-ohms-law', label: '03 · Мощность и энергия' },
            { slug: 'lessons/03-series-parallel', label: '04 · Соединение нагрузок' },
            { slug: 'lessons/04-alternating-current', label: '05 · Генератор и переменный ток' },
            { slug: 'lessons/05-ac-rms', label: '06 · Действующее напряжение' },
          ],
        },
        {
          label: 'Практика',
          items: [
            { slug: 'practice/01-virtual-circuit', label: 'Виртуальная цепь' },
          ],
        },
        {
          label: 'Справочник',
          items: [
            { slug: 'reference/roadmap', label: 'Карта обучения' },
            { slug: 'reference/glossary', label: 'Словарь DE / ES' },
            { slug: 'reference/profession', label: 'Работа в Германии и Испании' },
          ],
        },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/explesy/ellab' }],
    }),
  ],
});
