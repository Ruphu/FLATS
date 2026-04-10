import styles from './Cards.module.scss'
import Card from '@components/Card'

const apartments = [
	{
		id: 1,
		title: 'ЖК Акватория',
		address: 'ул. Ленина, 25, Москва',
		price: 8500000,
		area: 45,
		rooms: 2,
		image:
			'https://img.freepik.com/free-photo/modern-apartment-with-beautiful-furniture-wide-window_1268-27958.jpg?semt=ais_hybrid',
	},
	{
		id: 2,
		title: 'ЖК Белый Остров',
		address: 'пр. Мира, 10, Москва',
		price: 5200000,
		area: 28,
		rooms: 1,
		image:
			'https://img.freepik.com/premium-photo/modern-loft-apartment-with-open-floor-plan-showcasing-sleek-kitchen-comfortable-living-area-with-large-sectional-sofa-floortoceiling-windows-offering-stunning-city-view_1145402-2417.jpg?semt=ais_hybrid&w=740',
	},
	{
		id: 3,
		title: 'ЖК Белый Остров',
		address: 'пр. Мира, 10, Москва',
		price: 5200000,
		area: 28,
		rooms: 1,
		image: '../../assets/images/2.jpg',
	},
	{
		id: 4,
		title: 'ЖК Белый Остров',
		address: 'пр. Мира, 10, Москва',
		price: 5200000,
		area: 28,
		rooms: 1,
		image: '../../assets/images/2.jpg',
	},
	{
		id: 5,
		title: 'ЖК Белый Остров',
		address: 'пр. Мира, 10, Москва',
		price: 5200000,
		area: 28,
		rooms: 1,
		image: '../../assets/images/2.jpg',
	},
	{
		id: 6,
		title: 'ЖК Белый Остров',
		address: 'пр. Мира, 10, Москва',
		price: 5200000,
		area: 28,
		rooms: 1,
		image: '../../assets/images/2.jpg',
	},
]

const Cards = () => {
	return (
		<section className='cards'>
			<div className={styles.cards_container}>
				{apartments.map(apartment => (
					<Card
						key={apartment.id}
						id={apartment.id}
						image={apartment.image}
						title={apartment.title}
						address={apartment.address}
						price={apartment.price}
						area={apartment.area}
						rooms={apartment.rooms}
						// onDetailsClick={handleDetailsClick}
					/>
				))}
			</div>
			<div className={styles.cards_pages_container}>
			</div>
		</section>
	)
}

export default Cards
