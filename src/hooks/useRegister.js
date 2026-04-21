import { useMutation } from '@tanstack/react-query'
import { registerRequest } from '@shared/api/auth/authApi'
import useAuth from './useAuth'

const useRegister = () => {
	const { authenticate } = useAuth()

	return useMutation({
		mutationFn: registerRequest,
		onSuccess: response => {
			authenticate(response)
		},
	})
}

export default useRegister
