import React, { createContext, useContext, useState } from 'react';

// Mock local data — replace this with a real API call later
// (e.g. fetch from https://e-commerce-h52b.vercel.app) once the backend is wired up.
const initialProfile = {
  name: 'Spandana C',
  headline: '',
  phone: '',
  about: '',
  chargePerHour: '',
  experienceYears: '0',
  experienceMonths: '0',
  availability: 'Full time',
  developerType: '',
  primarySkills: [],
  secondarySkills: [],
  languages: [],
  portfolioLinks: '',
  githubUrl: '',
  linkedinUrl: '',
  country: '',
  remoteAvailable: true,
  visibility: 'Public — visible in search',
  rating: 4.0,
  reviewCount: 0,
  plan: 'Free',
  photoUri: null,
  resumeName: null,
  resumeUri: null,
};

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(initialProfile);

  const updateProfile = (updates) => setProfile((prev) => ({ ...prev, ...updates }));

  const isComplete = Boolean(
    profile.headline && profile.about && profile.primarySkills.length > 0
  );

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, isComplete }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
