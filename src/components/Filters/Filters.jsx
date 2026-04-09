import Checkbox from '@shared/Checkbox'
import styles from './Filters.module.scss'
import RangeInput from '@shared/RangeInput'
import Container from '@shared/Container'
import CheckboxWrapper from '@shared/CheckboxWrapper'
import Separator from '@shared/Separator'

const Filters = () => {
	return (
		<Container>
			<section className={styles.catalog}>
				<div className={styles.filters}>
					<h2 className={styles.filters_title}>Фильтрация</h2>
					<div className={styles.filters_flatType_container}>
						<h3 className={styles.filters_flatType_title}>Тип квартиры</h3>
						<CheckboxWrapper>
							<Checkbox name='flatType' value='new' label='Новостройка' />
							<Checkbox name='flatType' value='secondary' label='Вторичка' />
						</CheckboxWrapper>
					</div>
					<div className={styles.filters_flatArea_container}>
						<RangeInput
							title='Площадь, м²'
							nameMin='areaMin'
							nameMax='areaMax'
						/>
					</div>
          <Separator></Separator>
          <div className={styles.filters_roomNumber_container}>
						<RangeInput
							title='Количество комнат'
							nameMin='roomNumberMin'
							nameMax='roomNumberMax'
						/>
					</div>
				</div>
				<div className={styles.cards}></div>
			</section>
		</Container>
	)
}

export default Filters
