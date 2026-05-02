import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	addFavoriteRequest,
	deleteFavoriteRequest,
	getFavoritesRequest,
} from '@shared/api/user/favoritesApi'

const useFavorites = () => {
	const queryClient = useQueryClient()
	const favoritesQuery = useQuery({
		queryKey: ['user', 'favorites'],
		queryFn: getFavoritesRequest,
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
		favoritesQuery,
		addFavoriteMutation,
		deleteFavoriteMutation,
	}
}

export default useFavorites
