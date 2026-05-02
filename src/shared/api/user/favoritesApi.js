import { API_PATHS } from '@constants/api_paths'
import { apiClient } from '@shared/api/apiClient'
import { normalizeApartment } from '@shared/api/apartment/apartmentApi'

export const getFavoritesRequest = async () => {
	const response = await apiClient(API_PATHS.USER.favorites)
	return Array.isArray(response) ? response.map(normalizeApartment).filter(Boolean) : []
}

export const addFavoriteRequest = async apartmentId => {
	const response = await apiClient(API_PATHS.USER.favoriteDetails(apartmentId), {
		method: 'POST',
	})
	return Array.isArray(response) ? response.map(normalizeApartment).filter(Boolean) : []
}

export const deleteFavoriteRequest = apartmentId =>
	apiClient(API_PATHS.USER.favoriteDetails(apartmentId), {
		method: 'DELETE',
	})
