import React, { createContext, useContext, useState } from 'react';
import { JOBS } from '../data/jobs';

const JobsContext = createContext(null);

function formatPostedDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Seed a couple of "My Jobs" entries so the screen isn't empty on first run.
const INITIAL_POSTED_JOBS = JOBS.slice(0, 1).map((job) => ({
  ...job,
  status: 'open',
  applicantsCount: 0,
  skills: job.skill ? [job.skill] : [],
  jobType: job.jobType || 'Full-time',
}));

export function JobsProvider({ children }) {
  const [jobs] = useState(JOBS);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  // Mock "My Jobs" for the logged-in company — replace with a real API call
  // (e.g. GET /api/company/jobs) once the backend is wired up.
  const [postedJobs, setPostedJobs] = useState(INITIAL_POSTED_JOBS);

  const applyToJob = (jobId, coverLetter) => {
    // Mock apply — replace with a real API call (e.g. POST /api/jobs/:id/apply) later.
    setAppliedJobIds((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]));
  };

  const hasApplied = (jobId) => appliedJobIds.includes(jobId);

  const getJobById = (jobId) => postedJobs.find((j) => j.id === jobId);

  const postJob = (jobData) => {
    // Mock post — replace with a real API call (e.g. POST /api/company/jobs) later.
    const now = new Date();
    const newJob = {
      ...jobData,
      id: String(Date.now()),
      status: 'open',
      applicantsCount: 0,
      postedDate: formatPostedDate(now),
      postedAgo: 'Just now',
    };
    setPostedJobs((prev) => [newJob, ...prev]);
    return newJob;
  };

  const updateJob = (jobId, jobData) => {
    // Mock update — replace with a real API call (e.g. PUT /api/company/jobs/:id) later.
    setPostedJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, ...jobData } : j)));
  };

  const closeJob = (jobId) => {
    setPostedJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: 'closed' } : j)));
  };

  const reopenJob = (jobId) => {
    setPostedJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: 'open' } : j)));
  };

  const deleteJob = (jobId) => {
    setPostedJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  return (
    <JobsContext.Provider
      value={{
        jobs,
        applyToJob,
        hasApplied,
        postedJobs,
        postJob,
        updateJob,
        closeJob,
        reopenJob,
        deleteJob,
        getJobById,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error('useJobs must be used within a JobsProvider');
  return ctx;
}
