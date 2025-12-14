import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const userFilterSchema = yup.object().shape({
  search: yup.string().optional(),
  status: yup.string().oneOf(['active', 'suspended', 'closed', '']).optional(),
  verified: yup.boolean().optional(),
});

export const transactionFilterSchema = yup.object().shape({
  type: yup.string().optional(),
  status: yup.string().oneOf(['pending', 'completed', 'failed', '']).optional(),
  startDate: yup.date().optional(),
  endDate: yup.date().optional(),
});

