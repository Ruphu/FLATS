import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthForm from '@components/AuthForm'
import { AUTH_ERROR_MESSAGES } from '@constants/api_errors'
import { loginContent, loginFields } from '@constants/auth'
import { useAuth, useLogin } from '@hooks'
import Container from '@shared/Container'
import styles from './Login.module.scss'

const Login = () => {
	const { isAuthenticated } = useAuth()
	const location = useLocation()
	const loginMutation = useLogin()
	const navigate = useNavigate()
	const redirectTo = location.state?.from ?? '/profile'
	const errorMessage = loginMutation.isError
		? AUTH_ERROR_MESSAGES[loginMutation.error?.status] ?? AUTH_ERROR_MESSAGES.default
		: ''

	useEffect(() => {
		if (isAuthenticated) {
			navigate(redirectTo, { replace: true })
		}
	}, [isAuthenticated, navigate, redirectTo])

	const handleSubmit = async values => {
		await loginMutation.mutateAsync(values)
		navigate(redirectTo, { replace: true })
	}

	return (
		<main className={styles.page}>
			<Container>
				<AuthForm
					errorMessage={errorMessage}
					fields={loginFields}
					isSubmitting={loginMutation.isPending}
					onSubmit={handleSubmit}
					{...loginContent}
				/>
			</Container>
		</main>
	)
}

export default Login
