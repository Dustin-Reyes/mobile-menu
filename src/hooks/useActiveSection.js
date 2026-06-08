/**
 * Tracks which page section is currently in the viewport using IntersectionObserver.
 *
 * Returns the `id` of the section whose element is currently intersecting the
 * centre of the viewport. Defaults to `'home'` on mount.
 *
 * @param {string[]} sectionIds - Ordered list of section element IDs to observe.
 * @returns {[string, React.Dispatch<React.SetStateAction<string>>]}
 *   Tuple of `[activeSection, setActiveSection]`.
 */
import { useState, useEffect } from 'react';

function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((obs) => obs?.disconnect());
  }, [sectionIds]);

  return [activeSection, setActiveSection];
}

export default useActiveSection;
