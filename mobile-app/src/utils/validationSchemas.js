import * as yup from 'yup';

// Mirrors backend/src/validators/authValidator.js exactly, so the client
// rejects invalid input with the same rules the server enforces (no new
// business rules invented client-side).
const passwordRule = yup
  .string()
  .min(8, 'Password must be at least 8 characters')
  .matches(/[a-z]/, 'Must contain a lowercase letter')
  .matches(/[A-Z]/, 'Must contain an uppercase letter')
  .matches(/\d/, 'Must contain a number')
  .matches(/[^A-Za-z0-9]/, 'Must contain a special character')
  .required('Password is required');

export const loginSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const registerCandidateSchema = yup.object({
  name: yup.string().min(2).max(100).required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: passwordRule,
  phone: yup.string().min(7).max(20).optional(),
  hourlyRate: yup.number().min(0).optional(),
});

export const registerCompanySchema = yup.object({
  name: yup.string().min(2).max(100).required('Contact name is required'),
  companyName: yup.string().min(2).max(150).required('Company name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: passwordRule,
  phone: yup.string().min(7).max(20).optional(),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
});
