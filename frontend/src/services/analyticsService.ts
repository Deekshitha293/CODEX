import api from './http';

export const analyticsService = {
  async todaySales() {
    const { data } = await api.get('/analytics/today-sales');
    return data;
  },
  async topProduct() {
    const { data } = await api.get('/analytics/top-product');
    return data;
  },
  async demand() {
    const { data } = await api.get('/analytics/demand');
    return data;
  },
  async inventorySummary() {
    const { data } = await api.get('/analytics/inventory-summary');
    return data;
  },
  async reorderRecommendations() {
    const { data } = await api.get('/analytics/reorder-recommendations');
    return data;
  },
  async expiryDiscounts() {
    const { data } = await api.get('/analytics/expiry-discounts');
    return data;
  },
  async weeklySales() {
    const { data } = await api.get('/analytics/weekly-sales');
    return data;
  },
  async customerInsights() {
    const { data } = await api.get('/analytics/customer-insights');
    return data;
  },
  async forecast() {
    const { data } = await api.get('/analytics/forecast');
    return data;
  },
  async businessScore() {
    const { data } = await api.get('/analytics/business-score');
    return data;
  },
  async adminSummary() {
    const { data } = await api.get('/analytics/admin-summary');
    return data;
  }
};
