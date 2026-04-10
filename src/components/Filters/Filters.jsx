import { useState } from 'react'
import Button from '@shared/Button'
import Checkbox from '@shared/Checkbox'
import { filterSections, initialFilters } from '@constants/filters'
import styles from './Filters.module.scss'
import RangeInput from '@shared/RangeInput'

const toNumberOrNull = value => (value === '' ? null : Number(value))

const buildPayload = filters => ({
	flatType: Object.entries(filters.flatType)
		.filter(([, isChecked]) => isChecked)
		.map(([value]) => value),
	isBalcony: Object.entries(filters.isBalcony)
		.filter(([, isChecked]) => isChecked)
		.map(([value]) => value),
	area: {
		min: toNumberOrNull(filters.areaMin),
		max: toNumberOrNull(filters.areaMax),
	},
	roomNumber: {
		min: toNumberOrNull(filters.roomNumberMin),
		max: toNumberOrNull(filters.roomNumberMax),
	},
	floor: {
		min: toNumberOrNull(filters.floorMin),
		max: toNumberOrNull(filters.floorMax),
	},
})

const Filters = ({ onApply }) => {
	const [filters, setFilters] = useState(initialFilters)

	const handleRangeChange = event => {
		const { name, value } = event.target

		setFilters(currentFilters => ({
			...currentFilters,
			[name]: value,
		}))
	}

	const handleCheckboxChange = event => {
		const { name, value, checked } = event.target

		setFilters(currentFilters => ({
			...currentFilters,
			[name]: {
				...currentFilters[name],
				[value]: checked,
			},
		}))
	}

	const handleSubmit = event => {
		event.preventDefault()

		onApply?.(buildPayload(filters))
	}

	return (
		<form className={styles.filters} onSubmit={handleSubmit}>
			<h2 className={styles.title}>Фильтрация</h2>

			<div className={styles.sections}>
				{filterSections.map(section =>
					section.type === 'checkbox' ? (
						<fieldset key={section.name} className={styles.section}>
							<legend className={styles.sectionTitle}>{section.title}</legend>
							<div className={styles.checkboxGroup}>
								{section.options.map(option => (
									<Checkbox
										key={option.value}
										name={section.name}
										value={option.value}
										label={option.label}
										checked={filters[section.name][option.value]}
										onChange={handleCheckboxChange}
									/>
								))}
							</div>
						</fieldset>
					) : (
						<div key={section.nameMin} className={styles.section}>
							<RangeInput
								title={section.title}
								nameMin={section.nameMin}
								nameMax={section.nameMax}
								valueMin={filters[section.nameMin]}
								valueMax={filters[section.nameMax]}
								onChange={handleRangeChange}
							/>
						</div>
					),
				)}
			</div>

			<Button className={styles.confirmButton} fullWidth size='lg' type='submit'>
				Применить
			</Button>
		</form>
	)
}

export default Filters
