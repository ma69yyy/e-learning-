import {
  isSafeHttpUrl,
  safeInternalPath,
  sanitizePlainText,
} from '../utils/security';
import {
  createPasswordCredential,
  verifyPassword,
} from './passwordSecurity';
import {
  authService,
  USERS_STORAGE_KEY,
} from './authApi';

beforeEach(() => {
  localStorage.clear();
});

test('text inputs are bounded and external URLs are restricted to credential-free HTTP(S)', () => {
  expect(sanitizePlainText('  Learner\u0000 Name  ', 20)).toBe('Learner Name');
  expect(sanitizePlainText('x'.repeat(20), 5)).toBe('xxxxx');
  expect(isSafeHttpUrl('https://example.edu/project')).toBe(true);
  expect(isSafeHttpUrl('javascript:alert(1)')).toBe(false);
  expect(isSafeHttpUrl('https://user:secret@example.edu')).toBe(false);
  expect(isSafeHttpUrl('//example.edu/path')).toBe(false);
});

test('post-login paths cannot redirect outside the application', () => {
  expect(safeInternalPath('/learning/materials?courseId=101')).toBe('/learning/materials?courseId=101');
  expect(safeInternalPath('//evil.example/path')).toBe('/learning');
  expect(safeInternalPath('https://evil.example')).toBe('/learning');
});

test('PBKDF2 credentials verify correctly without containing the original password', async () => {
  const password = 'A-long-demo-password-42';
  const credential = await createPasswordCredential(password);
  expect(JSON.stringify(credential)).not.toContain(password);
  expect(await verifyPassword(password, credential)).toBe(true);
  expect(await verifyPassword('not-the-password', credential)).toBe(false);
});

test('new browser registrations store a salted verifier and authenticate without exposing it', async () => {
  const password = 'Fresh-demo-password-42';
  const registration = await authService.register({
    name: 'Test Learner',
    username: 'test_learner',
    email: 'test.learner@example.edu',
    password,
  });

  expect(registration.user).not.toHaveProperty('password');
  expect(registration.user).not.toHaveProperty('passwordHash');
  const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
  expect(rawUsers).not.toContain(password);
  const storedUser = JSON.parse(rawUsers)[0];
  expect(storedUser.passwordScheme).toBe('PBKDF2-SHA256');
  expect(await verifyPassword(password, storedUser)).toBe(true);

  const login = await authService.login('test_learner', password);
  expect(login.status).toBe(200);
  expect(login.user).not.toHaveProperty('passwordHash');
});

test('a legacy plaintext browser account is migrated after successful authentication', async () => {
  const legacyPassword = 'Legacy-demo-password-42';
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([{
    id: 'legacy-student',
    studentId: 'STU-LEGACY',
    username: 'legacy_learner',
    email: 'legacy@example.edu',
    password: legacyPassword,
    name: 'Legacy Learner',
  }]));

  const login = await authService.login('legacy_learner', legacyPassword);
  expect(login.status).toBe(200);
  const migratedRecord = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY))[0];
  expect(migratedRecord).not.toHaveProperty('password');
  expect(migratedRecord.passwordScheme).toBe('PBKDF2-SHA256');
  expect(await verifyPassword(legacyPassword, migratedRecord)).toBe(true);
});
