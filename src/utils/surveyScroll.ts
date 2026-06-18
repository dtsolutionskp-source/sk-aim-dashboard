const SCROLL_KEY = 'survey-scroll-y';

export function saveSurveyScroll() {
  sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
}

export function restoreSurveyScroll() {
  const saved = sessionStorage.getItem(SCROLL_KEY);
  if (saved === null) return;
  const y = parseInt(saved, 10);
  sessionStorage.removeItem(SCROLL_KEY);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    });
  });
}
