import { API_PATHS } from '@constants/api_paths'
import { apiClient } from '@shared/api/apiClient'

export const loginRequest = credentials =>
	apiClient(API_PATHS.AUTH.login, {
		method: 'POST',
		body: credentials,
	})

export const registerRequest = payload =>
	apiClient(API_PATHS.AUTH.register, {
		method: 'POST',
		body: payload,
	})

export const getMeRequest = () =>
	apiClient(API_PATHS.AUTH.me, {
		method: 'GET',
	})
