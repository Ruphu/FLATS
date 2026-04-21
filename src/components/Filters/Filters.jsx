import { useState } from 'react'
import Button from '@shared/Button'
import { initialCriteria } from '@constants/propertyCriteria'
import { buildCriteria } from '@shared/libs'
import PropertyCriteriaFields from '@shared/PropertyCriteriaFields'
import styles from './Filters.module.scss'

const Filters = ({ onApply }) => {
	const [filters, setFilters] = useState(initialCriteria)

	const handleInputChange = event => {
		const { name, value } = event.target

		setFilters(currentFilters => ({
			...currentFilters,
			[name]: value,
		}))
	}

	const handleCheckboxChange = event => {
		const { name, checked } = event.target

		setFilters(currentFilters => ({
			...currentFilters,
			[name]: checked,
		}))
	}

	const handleSubmit = event => {
		event.preventDefault()

		onApply?.(buildCriteria(filters))
	}

	return (
		<form className={styles.filters} onSubmit={handleSubmit}>
			<h2 className={styles.title}>Фильтрация</h2>

			<PropertyCriteriaFields
				criteria={filters}
				onCheckboxChange={handleCheckboxChange}
				onInputChange={handleInputChange}
			/>

			<Button
				className={styles.confirmButton}
				fullWidth
				size='lg'
				type='submit'
			>
				Применить
			</Button>
		</form>
	)
}

export default Filters
