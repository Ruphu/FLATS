import Checkbox from '@shared/Checkbox'
import styles from './Filters.module.scss'
import RangeInput from '@shared/RangeInput'
import Container from '@shared/Container'
import CheckboxWrapper from '@shared/CheckboxWrapper'
import Separator from '@shared/Separator'

const Filters = () => {
	return (
		<section className={styles.catalog}>
			<div className={styles.filters}>
				<h2 className={styles.filters_title}>Фильтрация</h2>
				<div className={styles.filters_flatType_container}>
					<h3 className={styles.filters_flatType_title}>Тип квартиры</h3>
					<CheckboxWrapper className={styles.filters_flatType_wrapper}>
						<Checkbox name='flatType' value='new' label='Новостройка' />
						<Checkbox name='flatType' value='secondary' label='Вторичка' />
					</CheckboxWrapper>
				</div>
				<Separator></Separator>
				<div className={styles.filters_flatArea_container}>
					<RangeInput title='Площадь, м²' nameMin='areaMin' nameMax='areaMax' />
				</div>
				<Separator></Separator>
				<div className={styles.filters_roomNumber_container}>
					<RangeInput
						title='Количество комнат'
						nameMin='roomNumberMin'
						nameMax='roomNumberMax'
					/>
				</div>
				<Separator></Separator>
				<div className={styles.filters_floor_container}>
					<RangeInput title='Этаж' nameMin='floorMin' nameMax='floorMax' />
				</div>
				<Separator></Separator>
				<div className={styles.filters_isBalcony_container}>
					<h3 className={styles.filters_isBalcony_title}>Наличие балкона/лоджии</h3>
					<CheckboxWrapper className={styles.filters_isBalcony_wrapper}>
						<Checkbox name='isBalcony' value='balcony' label='Балкон' />
						<Checkbox name='isBalcony' value='loggia' label='Лоджия' />
					</CheckboxWrapper>
				</div>
				<button className={styles.filters_buttonConfirm}>Применить</button>

			</div>
			<div className={styles.cards}></div>
		</section>
	)
}

export default Filters
