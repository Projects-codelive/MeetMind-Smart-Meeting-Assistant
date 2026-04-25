const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const API_ENDPOINTS = {
  AUTH_ME: `${API_URL}/auth/me`,
  AUTH_LOGIN: `${API_URL}/auth/login`,
  AUTH_REGISTER: `${API_URL}/auth/register`,
  MEETINGS: `${API_URL}/meetings`,
  AI_QA: `${API_URL}/ai/qa`,
  ANALYTICS_OVERVIEW: `${API_URL}/analytics/overview`,
  INTEGRATIONS: `${API_URL}/integrations`,
};

export default API_URL;