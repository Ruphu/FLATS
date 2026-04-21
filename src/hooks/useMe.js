import { useQuery } from '@tanstack/react-query'
import { getMeRequest } from '@shared/api/auth/authApi'
import useAuth from './useAuth'

const useMe = () => {
	const { isAuthenticated } = useAuth()

	return useQuery({
		queryKey: ['auth', 'me'],
		queryFn: getMeRequest,
		enabled: isAuthenticated,
	})
}

export default useMe
