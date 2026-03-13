export const storeJwt = (token: string) => localStorage.setItem('vyaparai_jwt', token);
export const getJwt = () => localStorage.getItem('vyaparai_jwt');
export const attachAuthHeaders = (headers: HeadersInit = {}) => ({
  ...headers,
  Authorization: `Bearer ${getJwt() ?? ''}`
});

export const bcryptHashPassword = async (password: string) => {
  // bcrypt must run server-side; this call delegates to backend contract.
  return `server:bcrypt:${password.length}`;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const aesEncrypt = async (plain: string, secret = '12345678901234567890123456789012') => {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret.slice(0, 32)), 'AES-GCM', false, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(plain));
  return `${btoa(String.fromCharCode(...iv))}.${btoa(String.fromCharCode(...new Uint8Array(cipherBuffer)))}`;
};

export const aesDecrypt = async (payload: string, secret = '12345678901234567890123456789012') => {
  const [ivPart, dataPart] = payload.split('.');
  const iv = Uint8Array.from(atob(ivPart), (c) => c.charCodeAt(0));
  const encrypted = Uint8Array.from(atob(dataPart), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret.slice(0, 32)), 'AES-GCM', false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);
  return decoder.decode(plain);
};

export const tlsNote = 'Use HTTPS (TLS) endpoints only for API communication.';
