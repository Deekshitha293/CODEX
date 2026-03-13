import api from './http';

export type LoginPayload = { phone: string; password: string };
export type RegisterPayload = {
  name: string;
  phone: string;
  password: string;
  storeName: string;
  storeCategory: string;
  language?: string;
};

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await api.post('/auth/register', payload);
    if (data.token) localStorage.setItem('vyaparai_jwt', data.token);
    return data;
  },
  async login(payload: LoginPayload) {
    const { data } = await api.post('/auth/login', payload);
    if (data.token) localStorage.setItem('vyaparai_jwt', data.token);
    return data;
  },
  async profile() {
    const { data } = await api.get('/auth/profile');
    return data;
  }
};
