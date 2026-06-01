/**
 * Local navigation content
 *
 * Each nav item has locale-keyed labels so navigation can be translated.
 * The href and order fields are shared across all locales.
 * The content service resolves the correct label for the active locale.
 *
 * To add a label for a new language, add the locale key to each item's labels object.
 */

export const navigation = {
  main: [
    {
      id: 'home',
      sectionId: null,
      order: 1,
      labels: { en: 'Home', es: 'Inicio' },
    },
    {
      id: 'about',
      sectionId: 'about',
      order: 2,
      labels: { en: 'About', es: 'Nosotros' },
    },
    {
      id: 'services',
      sectionId: 'services',
      order: 3,
      labels: { en: 'Services', es: 'Servicios' },
    },
    {
      id: 'faq',
      sectionId: 'faq',
      order: 4,
      labels: { en: 'FAQ', es: 'Preguntas' },
    },
    {
      id: 'contact',
      sectionId: 'contact-form',
      order: 5,
      labels: { en: 'Contact', es: 'Contacto' },
    },
  ],
  footer: [
    {
      id: 'github',
      href: 'https://github.com/TranspiledCode/titan-demo',
      order: 1,
      labels: {
        en: 'GitHub',
        es: 'GitHub',
      },
    },
  ],
};
