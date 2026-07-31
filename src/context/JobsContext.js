import React, { createContext, useContext, useState } from 'react';
import { JOBS } from '../data/jobs';

const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const [jobs] = useState(JOBS);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const applyToJob = (jobId, coverLetter) => {
    // Mock apply — replace with a real API call (e.g. POST /api/jobs/:id/apply) later.
    setAppliedJobIds((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]));
  };

  const hasApplied = (jobId) => appliedJobIds.includes(jobId);

  return (
    <JobsContext.Provider value={{ jobs, applyToJob, hasApplied }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error('useJobs must be used within a JobsProvider');
  return ctx;
}
