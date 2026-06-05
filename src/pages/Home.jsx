import Hero from 'components/sections/Hero';
import Services from 'components/sections/Services';
import About from 'components/sections/About';
import Gallery from 'components/sections/Gallery';
import FAQ from 'components/sections/FAQ';
import Contact from 'components/sections/Contact';
import CTA from 'components/sections/CTA';
import AnimatedSection from 'components/AnimatedSection';
import { SECTIONS_CONFIG } from 'config/sections';

const SECTIONS = [
  { id: 'hero', component: Hero },
  { id: 'services', component: Services },
  { id: 'about', component: About },
  { id: 'gallery', component: Gallery },
  { id: 'faq', component: FAQ },
  { id: 'contact', component: Contact },
  { id: 'cta', component: CTA },
];

export default function Home() {
  // Use custom order if provided, otherwise use default order
  const sectionOrder = SECTIONS_CONFIG.order || SECTIONS.map((s) => s.id);

  return (
    <>
      {sectionOrder.map((sectionId, index) => {
        const section = SECTIONS.find((s) => s.id === sectionId);
        if (!section || !SECTIONS_CONFIG[sectionId]) return null;

        const SectionComponent = section.component;
        const delay = index * 0.1; // Stagger animations

        // Hero doesn't need AnimatedSection wrapper since it's full viewport
        if (sectionId === 'hero') {
          return <SectionComponent key={sectionId} />;
        }

        return (
          <AnimatedSection key={sectionId} delay={delay}>
            <SectionComponent />
          </AnimatedSection>
        );
      })}
    </>
  );
}
