import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fallbackCardImage } from '@constants/card'
import useApartment from '@hooks/useApartment'
import Header from '@components/Header'
import Button from '@shared/Button'
import Container from '@shared/Container'
import styles from './Flat.module.scss'

const priceFormatter = new Intl.NumberFormat('ru-RU')
const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
})

const formatPrice = value => `${priceFormatter.format(value ?? 0)} ₽`

const formatArea = area => {
	if (!area && area !== 0) {
		return 'Не указана'
	}

	return `${priceFormatter.format(area)} м²`
}

const formatRooms = roomsCount => {
	if (roomsCount === 0) {
		return 'Студия'
	}

	if (!roomsCount && roomsCount !== 0) {
		return 'Не указано'
	}

	return `${roomsCount} комн.`
}

const formatFloor = floor => {
	if (!floor && floor !== 0) {
		return 'Не указан'
	}

	return `${floor} этаж`
}

const formatMetro = (nearestMetro, minutesToMetro) => {
	if (!nearestMetro && minutesToMetro !== 0 && !minutesToMetro) {
		return 'Метро не указано'
	}

	if (!nearestMetro) {
		return `${minutesToMetro} мин. до метро`
	}

	if (minutesToMetro || minutesToMetro === 0) {
		return `${nearestMetro}, ${minutesToMetro} мин.`
	}

	return nearestMetro
}

const buildGallery = (apartment) => {
	if (!apartment) {
		return [fallbackCardImage]
	}

	const images = [
		...(Array.isArray(apartment.images) ? apartment.images : []),
		apartment.image,
	].filter(Boolean)

	return images.length > 0 ? [...new Set(images)] : [fallbackCardImage]
}

const Flat = () => {
	const { id } = useParams()
	const { data: apartment, isLoading, isError, error } = useApartment(id)
	const [activeImageIndex, setActiveImageIndex] = useState(0)

	useEffect(() => {
		setActiveImageIndex(0)
	}, [apartment?.id])

	const gallery = buildGallery(apartment)
	const activeImage = gallery[activeImageIndex] ?? gallery[0]
	const pricePerSquareMeter =
		apartment?.price && apartment?.area
			? Math.round(apartment.price / apartment.area)
			: null
	const badges = [
		apartment?.district,
		apartment?.apartmentType === 'secondary' ? 'Вторичка' : 'Новостройка',
		apartment?.houseType,
	].filter(Boolean)
	const details = [
		{ label: 'Площадь', value: formatArea(apartment?.area) },
		{ label: 'Комнат', value: formatRooms(apartment?.roomsCount) },
		{ label: 'Этаж', value: formatFloor(apartment?.floor) },
		{
			label: 'Балкон',
			value: apartment?.hasBalcony ? 'Есть' : 'Нет',
		},
		{
			label: 'Лоджия',
			value: apartment?.hasLoggia ? 'Есть' : 'Нет',
		},
		{
			label: 'Метро',
			value: formatMetro(apartment?.nearestMetro, apartment?.minutesToMetro),
		},
	]

	return (
		<div className={styles.page}>
			<Header />

			<Container>
				<section className={styles.content}>
					<div className={styles.breadcrumbs}>
						<Link className={styles.breadcrumbLink} to='/'>
							Все квартиры
						</Link>
						<span className={styles.breadcrumbDivider}>/</span>
						<span className={styles.breadcrumbCurrent}>
							{apartment?.title ?? 'Карточка квартиры'}
						</span>
					</div>

					{isLoading ? (
						<div className={styles.stateCard}>
							<h1 className={styles.stateTitle}>Загружаем квартиру…</h1>
							<p className={styles.stateText}>
								Сейчас подтянем фотографии, характеристики и описание.
							</p>
						</div>
					) : isError ? (
						<div className={styles.stateCard}>
							<h1 className={styles.stateTitle}>Не удалось открыть квартиру</h1>
							<p className={styles.stateText}>
								{error?.message ?? 'Попробуй обновить страницу чуть позже.'}
							</p>
						</div>
					) : !apartment ? (
						<div className={styles.stateCard}>
							<h1 className={styles.stateTitle}>Квартира не найдена</h1>
							<p className={styles.stateText}>
								Возможно, объявление было удалено или ссылка устарела.
							</p>
						</div>
					) : (
						<>
							<section className={styles.hero}>
								<div className={styles.galleryPanel}>
									<div className={styles.mainImageWrapper}>
										<img
											alt={apartment.title}
											className={styles.mainImage}
											src={activeImage}
										/>
									</div>

									{gallery.length > 1 && (
										<div className={styles.thumbnailRow}>
											{gallery.map((image, index) => (
												<button
													key={`${image}-${index}`}
													className={`${styles.thumbnailButton} ${
														index === activeImageIndex ? styles.thumbnailButtonActive : ''
													}`}
													onClick={() => setActiveImageIndex(index)}
													type='button'
												>
													<img
														alt={`${apartment.title} ${index + 1}`}
														className={styles.thumbnailImage}
														src={image}
													/>
												</button>
											))}
										</div>
									)}
								</div>

								<aside className={styles.summaryCard}>
									<div className={styles.summaryTop}>
										<p className={styles.price}>{formatPrice(apartment.price)}</p>
										<p className={styles.priceMeta}>
											{pricePerSquareMeter
												? `${formatPrice(pricePerSquareMeter)} за м²`
												: 'Цена за м² появится после получения полной площади'}
										</p>
									</div>

									<div className={styles.actionGroup}>
										<Button fullWidth size='lg'>
											Связаться по объявлению
										</Button>
										<Button fullWidth size='lg' variant='secondary'>
											Сохранить в избранное
										</Button>
									</div>

									<div className={styles.locationBlock}>
										<p className={styles.locationLabel}>Адрес</p>
										<p className={styles.locationValue}>{apartment.address}</p>
										<p className={styles.metro}>
											{formatMetro(apartment.nearestMetro, apartment.minutesToMetro)}
										</p>
									</div>

									{badges.length > 0 && (
										<div className={styles.badges}>
											{badges.map(badge => (
												<span key={badge} className={styles.badge}>
													{badge}
												</span>
											))}
										</div>
									)}

									{apartment.createdAt && (
										<p className={styles.publishDate}>
											Опубликовано {dateFormatter.format(new Date(apartment.createdAt))}
										</p>
									)}
								</aside>
							</section>

							<section className={styles.infoGrid}>
								<div className={styles.mainInfo}>
									<div className={styles.titleBlock}>
										<h1 className={styles.title}>{apartment.title}</h1>
										<p className={styles.subtitle}>
											{apartment.district ? `${apartment.district} район` : 'Район не указан'}
										</p>
									</div>

									<div className={styles.specGrid}>
										{details.map(item => (
											<div key={item.label} className={styles.specCard}>
												<p className={styles.specLabel}>{item.label}</p>
												<p className={styles.specValue}>{item.value}</p>
											</div>
										))}
									</div>
								</div>

								<div className={styles.descriptionCard}>
									<h2 className={styles.sectionTitle}>Описание</h2>
									<p className={styles.description}>
										{apartment.description?.trim() ||
											'Описание пока не добавлено, но основные характеристики квартиры уже доступны выше.'}
									</p>
								</div>
							</section>
						</>
					)}
				</section>
			</Container>
		</div>
	)
}

export default Flat
