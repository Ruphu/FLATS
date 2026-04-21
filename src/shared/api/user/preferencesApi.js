import { API_PATHS } from '@constants/api_paths'
import { apiClient } from '@shared/api/apiClient'

export const getPreferencesRequest = () =>
	apiClient(API_PATHS.USER.preferences, {
		method: 'GET',
	})

export const updatePreferencesRequest = payload =>
	apiClient(API_PATHS.USER.preferences, {
		method: 'PUT',
		body: payload,
	})
