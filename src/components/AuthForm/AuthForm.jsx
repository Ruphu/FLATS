import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@shared/Button'
import FormField from '@shared/FormField'
import styles from './AuthForm.module.scss'

const createInitialValues = fields =>
	fields.reduce((accumulator, field) => {
		accumulator[field.name] = field.defaultValue ?? ''
		return accumulator
	}, {})

const AuthForm = ({
	alternateLinkLabel,
	alternateLinkTo,
	alternateText,
	description,
	fields,
	onSubmit,
	submitLabel,
	title,
}) => {
	const [formValues, setFormValues] = useState(() => createInitialValues(fields))
	const [errorMessage, setErrorMessage] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleChange = event => {
		const { name, value } = event.target

		setFormValues(currentValues => ({
			...currentValues,
			[name]: value,
		}))
	}

	const handleSubmit = async event => {
		event.preventDefault()
		setErrorMessage('')
		setIsSubmitting(true)

		try {
			await onSubmit(formValues)
		} catch (error) {
			setErrorMessage(error.message ?? 'Something went wrong')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className={styles.card}>
			<div className={styles.heading}>
				<p className={styles.kicker}>FLATS auth</p>
				<h1 className={styles.title}>{title}</h1>
				<p className={styles.description}>{description}</p>
			</div>

			<form className={styles.form} onSubmit={handleSubmit}>
				{fields.map(field => (
					<FormField
						autoComplete={field.autoComplete}
						id={field.name}
						key={field.name}
						label={field.label}
						name={field.name}
						onChange={handleChange}
						placeholder={field.placeholder}
						required={field.required}
						type={field.type}
						value={formValues[field.name]}
					/>
				))}

				{errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

				<Button className={styles.submit} disabled={isSubmitting} fullWidth size='lg' type='submit'>
					{isSubmitting ? 'Отправляем...' : submitLabel}
				</Button>
			</form>

			<p className={styles.footer}>
				{alternateText}{' '}
				<Link className={styles.footerLink} to={alternateLinkTo}>
					{alternateLinkLabel}
				</Link>
			</p>
		</section>
	)
}

export default AuthForm
