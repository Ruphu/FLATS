import { useMemo, useState } from 'react'
import Button from '@shared/Button'
import { criteriaSections, initialCriteria } from '@constants/propertyCriteria'
import PropertyCriteriaFields from '@shared/PropertyCriteriaFields'
import styles from './Filters.module.scss'

const initialFilters = {
	...initialCriteria,
	budgetMin: '',
	budgetMax: '',
	preferredDistrict: '',
	apartmentType: '',
	areaMin: '',
	areaMax: '',
	roomsCount: '',
	hasBalcony: false,
	hasLoggia: false,
	floorMin: '',
	floorMax: '',
	houseType: '',
	minutesToMetro: '',
	wantsShopsNearby: false,
	wantsSchoolsNearby: false,
	wantsKindergartensNearby: false,
	wantsParksNearby: false,
}

const filterSections = criteriaSections.map(section => {
	if (section.type !== 'radio' && section.type !== 'select') {
		return section
	}

	return {
		...section,
		options: [{ value: '', label: 'Любой' }, ...section.options],
	}
})

const countActiveFilters = filters =>
	Object.entries(filters).filter(([key, value]) => {
		if (typeof value === 'boolean') {
			return value
		}

		if (key === 'apartmentType' || key === 'houseType') {
			return Boolean(value)
		}

		return String(value ?? '').trim() !== ''
	}).length

const Filters = ({ onApply }) => {
	const [filters, setFilters] = useState(initialFilters)
	const activeCount = useMemo(() => countActiveFilters(filters), [filters])

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
		onApply?.(filters)
	}

	const handleReset = () => {
		setFilters(initialFilters)
		onApply?.(initialFilters)
	}

	return (
		<form className={styles.filters} onSubmit={handleSubmit}>
			<div className={styles.header}>
				<h2 className={styles.title}>Фильтры</h2>
				{activeCount > 0 ? (
					<span className={styles.counter}>{activeCount}</span>
				) : null}
			</div>

			<PropertyCriteriaFields
				criteria={filters}
				sections={filterSections}
				onCheckboxChange={handleCheckboxChange}
				onInputChange={handleInputChange}
			/>

			<div className={styles.actions}>
				<Button fullWidth size='lg' type='submit'>
					Применить
				</Button>
				<Button
					fullWidth
					size='md'
					type='button'
					variant='secondary'
					onClick={handleReset}
				>
					Сбросить
				</Button>
			</div>
		</form>
	)
}

export default Filters
