import React from 'react'
// import global_styles from '../../styles/global.scss';
import styles from './Header.module.scss'
import logo from '../../assets/images/logo.png'

const Header = () => {
	return (
		<header className={styles.header}>
			<div className='container'>
				<div className={styles.wrapper}>
					<div className={styles.logo_wrapper}>
						<img src={logo} alt='logo' className={styles.logo} />
					</div>
					<nav className={styles.nav}>
						<a href='/registration' className={`btn ${styles.nav_btn}`}>
							Вход
						</a>
						<a href='#' className={`btn ${styles.nav_btn}`}>
							Избранное
						</a>
					</nav>
				</div>
			</div>
		</header>
	)
}

export default Header
