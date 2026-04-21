import styles from './RangeInput.module.scss'

const RangeInput = props => {
	const {
		title,
		nameMin,
		nameMax,
		valueMin = '',
		valueMax = '',
		onChange,
		minMin = '0',
		minMax = '0',
		step = '1',
	} = props

	return (
		<fieldset className={styles.group}>
			<legend className={styles.title}>{title}</legend>
			<div className={styles.inputs}>
				<input
					type='number'
					inputMode='numeric'
					min={minMin}
					step={step}
					placeholder='от'
					name={nameMin}
					value={valueMin}
					onChange={onChange}
					className={styles.input}
					aria-label={`${title} от`}
				/>
				<input
					type='number'
					inputMode='numeric'
					min={minMax}
					step={step}
					placeholder='до'
					name={nameMax}
					value={valueMax}
					onChange={onChange}
					className={styles.input}
					aria-label={`${title} до`}
				/>
			</div>
		</fieldset>
	)
}

export default RangeInput
