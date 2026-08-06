// Fields that count toward a "complete" candidate profile, weighted
// equally. Mirrors the fields shown on CandidateProfileScreen so the
// percentage always matches what's visibly missing there.
const FIELDS = [
  (c) => !!c.profileImage,
  (c) => !!c.headline,
  (c) => !!c.about,
  (c) => !!(c.primarySkills && c.primarySkills.length),
  (c) => !!c.resume,
  (c) => !!c.hourlyRate,
  (c) => !!(c.experience && c.experience.length),
  (c) => !!c.phone,
];

export function getProfileCompletion(candidate) {
  if (!candidate) return 0;
  const filled = FIELDS.reduce((sum, check) => sum + (check(candidate) ? 1 : 0), 0);
  return Math.round((filled / FIELDS.length) * 100);
}

// Fields that count toward a "complete" company profile. Mirrors the
// fields shown on CompanyProfileScreen/EditCompanyProfileScreen.
const COMPANY_FIELDS = [
  (c) => !!c.logo,
  (c) => !!c.description,
  (c) => !!c.website,
  (c) => !!c.industry,
  (c) => !!c.contactPerson,
];

export function getCompanyProfileCompletion(company) {
  if (!company) return 0;
  const filled = COMPANY_FIELDS.reduce((sum, check) => sum + (check(company) ? 1 : 0), 0);
  return Math.round((filled / COMPANY_FIELDS.length) * 100);
}
