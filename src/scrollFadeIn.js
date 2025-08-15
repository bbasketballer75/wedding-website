// Adds 'visible' class to sections as they enter the viewport
export function setupSectionFadeIn() {
  const revealSections = () => {
    document.querySelectorAll('section').forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        section.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', revealSections);
  window.addEventListener('resize', revealSections);
  revealSections();
}
