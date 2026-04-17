import { useState } from 'react'
import Button from '@shared/Button'
import Checkbox from '@shared/Checkbox'
import { filterSections, initialFilters } from '@constants/filters'
import styles from './Preferences.module.scss'
import RangeInput from '@shared/RangeInput'




const Preferences = () => {
	return (
		<>
			<h3 className={styles.pref_title}>Предпочтения</h3>
					<div className={styles.flatType_container}>
						<h3 className={styles.flatType_title}>Тип квартиры</h3>
						<div className={styles.flatType_wrapper}>
							<Checkbox name='flatType' value='new' label='Новостройка' />
							<Checkbox name='flatType' value='secondary' label='Вторичка' />
						</div>
					</div>
					
					<div className={styles.flatArea_container}>
						<RangeInput
							title='Площадь, м²'
							nameMin='areaMin'
							nameMax='areaMax'
						/>
					</div>
					
					<div className={styles.roomNumber_container}>
						<RangeInput
							title='Количество комнат'
							nameMin='roomNumberMin'
							nameMax='roomNumberMax'
						/>
					</div>
					
					<div className={styles.floor_container}>
						<RangeInput title='Этаж' nameMin='floorMin' nameMax='floorMax' />
					</div>
					
					<div className={styles.isBalcony_container}>
						<h3 className={styles.isBalcony_title}>
							Наличие балкона/лоджии
						</h3>
						<div className={styles.isBalcony_wrapper}>
							<Checkbox name='isBalcony' value='balcony' label='Балкон' />
							<Checkbox name='isBalcony' value='loggia' label='Лоджия' />
						</div>
					</div>
					<Button className={styles.buttonConfirm}>Сохранить</Button>
		</>
	)
}

export default Preferences

