import styles from './Button.module.scss'

const Button = ({
	children,
	className = '',
	fullWidth = false,
	size = 'md',
	type = 'button',
	variant = 'primary',
	...props
}) => {
	const classes = [
		styles.button,
		styles[variant],
		styles[size],
		fullWidth ? styles.fullWidth : '',
		className,
	]
		.filter(Boolean)
		.join(' ')

	return (
		<button className={classes} type={type} {...props}>
			{children}
		</button>
	)
}

export default Button
