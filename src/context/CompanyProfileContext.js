import React, { createContext, useContext, useState } from 'react';

// Mock local data — replace this with a real API call later
// (e.g. fetch from https://e-commerce-h52b.vercel.app/company) once the backend is wired up.
const initialCompanyProfile = {
  companyName: '',
  website: '',
  industry: '',
  description: '',
  gstNumber: '',
  contactPersonName: '',
  designation: '',
  contactPhone: '',
  companyPhoneNumber: '',
  country: '',
  logoUri: null,
  plan: 'Free',
};

const CompanyProfileContext = createContext(null);

export function CompanyProfileProvider({ children }) {
  const [companyProfile, setCompanyProfile] = useState(initialCompanyProfile);

  const updateCompanyProfile = (updates) =>
    setCompanyProfile((prev) => ({ ...prev, ...updates }));

  const isComplete = Boolean(
    companyProfile.companyName && companyProfile.industry && companyProfile.contactPersonName
  );

  return (
    <CompanyProfileContext.Provider value={{ companyProfile, updateCompanyProfile, isComplete }}>
      {children}
    </CompanyProfileContext.Provider>
  );
}

export function useCompanyProfile() {
  const ctx = useContext(CompanyProfileContext);
  if (!ctx) throw new Error('useCompanyProfile must be used within a CompanyProfileProvider');
  return ctx;
}
