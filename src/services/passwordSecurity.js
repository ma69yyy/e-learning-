const ITERATIONS = 210_000;
const SALT_BYTES = 16;
const HASH_BYTES = 32;
const HASH_BITS = HASH_BYTES * 8;

function toHex(bytes) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function fromHex(value, expectedBytes) {
  if (typeof value !== 'string' || value.length !== expectedBytes * 2 || !/^[0-9a-f]+$/i.test(value)) {
    return null;
  }
  return Uint8Array.from(value.match(/.{2}/g), pair => Number.parseInt(pair, 16));
}

async function derive(password, salt, iterations) {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.subtle || typeof TextEncoder === 'undefined') {
    throw new Error('Secure password storage requires a modern browser on HTTPS or localhost.');
  }
  const material = await cryptoApi.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  return new Uint8Array(await cryptoApi.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    material,
    HASH_BITS,
  ));
}

export async function createPasswordCredential(password) {
  if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
    throw new Error('Password must contain between 6 and 128 characters.');
  }
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derive(password, salt, ITERATIONS);
  return {
    passwordScheme: 'PBKDF2-SHA256',
    passwordIterations: ITERATIONS,
    passwordSalt: toHex(salt),
    passwordHash: toHex(hash),
  };
}

export async function verifyPassword(password, credential) {
  const salt = fromHex(credential?.passwordSalt, SALT_BYTES);
  const storedHash = fromHex(credential?.passwordHash, HASH_BYTES);
  const iterations = Number(credential?.passwordIterations);
  if (typeof password !== 'string' || !salt || !storedHash || credential?.passwordScheme !== 'PBKDF2-SHA256' ||
      !Number.isInteger(iterations) || iterations < 100_000 || iterations > 600_000) {
    return false;
  }

  const candidate = await derive(password, salt, iterations);
  let difference = 0;
  for (let index = 0; index < candidate.length; index += 1) {
    difference |= candidate[index] ^ storedHash[index];
  }
  return difference === 0;
}
