import { Group } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://gcnk24an01.execute-api.ap-south-1.amazonaws.com/prod/api';
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  return response.json();
};

const fetchWithTLS = async (url: string, options?: RequestInit) => {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
};

export const api = {
  async getGroups(params?: { search?: string; category?: string; platform?: string }): Promise<Group[]> {
    const url = new URL(`${API_BASE_URL}/groups`);
    if (params?.search) url.searchParams.append('search', params.search);
    if (params?.category) url.searchParams.append('category', params.category);
    if (params?.platform) url.searchParams.append('platform', params.platform);
    
    const response = await fetchWithTLS(url.toString());
    return handleResponse(response);
  },

  async getGroup(id: string): Promise<Group> {
    const response = await fetchWithTLS(`${API_BASE_URL}/groups/${id}`);
    return handleResponse(response);
  },

  async createGroup(group: Omit<Group, 'id' | 'members' | 'created_at'>): Promise<Group> {
    const response = await fetchWithTLS(`${API_BASE_URL}/groups`, {
      method: 'POST',
      body: JSON.stringify(group),
    });
    return handleResponse(response);
  },

  async getCategories(): Promise<string[]> {
    const response = await fetchWithTLS(`${API_BASE_URL}/categories`);
    return handleResponse(response);
  },

  async getPlatforms(): Promise<string[]> {
    const response = await fetchWithTLS(`${API_BASE_URL}/platforms`);
    return handleResponse(response);
  },

  async getUser(id: string): Promise<any> {
    const response = await fetchWithTLS(`${API_BASE_URL}/users/${id}`);
    return handleResponse(response);
  },

  async getUserGroups(id: string): Promise<Group[]> {
    const response = await fetchWithTLS(`${API_BASE_URL}/users/${id}/groups`);
    return handleResponse(response);
  },

  async updateUser(id: string, userData: any): Promise<any> {
    const response = await fetchWithTLS(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  async leaveGroup(userId: string, groupId: string): Promise<void> {
    const response = await fetchWithTLS(`${API_BASE_URL}/users/${userId}/leave/${groupId}`, {
      method: 'POST',
    });
    await handleResponse(response);
  }
};