import styles from './Checkbox.module.scss'

const Checkbox = ({ name, value, label, checked, onChange }) => {
	const id = `${name}-${value}`

	return (
		<div className={styles.wrapper}>
			<input
				id={id}
				className={styles.input}
				type='checkbox'
				name={name}
				value={value}
				checked={checked}
				onChange={onChange}
			/>
			<label htmlFor={id} className={styles.label}>
				{label}
			</label>
		</div>
	)
}

export default Checkbox
