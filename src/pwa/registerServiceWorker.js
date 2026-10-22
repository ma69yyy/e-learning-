export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  const basePath = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  navigator.serviceWorker
    .register(`${basePath}sw.js`, { scope: basePath })
    .catch(() => {
      // PWA support is progressive enhancement; keep the learning app usable if registration fails.
    });
}
