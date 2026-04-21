import { useNavigate } from 'react-router-dom'
import Card from '@components/Card'
import useApartments from '@hooks/useApartments'
import styles from './CardsList.module.scss'

const CardsList = () => {
	const navigate = useNavigate()
	const {
		data: apartments = [],
		isLoading,
		isError,
		error,
	} = useApartments()

	const handleDetailsClick = apartmentId => {
		navigate(`/apartment/${apartmentId}`)
	}

	if (isLoading) {
		return (
			<section className={styles.cards}>
				<div className={styles.stateCard}>
					<p className={styles.stateTitle}>Загружаем актуальные объявления…</p>
					<p className={styles.stateText}>Подтягиваем список квартир с сервера.</p>
				</div>
			</section>
		)
	}

	if (isError) {
		return (
			<section className={styles.cards}>
				<div className={styles.stateCard}>
					<p className={styles.stateTitle}>Не удалось загрузить список квартир</p>
					<p className={styles.stateText}>
						{error?.message ?? 'Попробуй обновить страницу чуть позже.'}
					</p>
				</div>
			</section>
		)
	}

	if (apartments.length === 0) {
		return (
			<section className={styles.cards}>
				<div className={styles.stateCard}>
					<p className={styles.stateTitle}>Квартир пока нет</p>
					<p className={styles.stateText}>
						Когда объявления появятся, они сразу отобразятся здесь.
					</p>
				</div>
			</section>
		)
	}

	return (
		<section className={styles.cards}>
			<div className={styles.grid}>
				{apartments.map(apartment => (
					<Card
						key={apartment.id}
						address={apartment.address}
						area={apartment.area}
						id={apartment.id}
						image={apartment.image}
						price={apartment.price}
						roomsCount={apartment.roomsCount}
						title={apartment.title}
						onDetailsClick={handleDetailsClick}
					/>
				))}
			</div>
		</section>
	)
}

export default CardsList
