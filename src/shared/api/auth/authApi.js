import { apiClient } from '@shared/api/apiClient';

export const loginRequest = (credentials) =>
  apiClient('/auth/login', {
    method: 'POST',
    body: credentials,
  });

export const registerRequest = (payload) =>
  apiClient('/auth/register', {
    method: 'POST',
    body: payload,
  });

export const getMeRequest = () =>
  apiClient('/auth/me', {
    method: 'GET',
  });
