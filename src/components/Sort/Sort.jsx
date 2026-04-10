import Container from '@shared/Container'
import Button from '@shared/Button'
import styles from './Sort.module.scss'

const Sort = () => {
	return (
		<Container>
			<section className={styles.sort}>
				<h1 className={styles.title}>Все квартиры</h1>
				<Button size='lg' variant='secondary'className={styles.button}>
					Сортировка по рейтингу
				</Button>
			</section>
		</Container>
	)
}

export default Sort
