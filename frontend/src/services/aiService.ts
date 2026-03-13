import api from './http';

export const aiService = {
  async query(query: string) {
    const { data } = await api.post('/ai/query', { query });
    return data;
  }
};
