import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '@components/AuthForm'
import { AUTH_ERROR_MESSAGES } from '@constants/api_errors'
import { registerContent, registerFields } from '@constants/auth'
import { useAuth, useRegister } from '@hooks'
import Container from '@shared/Container'
import styles from './Register.module.scss'

const Register = () => {
	const { isAuthenticated } = useAuth()
	const navigate = useNavigate()
	const registerMutation = useRegister()
	const errorMessage = registerMutation.isError
		? AUTH_ERROR_MESSAGES[registerMutation.error?.status] ??
			AUTH_ERROR_MESSAGES.default
		: ''

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/profile', { replace: true })
		}
	}, [isAuthenticated, navigate])

	const handleSubmit = async values => {
		await registerMutation.mutateAsync(values)
		navigate('/profile', { replace: true })
	}

	return (
		<main className={styles.page}>
			<Container>
				<AuthForm
					errorMessage={errorMessage}
					fields={registerFields}
					isSubmitting={registerMutation.isPending}
					onSubmit={handleSubmit}
					{...registerContent}
				/>
			</Container>
		</main>
	)
}

export default Register
