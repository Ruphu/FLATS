import styles from './Card.module.scss'

const Card = (
	id,
	image,
	title,
	address,
	price = 0,
	area,
	rooms,
	onDetailsClick,
) => {
	return (
		<div className={styles.card_wrapper}>
			<img
				src={
					image ||
					'https://img.freepik.com/premium-photo/modern-minimalistic-interior-design-light-bright-monochrome-room-with-black-white-furniture-clean-white-walls-huge-windows_267786-4897.jpg?semt=ais_hybrid'
				}
				alt='flat'
				className={styles.card_img}
			/>
			<h4 className={styles.card_title}>{title}</h4>
			<p className={styles.card_text}>{address}</p>
			<div className={styles.card_info_wrapper}>
				<p className={styles.card_price}>{price.toLocaleString()} ₽</p>
				<button className={styles.card_btn} onClick={() => onDetailsClick(id)}>
					Подробнее
				</button>
			</div>
		</div>
	)
}

export default Card
