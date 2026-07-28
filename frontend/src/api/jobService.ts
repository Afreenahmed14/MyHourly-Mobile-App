import { api } from './client';

export type JobQuery = {
  q?: string;
  skill?: string;
  developerType?: string;
  jobType?: string;
  city?: string;
  remote?: boolean;
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

export const jobService = {
  // GET /api/v1/jobs/search — see routes/jobRoutes.js. Response shape:
  // { data: { jobs: [...], pagination } }.
  search: (query: JobQuery = {}) => api.get(`/jobs/search${toQueryString(query)}`),
  getById: (id: string) => api.get(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/me'),
};
