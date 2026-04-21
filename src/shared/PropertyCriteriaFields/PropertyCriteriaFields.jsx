import Checkbox from '@shared/Checkbox'
import FormField from '@shared/FormField'
import RangeInput from '@shared/RangeInput'
import { criteriaSections } from '@constants/propertyCriteria'
import styles from './PropertyCriteriaFields.module.scss'

const PropertyCriteriaFields = ({ criteria, onCheckboxChange, onInputChange }) => {
	const renderSection = section => {
		if (section.type === 'range') {
			return (
				<div key={section.nameMin} className={styles.section}>
					<RangeInput
						title={section.title}
						nameMin={section.nameMin}
						nameMax={section.nameMax}
						valueMin={criteria[section.nameMin]}
						valueMax={criteria[section.nameMax]}
						onChange={onInputChange}
						minMin={section.minMin}
						minMax={section.minMax}
						step={section.step}
					/>
				</div>
			)
		}

		if (section.type === 'text' || section.type === 'number') {
			return (
				<div key={section.name} className={styles.section}>
					<FormField
						label={section.label}
						name={section.name}
						type={section.type}
						required={false}
						min={section.min}
						max={section.max}
						step={section.step}
						minLength={section.minLength}
						maxLength={section.maxLength}
						placeholder={section.placeholder}
						value={criteria[section.name]}
						onChange={onInputChange}
					/>
				</div>
			)
		}

		if (section.type === 'radio') {
			return (
				<fieldset key={section.name} className={styles.section}>
					<legend className={styles.sectionTitle}>{section.title}</legend>
					<div className={styles.choiceGroup}>
						{section.options.map(option => (
							<label
								key={option.value}
								className={styles.choiceOption}
								htmlFor={`${section.name}-${option.value}`}
							>
								<input
									id={`${section.name}-${option.value}`}
									className={styles.choiceInput}
									type='radio'
									name={section.name}
									value={option.value}
									checked={criteria[section.name] === option.value}
									onChange={onInputChange}
								/>
								<span>{option.label}</span>
							</label>
						))}
					</div>
				</fieldset>
			)
		}

		return (
			<fieldset key={section.title} className={styles.section}>
				<legend className={styles.sectionTitle}>{section.title}</legend>
				<div className={styles.checkboxGroup}>
					{section.options.map(option => (
						<Checkbox
							key={option.name}
							name={option.name}
							value='true'
							label={option.label}
							checked={criteria[option.name]}
							onChange={onCheckboxChange}
						/>
					))}
				</div>
			</fieldset>
		)
	}

	return <div className={styles.sections}>{criteriaSections.map(renderSection)}</div>
}

export default PropertyCriteriaFields
