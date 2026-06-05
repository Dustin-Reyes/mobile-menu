/**
 * Local page content
 *
 * All content is organized by page, then by locale, then by section.
 * Add a new locale key to each page to support additional languages.
 * If a requested locale is missing, the content service falls back to 'en'.
 *
 * To add a new language:
 *   1. Add the locale key here (e.g., `de: { hero: { title: '...' } }`)
 *   2. Add the locale to `src/config/i18n.js` availableLanguages
 *   3. Add a locale JSON file at `src/i18n/locales/de.json` for UI strings
 *
 * When Firebase CMS is enabled, these values serve as defaults until
 * an admin updates the content via the /admin dashboard.
 * Run `yarn seed` to push this content to Firestore.
 */

export const pages = {
  home: {
    en: {
      hero: {
        badge: 'TranspiledCode Template',
        title: 'Your Headline Here',
        subtitle:
          'Replace this with your tagline. Short, punchy, and on-brand.',
        ctaText: 'Get Started',
        ctaHref: '/',
      },
      services: {
        title: 'Our Services',
        subtitle: 'We provide comprehensive solutions tailored to your needs',
      },
      about: {
        title: 'About Us',
        subtitle: 'Learn more about our company and values',
        description:
          'We are dedicated to delivering excellence in everything we do.',
      },
      gallery: {
        title: 'Our Work',
        subtitle: 'Explore our portfolio and see what we can create for you',
      },
      faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'Find answers to common questions about our services',
      },
      contact: {
        title: 'Contact Us',
        subtitle: 'Get in touch with our team',
      },
      cta: {
        title: 'Ready to Get Started?',
        subtitle:
          'Contact us today to discuss your project and discover how we can help you achieve your goals.',
        primaryText: 'Contact Us',
        primaryHref: '/#contact',
        secondaryText: 'View Portfolio',
        secondaryHref: '/#gallery',
      },
    },
    es: {
      hero: {
        badge: 'Plantilla TranspiledCode',
        title: 'Tu Título Aquí',
        subtitle:
          'Reemplaza esto con tu eslogan. Corto, impactante y acorde a tu marca.',
        ctaText: 'Comenzar',
        ctaHref: '/',
      },
      services: {
        title: 'Nuestros Servicios',
        subtitle: 'Ofrecemos soluciones integrales adaptadas a tus necesidades',
      },
      about: {
        title: 'Sobre Nosotros',
        subtitle: 'Conoce más sobre nuestra empresa y valores',
        description:
          'Estamos dedicados a entregar excelencia en todo lo que hacemos.',
      },
      gallery: {
        title: 'Nuestro Trabajo',
        subtitle:
          'Explora nuestro portafolio y mira lo que podemos crear para ti',
      },
      faq: {
        title: 'Preguntas Frecuentes',
        subtitle:
          'Encuentra respuestas a preguntas comunes sobre nuestros servicios',
      },
      contact: {
        title: 'Contáctenos',
        subtitle: 'Póngase en contacto con nuestro equipo',
      },
      cta: {
        title: '¿Listo para Comenzar?',
        subtitle:
          'Contáctenos hoy para discutir su proyecto y descubrir cómo podemos ayudarlo a alcanzar sus objetivos.',
        primaryText: 'Contáctenos',
        primaryHref: '/#contact',
        secondaryText: 'Ver Portafolio',
        secondaryHref: '/#gallery',
      },
    },
  },

  site: {
    en: {
      header: {
        linkUrl: '/',
      },
      footer: {
        address: '123 Main Street\nSan Francisco, CA 94102',
        contactEmail: 'info@yourproject.com',
        contactPhone: '+1 (555) 123-4567',
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        github: '',
        youtube: '',
      },
    },
    es: {
      header: {
        linkUrl: '/',
      },
      footer: {
        address: 'Calle Principal 123\nSan Francisco, CA 94102',
        contactEmail: 'info@yourproject.com',
        contactPhone: '+1 (555) 123-4567',
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        github: '',
        youtube: '',
      },
    },
  },

  development: {
    en: {
      header: {
        title: 'Development',
        description1:
          'A production-ready SPA starter template built with modern web technologies and best practices.',
        description2:
          'This template provides a solid foundation for building scalable web applications with React, featuring comprehensive tooling for development, testing, and deployment.',
      },
      features: {
        items:
          'Vite 6 for fast development and optimized builds\nReact 18 with modern hooks and patterns\nEmotion for CSS-in-JS styling\nRadix UI for accessible component primitives\nFramer Motion for smooth animations\nFirebase for authentication and CMS\ni18next for internationalization\nSentry for error tracking\nJest for unit testing\nPlaywright for E2E testing\nNetlify for seamless deployment',
      },
    },
    es: {
      header: {
        title: 'Desarrollo',
        description1:
          'Una plantilla SPA lista para producción, construida con tecnologías web modernas y mejores prácticas.',
        description2:
          'Esta plantilla proporciona una base sólida para crear aplicaciones web escalables con React, con herramientas completas para desarrollo, pruebas e implementación.',
      },
      features: {
        items:
          'Vite 6 para desarrollo rápido y builds optimizados\nReact 18 con hooks y patrones modernos\nEmotion para estilos CSS-in-JS\nRadix UI para primitivas de componentes accesibles\nFramer Motion para animaciones fluidas\nFirebase para autenticación y CMS\ni18next para internacionalización\nSentry para seguimiento de errores\nJest para pruebas unitarias\nPlaywright para pruebas E2E\nNetlify para despliegue continuo',
      },
    },
  },
};
