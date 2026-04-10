import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '@components/AuthForm'
import Container from '@shared/Container'
import { registerContent, registerFields } from '@constants/auth'
import useAuth from '@hooks/useAuth'
import styles from './Register.module.scss'

const Register = () => {
	const { isAuthenticated, register } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/profile', { replace: true })
		}
	}, [isAuthenticated, navigate])

	const handleSubmit = async values => {
		await register(values)
		navigate('/profile', { replace: true })
	}

	return (
		<main className={styles.page}>
			<Container>
				<AuthForm
					fields={registerFields}
					onSubmit={handleSubmit}
					{...registerContent}
				/>
			</Container>
		</main>
	)
}

export default Register
