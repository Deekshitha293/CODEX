import bcrypt from 'bcryptjs';

const enc = new TextEncoder();

export const hashPassword = async (password: string) => bcrypt.hash(password, 10);
export const verifyPassword = async (password: string, hash: string) => bcrypt.compare(password, hash);

export const createMockJWT = (payload: object) => `${btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))}.${btoa(JSON.stringify(payload))}.signature`;

export const encryptAES = async (plain: string, secret: string) => {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret.padEnd(32, '0').slice(0, 32)), 'AES-GCM', false, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plain));
  return { iv: Array.from(iv), cipher: btoa(String.fromCharCode(...new Uint8Array(cipher))) };
};

export const tlsNote = 'App requests should run over HTTPS (TLS) in production.';
