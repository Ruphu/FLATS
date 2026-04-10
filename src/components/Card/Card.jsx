import Button from '@shared/Button'
import { fallbackCardImage } from '@constants/card'
import styles from './Card.module.scss'

const priceFormatter = new Intl.NumberFormat('ru-RU')

const Card = ({
	id,
	image,
	title,
	address,
	price = 0,
	area,
	rooms,
	onDetailsClick,
}) => {
	const specs = [area ? `${area} м²` : null, rooms ? `${rooms} комн.` : null].filter(Boolean)

	const handleDetailsClick = () => {
		onDetailsClick?.(id)
	}

	return (
		<article className={styles.card}>
			<div className={styles.media}>
				<img
					src={image || fallbackCardImage}
					alt={title ? `Квартира ${title}` : 'Квартира'}
					className={styles.image}
				/>
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
			</div>
		</article>
	)
}

export default Card
