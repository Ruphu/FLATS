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

const toNumber = value => {
	const number = Number(value)
	return Number.isFinite(number) ? number : null
}

const hasText = value => String(value ?? '').trim() !== ''

const matchesFilters = (apartment, filters) => {
	if (!filters) {
		return true
	}

	const budgetMin = toNumber(filters.budgetMin)
	const budgetMax = toNumber(filters.budgetMax)
	const areaMin = toNumber(filters.areaMin)
	const areaMax = toNumber(filters.areaMax)
	const roomsCount = hasText(filters.roomsCount) ? toNumber(filters.roomsCount) : null
	const floorMin = toNumber(filters.floorMin)
	const floorMax = toNumber(filters.floorMax)
	const minutesToMetro = toNumber(filters.minutesToMetro)
	const district = String(filters.preferredDistrict ?? '').trim().toLowerCase()

	return (
		(!budgetMin || apartment.price >= budgetMin) &&
		(!budgetMax || apartment.price <= budgetMax) &&
		(!areaMin || apartment.area >= areaMin) &&
		(!areaMax || apartment.area <= areaMax) &&
		(roomsCount === null || apartment.roomsCount === roomsCount) &&
		(!floorMin || apartment.floor >= floorMin) &&
		(!floorMax || apartment.floor <= floorMax) &&
		(!minutesToMetro || apartment.minutesToMetro <= minutesToMetro) &&
		(!district || String(apartment.district ?? '').toLowerCase().includes(district)) &&
		(!filters.apartmentType || apartment.apartmentType === filters.apartmentType) &&
		(!filters.houseType || apartment.houseType === filters.houseType) &&
		(!filters.hasBalcony || apartment.hasBalcony) &&
		(!filters.hasLoggia || apartment.hasLoggia) &&
		(!filters.wantsShopsNearby || apartment.shopsNearby) &&
		(!filters.wantsSchoolsNearby || apartment.schoolsNearby) &&
		(!filters.wantsKindergartensNearby || apartment.kindergartensNearby) &&
		(!filters.wantsParksNearby || apartment.parksNearby)
	)
}

const getEmptyText = (mode, isAuthenticated) => {
	if (mode === 'favorites') {
		return isAuthenticated
			? 'Добавьте квартиры в избранное, и они появятся здесь.'
			: 'Войдите в аккаунт, чтобы сохранять квартиры в избранное.'
	}

	if (mode === 'recommended') {
		return 'Сохраните профиль предпочтений, измените фильтры или ослабьте строгий режим.'
	}

	return 'Попробуйте изменить фильтры или дождитесь новых объявлений.'
}

const CardsList = ({
	mode = 'all',
	filters,
	weights,
	onlyMatching = false,
	compareIds = [],
	onCompareToggle,
}) => {
	const navigate = useNavigate()
	const isRecommended = mode === 'recommended'
	const isFavoritesMode = mode === 'favorites'
	const apartmentsQuery = useApartments()
	const recommendedQuery = useRecommendedApartments({
		weights,
		onlyMatching,
		enabled: isRecommended,
	})
	const {
		favoritesQuery,
		addFavoriteMutation,
		deleteFavoriteMutation,
		isAuthenticated,
	} = useFavorites()
	const compareQuery = useCompareApartments(compareIds)
	const activeQuery = isFavoritesMode
		? favoritesQuery
		: isRecommended
			? recommendedQuery
			: apartmentsQuery
	const rawApartments = activeQuery.data ?? []
	const apartments = useMemo(
		() => rawApartments.filter(apartment => matchesFilters(apartment, filters)),
		[rawApartments, filters],
	)
	const favoriteIds = useMemo(
		() => new Set((favoritesQuery.data ?? []).map(apartment => apartment.id)),
		[favoritesQuery.data],
	)

	const handleDetailsClick = apartmentId => {
		navigate(`/apartment/${apartmentId}`)
	}

	const handleFavoriteToggle = apartmentId => {
		if (!isAuthenticated) {
			navigate('/login')
			return
		}

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
							: isFavoritesMode
								? 'Загружаем сохраненные квартиры.'
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

	return (
		<section className={styles.cards}>
			<div className={styles.resultBar}>
				<span>Найдено: {apartments.length}</span>
				{isFavoritesMode ? <span>Избранное хранится в вашем профиле</span> : null}
			</div>

			{compareIds.length >= 2 ? (
				<div className={styles.comparePanel}>
					<div className={styles.compareHeader}>
						<h2>Сравнение квартир</h2>
						<p>Выбрано {compareIds.length}. Данные загружаются с Python-бэка.</p>
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
									<span>Транспорт: {apartment.transportAccessibility ?? 70}/100</span>
								</div>
							))}
						</div>
					) : (
						<p className={styles.stateText}>Загружаем сравнение...</p>
					)}
				</div>
			) : null}

			{apartments.length === 0 ? (
				<div className={styles.stateCard}>
					<p className={styles.stateTitle}>
						{isFavoritesMode
							? 'В избранном пока пусто'
							: isRecommended
								? 'Нет рекомендаций'
								: 'Квартиры не найдены'}
					</p>
					<p className={styles.stateText}>
						{getEmptyText(mode, isAuthenticated)}
					</p>
				</div>
			) : (
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
							isFavoriteLoading={
								addFavoriteMutation.isPending || deleteFavoriteMutation.isPending
							}
							canUseFavorites={isAuthenticated}
							onCompareToggle={onCompareToggle}
							onDetailsClick={handleDetailsClick}
							onFavoriteToggle={handleFavoriteToggle}
						/>
					))}
				</div>
			)}
		</section>
	)
}

export default CardsList
