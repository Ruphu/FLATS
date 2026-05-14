import styles from './RangeInput.module.scss'

const moneyFormatter = new Intl.NumberFormat('ru-RU')

const onlyDigits = value => String(value ?? '').replace(/\D/g, '')

const formatValue = (value, format) => {
	if (format !== 'money') {
		return value
	}

	const digits = onlyDigits(value)
	return digits ? moneyFormatter.format(Number(digits)) : ''
}

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
		format,
	} = props

	const inputType = format === 'money' ? 'text' : 'number'
	const inputClassName = `${styles.input} ${
		format === 'money' ? styles.moneyInput : ''
	}`

	const handleChange = event => {
		if (format !== 'money') {
			onChange?.(event)
			return
		}

		onChange?.({
			...event,
			target: {
				...event.target,
				name: event.target.name,
				value: onlyDigits(event.target.value),
			},
		})
	}

	return (
		<fieldset className={styles.group}>
			<legend className={styles.title}>{title}</legend>
			<div className={styles.inputs}>
				<input
					type={inputType}
					inputMode='numeric'
					min={minMin}
					step={step}
					placeholder='от'
					name={nameMin}
					value={formatValue(valueMin, format)}
					onChange={handleChange}
					className={inputClassName}
					aria-label={`${title} от`}
				/>
				<input
					type={inputType}
					inputMode='numeric'
					min={minMax}
					step={step}
					placeholder='до'
					name={nameMax}
					value={formatValue(valueMax, format)}
					onChange={handleChange}
					className={inputClassName}
					aria-label={`${title} до`}
				/>
			</div>
		</fieldset>
	)
}

export default RangeInput
