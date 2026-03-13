import api from './http';

export const productService = {
  async list(params?: { page?: number; limit?: number; category?: string; search?: string; barcode?: string }) {
    const { data } = await api.get('/products', { params });
    return data;
  },
  async create(payload: any) {
    const { data } = await api.post('/products', payload);
    return data;
  },
  async update(id: string, payload: any) {
    const { data } = await api.put(`/products/${id}`, payload);
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
  async expiryAlerts() {
    const { data } = await api.get('/products/expiry-alerts');
    return data;
  }
};
