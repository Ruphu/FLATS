import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAuth from '@hooks/useAuth'
import {
	addFavoriteRequest,
	deleteFavoriteRequest,
	getFavoritesRequest,
} from '@shared/api/user/favoritesApi'

const useFavorites = () => {
	const queryClient = useQueryClient()
	const { isAuthenticated } = useAuth()
	const favoritesQuery = useQuery({
		queryKey: ['user', 'favorites'],
		queryFn: getFavoritesRequest,
		enabled: isAuthenticated,
		retry: false,
	})

	const refresh = () => queryClient.invalidateQueries({ queryKey: ['user', 'favorites'] })

	const addFavoriteMutation = useMutation({
		mutationFn: addFavoriteRequest,
		onSuccess: refresh,
	})

	const deleteFavoriteMutation = useMutation({
		mutationFn: deleteFavoriteRequest,
		onSuccess: refresh,
	})

	return {
		addFavoriteMutation,
		deleteFavoriteMutation,
		favoritesQuery,
		isAuthenticated,
	}
}

export default useFavorites
