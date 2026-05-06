import { useEffect, useState } from 'react'
import { fallbackCardImage } from '@constants/card'
import Button from '@shared/Button'
import styles from './Card.module.scss'

const priceFormatter = new Intl.NumberFormat('ru-RU')

const Card = ({
	id,
	image,
	title,
	address,
	price = 0,
	area,
	roomsCount,
	rank,
	score,
	isFavorite = false,
	isCompared = false,
	isFavoriteLoading = false,
	canUseFavorites = false,
	onDetailsClick,
	onFavoriteToggle,
	onCompareToggle,
}) => {
	const [imageSrc, setImageSrc] = useState(image || fallbackCardImage)

	useEffect(() => {
		setImageSrc(image || fallbackCardImage)
	}, [image])
	const specs = [
		area ? `${area} м²` : null,
		roomsCount || roomsCount === 0
			? roomsCount === 0
				? 'Студия'
				: `${roomsCount} комн.`
			: null,
	].filter(Boolean)

	const handleDetailsClick = () => {
		onDetailsClick?.(id)
	}

	const scorePercent = score || score === 0 ? Math.round(score * 100) : null
	const favoriteText = !canUseFavorites
		? 'Войдите'
		: isFavoriteLoading
			? 'Сохраняем...'
			: isFavorite
				? 'В избранном'
				: 'В избранное'

	return (
		<article className={styles.card}>
			<div className={styles.media}>
				<img
					alt={title ? `Квартира ${title}` : 'Квартира'}
					className={styles.image}
					src={imageSrc}
					onError={() => setImageSrc(fallbackCardImage)}
				/>
				{rank ? <span className={styles.rank}>#{rank}</span> : null}
				{specs.length > 0 && (
					<div className={styles.badges}>
						{specs.map(spec => (
							<span key={spec} className={styles.badge}>
								{spec}
							</span>
						))}
					</div>
				)}
			</div>

			<div className={styles.content}>
				<div className={styles.header}>
					<h3 className={styles.title}>{title}</h3>
					<p className={styles.address}>{address}</p>
					{scorePercent !== null ? (
						<div className={styles.score}>
							<span>Соответствие</span>
							<strong>{scorePercent}%</strong>
						</div>
					) : null}
				</div>

				<div className={styles.footer}>
					<p className={styles.price}>{priceFormatter.format(price)} ₽</p>
					<Button
						className={styles.button}
						disabled={!onDetailsClick}
						onClick={handleDetailsClick}
						variant='soft'
					>
						Подробнее
					</Button>
				</div>

				<div className={styles.secondaryActions}>
					<Button
						fullWidth
						disabled={isFavoriteLoading}
						onClick={() => onFavoriteToggle?.(id)}
						variant={isFavorite ? 'primary' : 'secondary'}
					>
						{favoriteText}
					</Button>
					<Button
						fullWidth
						onClick={() => onCompareToggle?.(id)}
						variant={isCompared ? 'primary' : 'secondary'}
					>
						{isCompared ? 'Сравнивается' : 'Сравнить'}
					</Button>
				</div>
			</div>
		</article>
	)
}

export default Card
