import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	getPreferencesRequest,
	updatePreferencesRequest,
} from '@shared/api/user/preferencesApi'

const loadPreferences = async () => {
	try {
		return await getPreferencesRequest()
	} catch (error) {
		if (error?.status === 404) {
			return null
		}

		throw error
	}
}

const usePreferences = () => {
	const queryClient = useQueryClient()
	const preferencesQuery = useQuery({
		queryKey: ['user', 'preferences'],
		queryFn: loadPreferences,
	})
	const updatePreferencesMutation = useMutation({
		mutationFn: updatePreferencesRequest,
		onSuccess: response => {
			queryClient.setQueryData(['user', 'preferences'], response)
		},
	})

	return {
		preferencesQuery,
		updatePreferencesMutation,
	}
}

export default usePreferences
