import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@components/Card'
import {
	useApartments,
	useCompareApartments,
	useFavorites,
	useRecommendedApartments,
} from '@hooks'
import styles from './CardsList.module.scss'

const CardsList = ({
	mode = 'all',
	weights,
	onlyMatching = false,
	compareIds = [],
	onCompareToggle,
}) => {
	const navigate = useNavigate()
	const isRecommended = mode === 'recommended'
	const apartmentsQuery = useApartments()
	const recommendedQuery = useRecommendedApartments({
		weights,
		onlyMatching,
		enabled: isRecommended,
	})
	const { favoritesQuery, addFavoriteMutation, deleteFavoriteMutation } = useFavorites()
	const compareQuery = useCompareApartments(compareIds)
	const activeQuery = isRecommended ? recommendedQuery : apartmentsQuery
	const apartments = activeQuery.data ?? []
	const favoriteIds = useMemo(
		() => new Set((favoritesQuery.data ?? []).map(apartment => apartment.id)),
		[favoritesQuery.data],
	)

	const handleDetailsClick = apartmentId => {
		navigate(`/apartment/${apartmentId}`)
	}

	const handleFavoriteToggle = apartmentId => {
		if (favoriteIds.has(apartmentId)) {
			deleteFavoriteMutation.mutate(apartmentId)
			return
		}

		addFavoriteMutation.mutate(apartmentId)
	}

	if (activeQuery.isLoading) {
		return (
			<section className={styles.cards}>
				<div className={styles.stateCard}>
					<p className={styles.stateTitle}>Загружаем квартиры...</p>
					<p className={styles.stateText}>
						{isRecommended
							? 'Считаем TOPSIS-рейтинг по вашему профилю.'
							: 'Подтягиваем список квартир с сервера.'}
					</p>
				</div>
			</section>
		)
	}

	if (activeQuery.isError) {
		return (
			<section className={styles.cards}>
				<div className={styles.stateCard}>
					<p className={styles.stateTitle}>Не удалось загрузить квартиры</p>
					<p className={styles.stateText}>
						{activeQuery.error?.message ??
							'Попробуйте обновить страницу чуть позже.'}
					</p>
				</div>
			</section>
		)
	}

	if (apartments.length === 0) {
		return (
			<section className={styles.cards}>
				<div className={styles.stateCard}>
					<p className={styles.stateTitle}>
						{isRecommended ? 'Нет рекомендаций' : 'Квартир пока нет'}
					</p>
					<p className={styles.stateText}>
						{isRecommended
							? 'Сохраните профиль предпочтений или ослабьте строгий фильтр.'
							: 'Когда объявления появятся, они сразу отобразятся здесь.'}
					</p>
				</div>
			</section>
		)
	}

	return (
		<section className={styles.cards}>
			{compareIds.length >= 2 ? (
				<div className={styles.comparePanel}>
					<div className={styles.compareHeader}>
						<h2>Сравнение квартир</h2>
						<p>Выбрано {compareIds.length}. Данные загружаются с backend2.</p>
					</div>

					{compareQuery.data?.length ? (
						<div className={styles.compareTable}>
							{compareQuery.data.map(apartment => (
								<div key={apartment.id} className={styles.compareColumn}>
									<strong>{apartment.title}</strong>
									<span>{apartment.price?.toLocaleString('ru-RU')} ₽</span>
									<span>{apartment.area} м²</span>
									<span>{apartment.roomsCount} комн.</span>
									<span>{apartment.floor} этаж</span>
									<span>{apartment.minutesToMetro} мин. до метро</span>
								</div>
							))}
						</div>
					) : (
						<p className={styles.stateText}>Загружаем сравнение...</p>
					)}
				</div>
			) : null}

			<div className={styles.grid}>
				{apartments.map(apartment => (
					<Card
						key={apartment.id}
						address={apartment.address}
						area={apartment.area}
						id={apartment.id}
						image={apartment.image}
						price={apartment.price}
						rank={apartment.rank}
						score={apartment.score}
						roomsCount={apartment.roomsCount}
						title={apartment.title}
						isCompared={compareIds.includes(apartment.id)}
						isFavorite={favoriteIds.has(apartment.id)}
						onCompareToggle={onCompareToggle}
						onDetailsClick={handleDetailsClick}
						onFavoriteToggle={handleFavoriteToggle}
					/>
				))}
			</div>
		</section>
	)
}

export default CardsList
