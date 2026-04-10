import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthForm from '@components/AuthForm'
import Container from '@shared/Container'
import { loginContent, loginFields } from '@constants/auth'
import useAuth from '@hooks/useAuth'
import styles from './Login.module.scss'

const Login = () => {
	const { isAuthenticated, login } = useAuth()
	const location = useLocation()
	const navigate = useNavigate()
	const redirectTo = location.state?.from ?? '/profile'

	useEffect(() => {
		if (isAuthenticated) {
			navigate(redirectTo, { replace: true })
		}
	}, [isAuthenticated, navigate, redirectTo])

	const handleSubmit = async values => {
		await login(values)
		navigate(redirectTo, { replace: true })
	}

	return (
		<main className={styles.page}>
			<Container>
				<AuthForm
					fields={loginFields}
					onSubmit={handleSubmit}
					{...loginContent}
				/>
			</Container>
		</main>
	)
}

export default Login
