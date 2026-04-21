import { useEffect } from 'react'
import Header from '@components/Header'
import Preferences from '@components/Preferences'
import { PROFILE_ERROR_MESSAGES } from '@constants/api_errors'
import { useAuth, useMe } from '@hooks'
import Container from '@shared/Container'
import styles from './Profile.module.scss'

const Profile = () => {
	const { logout } = useAuth()
	const meQuery = useMe()
	const profile = meQuery.data?.user ?? meQuery.data?.data ?? meQuery.data
	const errorMessage = meQuery.isError
		? PROFILE_ERROR_MESSAGES[meQuery.error?.status] ??
			PROFILE_ERROR_MESSAGES.default
		: ''

	useEffect(() => {
		if (meQuery.error?.status === 401) {
			logout()
		}
	}, [logout, meQuery.error])

	return (
		<div className={styles.page}>
			<Header />

			<Container>
				<section className={styles.card}>
					<p className={styles.kicker}>Protected route</p>
					<h1 className={styles.title}>Профиль</h1>
					<p className={styles.description}>
						Здесь отображается информация о вашем профиле.
					</p>

					{meQuery.isPending ? (
						<p className={styles.status}>Загружаем данные профиля...</p>
					) : null}
					{meQuery.isError ? (
						<p className={styles.error}>{errorMessage}</p>
					) : null}

					{profile ? (
						<dl className={styles.details}>
							<div className={styles.row}>
								<dt>Имя</dt>
								<dd>{profile.name ?? profile.fullName ?? 'Нет данных'}</dd>
							</div>
							<div className={styles.row}>
								<dt>Email</dt>
								<dd>{profile.email ?? 'Нет данных'}</dd>
							</div>
						</dl>
					) : null}

					<Preferences />
				</section>
			</Container>
		</div>
	)
}

export default Profile
