import { useState, useEffect } from 'react';

/**
 * Scrollspy hook using IntersectionObserver.
 * Tracks which section id is currently visible in the viewport.
 *
 * @param {string[]} sectionIds - Ordered list of section id attributes to observe
 * @returns {string|null} activeId - The id of the section currently in view
 */
function useDemoScrollspy(sectionIds) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!sectionIds.length) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost entry that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}

export default useDemoScrollspy;
