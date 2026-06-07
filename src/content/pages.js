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
        items: [
          {
            title: 'Fast Delivery',
            description: 'Quick turnaround times without compromising quality.',
          },
          {
            title: 'Custom Design',
            description: 'Tailored solutions that match your brand and needs.',
          },
          {
            title: 'Expert Support',
            description: 'Dedicated support from our experienced team.',
          },
        ],
        ctaText: 'Learn More',
        ctaHref: '/#contact',
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
        items: [
          {
            question: 'What services do you offer?',
            answer:
              'We offer a comprehensive range of services including web development, design, consulting, and ongoing support to help your business succeed.',
          },
          {
            question: 'How long does a project take?',
            answer:
              'Project timelines vary based on scope and complexity. Typically, projects range from 4-12 weeks. We provide detailed timelines during our initial consultation.',
          },
          {
            question: 'What is your pricing structure?',
            answer:
              'We offer flexible pricing options including fixed-price projects and hourly rates. Contact us for a custom quote based on your specific needs.',
          },
          {
            question: 'Do you provide ongoing support?',
            answer:
              'Yes, we offer various maintenance and support packages to ensure your project continues to perform optimally after launch.',
          },
        ],
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
        items: [
          {
            icon: '⚡',
            title: 'Entrega Rápida',
            description:
              'Tiempos de entrega rápidos sin comprometer la calidad.',
          },
          {
            icon: '🎨',
            title: 'Diseño Personalizado',
            description:
              'Soluciones a medida que coinciden con tu marca y necesidades.',
          },
          {
            icon: '🔧',
            title: 'Soporte Experto',
            description: 'Soporte dedicado de nuestro equipo experimentado.',
          },
        ],
        ctaText: 'Más Información',
        ctaHref: '/#contact',
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
        items: [
          {
            question: '¿Qué servicios ofrecen?',
            answer:
              'Ofrecemos una amplia gama de servicios que incluyen desarrollo web, diseño, consultoría y soporte continuo para ayudar a tu negocio a tener éxito.',
          },
          {
            question: '¿Cuánto tiempo toma un proyecto?',
            answer:
              'Los plazos varían según el alcance y la complejidad. Por lo general, los proyectos duran entre 4 y 12 semanas. Proporcionamos cronogramas detallados durante la consulta inicial.',
          },
          {
            question: '¿Cuál es su estructura de precios?',
            answer:
              'Ofrecemos opciones de precios flexibles, incluyendo proyectos de precio fijo y tarifas por hora. Contáctenos para obtener una cotización personalizada según sus necesidades.',
          },
          {
            question: '¿Ofrecen soporte continuo?',
            answer:
              'Sí, ofrecemos varios paquetes de mantenimiento y soporte para garantizar que su proyecto continúe funcionando de manera óptima después del lanzamiento.',
          },
        ],
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
      header: {},
      footer: {
        tagline: 'Change your tagline here',
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
      header: {},
      footer: {
        address: '',
        contactEmail: '',
        contactPhone: '',
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
