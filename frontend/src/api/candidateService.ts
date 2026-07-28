import { api } from './client';

export type CandidateQuery = {
  q?: string;
  skill?: string;
  developerType?: string;
  minRate?: number;
  maxRate?: number;
  city?: string;
  remote?: boolean;
  verified?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
};

function toQueryString(params: Record<string, any>) {
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return parts.length ? `?${parts.join('&')}` : '';
}

export const candidateService = {
  // GET /api/v1/candidates/search — NOT /candidates (there is no bare list
  // route). Query param is `q`, not `search`. See routes/candidateRoutes.js.
  search: (query: CandidateQuery = {}) => api.get(`/candidates/search${toQueryString(query)}`),
  getById: (id: string) => api.get(`/candidates/${id}`),
  getMyProfile: () => api.get('/candidates/me/profile'),
  updateMyProfile: (payload: any) => api.put('/candidates/me/profile', payload),
};
