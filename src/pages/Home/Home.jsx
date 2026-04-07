import React from 'react'
import Header from '../../components/Header/Header'
import Checkbox from '../../components/Checkbox/Checkbox'
import RangeInput from '../../components/RangeInput/RangeInput';
import styles from './Home.module.scss'

const Home = () => {
	return (
		<div className={styles.home}>
			<Header />
			<div className='container'>
				<section className={styles.greetings}>
					<h1 className={styles.greetings_title}>Все квартиры</h1>
					<div className={styles.greetings_btn_wrapper}>
						<button className={styles.greetings_btn}>
							Сортировка по рейтингу
						</button>
					</div>
				</section>
			</div>
			<div className='container'>
				<section className={styles.catalog}>
					<div className={styles.filters}>
						<h2 className={styles.filters_title}>Фильтрация</h2>
						<div className={styles.filters_flatType_container}>
							<h3 className={styles.filters_flatType_title}>Тип квартиры</h3>
							<Checkbox name='flatType' value='new' label='Новостройка' />
							<Checkbox name='flatType' value='secondary' label='Вторичка' />
						</div>
						<div className={styles.filters_flatArea_container}>
							<RangeInput
								title='Площадь, м²'
								nameMin='areaMin'
								nameMax='areaMax'
							/>
						</div>
					</div>
					<div className={styles.cards}></div>
				</section>
			</div>
		</div>
	)
}

export default Home
