import axios from 'axios';
import { createPasswordCredential, verifyPassword } from './passwordSecurity';
import { isValidEmail, normalizeIdentifier, sanitizePlainText } from '../utils/security';

export const TOKEN_STORAGE_KEY = 'eduvantage_auth_token';
export const USER_STORAGE_KEY = 'eduvantage_user_info';
export const USERS_STORAGE_KEY = 'eduvantage_registered_users';

// Axios Instance for Protected APIs
export const apiClient = axios.create({
  baseURL: 'https://api.eduvantage.local/v1',
  timeout: 5000
});

// Helper to encode a mock JWT
export const createMockJwt = (user, expiresInSeconds = 120) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = btoa(JSON.stringify({
    sub: user.studentId || user.id,
    name: user.name,
    email: user.email,
    role: user.role || "student",
    exp
  }));
  const signature = btoa('demo-only-not-a-cryptographic-signature');
  return `${header}.${payload}.${signature}`;
};

// Helper to decode JWT payload
export const decodeJwt = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
};

// c) Attach token to protected learning API requests using Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global callback for 401 unauthorized handling
let onUnauthorizedHandler = null;
export const setUnauthorizedCallback = (callback) => {
  onUnauthorizedHandler = callback;
};

// f) Handle unauthorized and expired-token responses using Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);

      if (onUnauthorizedHandler) {
        onUnauthorizedHandler(error.message || 'Session expired or invalid token. Please sign in again.');
      }
    }
    return Promise.reject(error);
  }
);

const DEFAULT_STUDENT = {
  id: "STD-2026-88",
  studentId: "STD-2026-88",
  role: "student",
  username: "alex.johnson",
  email: "alex.johnson@elearn.edu",
  password: "Password123!",
  name: "Alex Johnson",
  department: "Computer Science & Engineering",
  institution: "National Institute of Technology",
  bio: "Passionate software engineering undergraduate exploring full-stack web architectures.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
};

const DEFAULT_ADMIN = {
  id: "ADM-2026-01",
  studentId: "ADM-2026-01",
  role: "admin",
  username: "admin",
  email: "admin@eduvantage.edu",
  password: "Admin123!",
  name: "EduVantage Admin",
  department: "Platform Administration",
  institution: "EduVantage Learning Portal",
  bio: "Demo administrator account.",
  avatar: "https://ui-avatars.com/api/?name=EduVantage+Admin&background=183a68&color=fff"
};

const delay = (ms = 350) => new Promise(res => setTimeout(res, ms));

const readRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    const users = raw ? JSON.parse(raw) : [];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

const writeRegisteredUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const allUsers = () => [DEFAULT_STUDENT, DEFAULT_ADMIN, ...readRegisteredUsers()];

const publicUser = ({
  password: _password,
  passwordHash: _passwordHash,
  passwordSalt: _passwordSalt,
  passwordIterations: _passwordIterations,
  passwordScheme: _passwordScheme,
  ...user
}) => user;

export const authService = {
  // Create a browser-local account. This is intentionally a demo store, not production auth.
  async register({ name, username, email, password }) {
    await delay(400);

    const safeName = sanitizePlainText(name, 100);
    const normalizedUsername = normalizeIdentifier(username);
    const normalizedEmail = normalizeIdentifier(email);
    if (!/^[a-z0-9][a-z0-9._-]{2,39}$/.test(normalizedUsername) ||
        !isValidEmail(normalizedEmail) || typeof password !== 'string' ||
        password.length < 6 || password.length > 128 || !safeName) {
      throw { status: 400, message: 'Enter a valid name, username, email address, and password.' };
    }
    const users = allUsers();
    const duplicate = users.find(user =>
      normalizeIdentifier(user.username) === normalizedUsername ||
      normalizeIdentifier(user.email) === normalizedEmail
    );

    if (duplicate) {
      throw {
        status: 409,
        message: 'That username or email is already registered. Please sign in instead.'
      };
    }

    const passwordCredential = await createPasswordCredential(password);
    const newUser = {
      id: `STD-${Date.now()}`,
      studentId: `STD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      username: normalizedUsername,
      email: normalizedEmail,
      ...passwordCredential,
      name: safeName,
      department: 'Independent Learner',
      institution: 'EduVantage Learning Portal',
      role: 'student',
      bio: 'New EduVantage learner.',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=183a68&color=fff`
    };

    writeRegisteredUsers([...readRegisteredUsers(), newUser]);
    return { status: 201, user: publicUser(newUser) };
  },

  // a) Implement student login using saved local credentials
  async login(emailOrId, password, expiresInSeconds = 120) {
    await delay(400);

    const input = normalizeIdentifier(emailOrId);
    const student = allUsers().find(user =>
      normalizeIdentifier(user.email) === input ||
      normalizeIdentifier(user.username) === input ||
      normalizeIdentifier(user.studentId) === input
    );

    let credentialsValid = false;
    if (student?.passwordScheme === 'PBKDF2-SHA256') {
      credentialsValid = await verifyPassword(password, student);
    } else if (student && typeof password === 'string' && student.password === password) {
      credentialsValid = true;
      if (student.id !== DEFAULT_STUDENT.id && student.id !== DEFAULT_ADMIN.id) {
        const passwordCredential = await createPasswordCredential(password);
        const registeredUsers = readRegisteredUsers();
        writeRegisteredUsers(registeredUsers.map(user => {
          if (user.id !== student.id) return user;
          const { password: _legacyPassword, ...account } = user;
          return { ...account, ...passwordCredential };
        }));
      }
    }

    if (!student || !credentialsValid) {
      throw {
        status: 401,
        message: 'Invalid credentials. Use the username/email and password you registered with.'
      };
    }

    const authenticatedUser = publicUser(student);
    const token = createMockJwt(authenticatedUser, expiresInSeconds);

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));

    return {
      status: 200,
      token,
      user: authenticatedUser,
      expiresIn: expiresInSeconds
    };
  },

  // e) Implement logout and token removal
  async logout() {
    await delay(150);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    return { status: 200, message: "Session terminated and token flushed." };
  },

  getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  getUser() {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isExpired(token) {
    if (!token) return true;
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) return true;
    return Math.floor(Date.now() / 1000) >= decoded.exp;
  },

  // d) Restrict enrollment, quiz, assignment, and certificate operations
  async executeProtectedLearningOperation(operationName, payload = {}) {
    await delay(300);
    const token = this.getToken();

    if (!token) {
      const err = {
        status: 401,
        message: `401 Unauthorized: Valid Bearer Token required to execute '${operationName}'.`
      };
      if (onUnauthorizedHandler) onUnauthorizedHandler(err.message);
      throw err;
    }

    if (this.isExpired(token)) {
      this.logout();
      const err = {
        status: 401,
        message: `401 Unauthorized: Bearer Token has expired. Session expired.`
      };
      if (onUnauthorizedHandler) onUnauthorizedHandler(err.message);
      throw err;
    }

    return {
      status: 200,
      operation: operationName,
      message: `Operation '${operationName}' authorized with Bearer token.`,
      timestamp: new Date().toISOString(),
      payload
    };
  },

  forceExpireToken() {
    const user = this.getUser() || publicUser(DEFAULT_STUDENT);
    const expiredToken = createMockJwt(user, -30);
    localStorage.setItem(TOKEN_STORAGE_KEY, expiredToken);
    return expiredToken;
  }
};
