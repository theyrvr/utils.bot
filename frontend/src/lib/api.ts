import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Config API
export const configAPI = {
  get: (guildId: string) => api.get(`/config/${guildId}`),
  update: (guildId: string, data: any) => api.put(`/config/${guildId}`, data),
};

// Tickets API
export const ticketsAPI = {
  getAll: (guildId: string, status?: string) => 
    api.get(`/tickets/${guildId}`, { params: { status } }),
  getOne: (guildId: string, ticketId: string) => 
    api.get(`/tickets/${guildId}/${ticketId}`),
  getStats: (guildId: string) => 
    api.get(`/tickets/${guildId}/stats`),
};

// Menus API
export const menusAPI = {
  getAll: (guildId: string) => api.get(`/menus/${guildId}`),
  create: (guildId: string, data: any) => api.post(`/menus/${guildId}`, data),
  update: (guildId: string, menuId: string, data: any) => 
    api.put(`/menus/${guildId}/${menuId}`, data),
  delete: (guildId: string, menuId: string) => 
    api.delete(`/menus/${guildId}/${menuId}`),
};

// Messages API
export const messagesAPI = {
  getAll: (guildId: string) => api.get(`/messages/${guildId}`),
  getOne: (guildId: string, key: string) => 
    api.get(`/messages/${guildId}/${key}`),
  upsert: (guildId: string, key: string, data: any) => 
    api.put(`/messages/${guildId}/${key}`, data),
  delete: (guildId: string, key: string) => 
    api.delete(`/messages/${guildId}/${key}`),
};

// Webhooks API
export const webhooksAPI = {
  getAll: (guildId: string) => api.get(`/webhooks/${guildId}`),
  create: (guildId: string, data: any) => api.post(`/webhooks/${guildId}`, data),
  update: (guildId: string, webhookId: string, data: any) => 
    api.put(`/webhooks/${guildId}/${webhookId}`, data),
  delete: (guildId: string, webhookId: string) => 
    api.delete(`/webhooks/${guildId}/${webhookId}`),
};

// Logs API
export const logsAPI = {
  getAll: (guildId: string, limit?: number) => 
    api.get(`/logs/${guildId}`, { params: { limit } }),
};
