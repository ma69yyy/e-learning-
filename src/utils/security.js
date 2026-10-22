const stripControlCharacters = value => Array.from(value)
  .filter(character => {
    const codePoint = character.codePointAt(0);
    return codePoint > 0x1f && codePoint !== 0x7f;
  })
  .join('');

const containsControlCharacters = value => Array.from(value).some(character => {
  const codePoint = character.codePointAt(0);
  return codePoint <= 0x1f || codePoint === 0x7f;
});

export function sanitizePlainText(value, maxLength = 500) {
  if (typeof value !== 'string') return '';
  return stripControlCharacters(value.normalize('NFKC')).trim().slice(0, maxLength);
}

export function normalizeIdentifier(value = '') {
  return sanitizePlainText(value, 254).toLocaleLowerCase('en-US');
}

export function isValidEmail(value) {
  const email = sanitizePlainText(value, 254);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isSafeHttpUrl(value) {
  if (typeof value !== 'string') return false;
  const candidate = value.trim();
  if (!candidate || candidate.length > 2048 || containsControlCharacters(candidate) || candidate.includes('\\')) {
    return false;
  }

  try {
    const parsed = new URL(candidate);
    return (parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
      Boolean(parsed.hostname) && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}

export function safeInternalPath(pathname, fallback = '/learning') {
  if (typeof pathname !== 'string' || !pathname.startsWith('/') || pathname.startsWith('//') ||
      pathname.includes('\\') || containsControlCharacters(pathname)) {
    return fallback;
  }

  try {
    const parsed = new URL(pathname, 'https://eduvantage.invalid');
    if (parsed.origin !== 'https://eduvantage.invalid') return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
