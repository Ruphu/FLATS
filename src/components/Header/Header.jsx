import React from 'react'
// import './Header.module.scss';  // просто импортируете файл
import {styles} from './Header.module.scss';
import logo from '../../assets/images/logo.png';

const Header = () => {
	return (
		<div className={styles.container}>
			<header className="header">
				<div className='header__wrapper'>
					<div className='header__logo-wrapper'>
						<img src={logo} alt='logo' className='header__logo' />
					</div>
					<h1>Подбор квартир</h1>
					<nav className='header__nav'>
						<a href='/'>Главная</a>
						<a href='/profile'>Профиль</a>
					</nav>
				</div>
			</header>
		</div>
	)
}

export default Header
