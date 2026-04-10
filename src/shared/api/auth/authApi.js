import { apiClient } from '@shared/api/apiClient';
import { AUTH_API_PATHS } from '@config/api';

export const loginRequest = (credentials) =>
  apiClient(AUTH_API_PATHS.login, {
    method: 'POST',
    body: credentials,
  });

export const registerRequest = (payload) =>
  apiClient(AUTH_API_PATHS.register, {
    method: 'POST',
    body: payload,
  });

export const getMeRequest = () =>
  apiClient(AUTH_API_PATHS.me, {
    method: 'GET',
  });
