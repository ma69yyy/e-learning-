import '@testing-library/jest-dom';

const { TextEncoder, TextDecoder } = require('node:util');
globalThis.TextEncoder ??= TextEncoder;
globalThis.TextDecoder ??= TextDecoder;

jest.mock('lucide-react', () => {
  const React = require('react');
  return new Proxy({ __esModule: true }, {
    get(target, key) {
      if (key in target) return target[key];
      return function IconMock(props) {
        return React.createElement('svg', {
          ...props,
          'aria-hidden': props['aria-hidden'] ?? true,
          'data-icon': String(key),
        });
      };
    },
  });
});

if (typeof window.matchMedia !== 'function') {
  window.matchMedia = query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; },
  });
}

if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: require('node:crypto').webcrypto,
  });
}
