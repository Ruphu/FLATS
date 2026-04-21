import { useEffect, useState } from 'react'
import Button from '@shared/Button'
import { PREFERENCES_ERROR_MESSAGES } from '@constants/api_errors'
import { initialCriteria } from '@constants/propertyCriteria'
import { buildCriteria } from '@shared/libs'
import { usePreferences } from '@hooks'
import PropertyCriteriaFields from '@shared/PropertyCriteriaFields'
import styles from './Preferences.module.scss'

const Preferences = () => {
	const [preferences, setPreferences] = useState(initialCriteria)
	const { preferencesQuery, updatePreferencesMutation } = usePreferences()
	const loadErrorMessage = preferencesQuery.isError
		? PREFERENCES_ERROR_MESSAGES.load[preferencesQuery.error?.status] ??
			PREFERENCES_ERROR_MESSAGES.load.default
		: ''
	const saveErrorMessage = updatePreferencesMutation.isError
		? PREFERENCES_ERROR_MESSAGES.save[updatePreferencesMutation.error?.status] ??
			PREFERENCES_ERROR_MESSAGES.save.default
		: ''

	useEffect(() => {
		if (!preferencesQuery.data) {
			return
		}

		setPreferences(buildCriteria(preferencesQuery.data, 'form'))
	}, [preferencesQuery.data])

	const resetMutation = () => {
		if (updatePreferencesMutation.isError || updatePreferencesMutation.isSuccess) {
			updatePreferencesMutation.reset()
		}
	}

	const handleInputChange = event => {
		const { name, value } = event.target

		setPreferences(currentPreferences => ({
			...currentPreferences,
			[name]: value,
		}))

		resetMutation()
	}

	const handleCheckboxChange = event => {
		const { name, checked } = event.target

		setPreferences(currentPreferences => ({
			...currentPreferences,
			[name]: checked,
		}))

		resetMutation()
	}

	const handleSubmit = async event => {
		event.preventDefault()

		await updatePreferencesMutation.mutateAsync(buildCriteria(preferences))
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h3 className={styles.title}>Предпочтения</h3>

			{preferencesQuery.isPending ? (
				<p className={styles.success}>Загружаем сохранённые предпочтения...</p>
			) : null}
			{preferencesQuery.isError ? (
				<p className={styles.error}>{loadErrorMessage}</p>
			) : null}

			<PropertyCriteriaFields
				criteria={preferences}
				onCheckboxChange={handleCheckboxChange}
				onInputChange={handleInputChange}
			/>

			{updatePreferencesMutation.isError ? (
				<p className={styles.error}>{saveErrorMessage}</p>
			) : null}
			{updatePreferencesMutation.isSuccess ? (
				<p className={styles.success}>Предпочтения сохранены</p>
			) : null}

			<Button
				className={styles.submitButton}
				fullWidth
				size='lg'
				type='submit'
				disabled={updatePreferencesMutation.isPending || preferencesQuery.isPending}
			>
				{updatePreferencesMutation.isPending
					? 'Сохраняем...'
					: 'Сохранить предпочтения'}
			</Button>
		</form>
	)
}

export default Preferences
