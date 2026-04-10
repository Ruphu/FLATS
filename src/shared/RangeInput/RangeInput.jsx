import styles from './RangeInput.module.scss'

const RangeInput = props => {
	const { title, nameMin, nameMax, valueMin = '', valueMax = '', onChange } = props

	return (
		<fieldset className={styles.group}>
			<legend className={styles.title}>{title}</legend>
			<div className={styles.inputs}>
				<input
					type='number'
					inputMode='numeric'
					min='0'
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
					min='0'
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
