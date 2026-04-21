import { useMutation } from '@tanstack/react-query'
import { loginRequest } from '@shared/api/auth/authApi'
import useAuth from './useAuth'

const useLogin = () => {
	const { authenticate } = useAuth()

	return useMutation({
		mutationFn: loginRequest,
		onSuccess: response => {
			authenticate(response)
		},
	})
}

export default useLogin
