import api from './http';

export const invoiceService = {
  async create(payload: any) {
    const { data } = await api.post('/invoices', payload);
    return data;
  },
  async list() {
    const { data } = await api.get('/invoices');
    return data;
  }
};
