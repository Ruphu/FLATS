import { Link, useNavigate } from 'react-router-dom'
import Container from '@shared/Container'
import useAuth from '@hooks/useAuth'
import styles from './Header.module.scss'

const Header = () => {
	const { isAuthenticated, logout } = useAuth()
	const navigate = useNavigate()

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	return (
		<header className={styles.header}>
			<Container>
				<div className={styles.wrapper}>
					<Link className={styles.logoWrapper} to='/'>
						<img alt='FLATS logo' className={styles.logo} src='/images/logo.png' />
					</Link>

					<nav className={styles.nav}>
						{isAuthenticated ? (
							<>
								<Link className={styles.link} to='/profile'>
									Профиль
								</Link>
								<button className={styles.link} onClick={handleLogout} type='button'>
									Выйти
								</button>
							</>
						) : (
							<>
								<Link className={styles.link} to='/login'>
									Вход
								</Link>
								<Link className={styles.link} to='/register'>
									Регистрация
								</Link>
							</>
						)}
					</nav>
				</div>
			</Container>
		</header>
	)
}

export default Header
