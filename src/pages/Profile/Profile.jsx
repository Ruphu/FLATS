import { useEffect, useState } from 'react';
import Header from '@components/Header';
import Container from '@shared/Container';
import { getMeRequest } from '@shared/api/auth/authApi';
import { useAuth } from '@shared/api/auth/AuthContext';
import styles from './Profile.module.scss';

const Profile = () => {
  const { logout } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const response = await getMeRequest();
        const nextProfile = response?.user ?? response?.data ?? response;

        if (!isMounted) {
          return;
        }

        setProfile(nextProfile);
        setErrorMessage('');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error.status === 401) {
          logout();
          return;
        }

        setErrorMessage(error.message ?? 'Не удалось загрузить профиль');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <Header />

      <Container>
        <section className={styles.card}>
          <p className={styles.kicker}>Protected route</p>
          <h1 className={styles.title}>Профиль</h1>
          <p className={styles.description}>
            Страница делает GET-запрос на <code>/api/auth/me</code>. Токен подставляется
            автоматически в заголовок <code>Authorization: Bearer ...</code>.
          </p>

          {isLoading ? <p className={styles.status}>Загружаем данные профиля...</p> : null}
          {!isLoading && errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

          {!isLoading && profile ? (
            <dl className={styles.details}>
              <div className={styles.row}>
                <dt>Имя</dt>
                <dd>{profile.name ?? profile.fullName ?? 'Не пришло с бэка'}</dd>
              </div>
              <div className={styles.row}>
                <dt>Email</dt>
                <dd>{profile.email ?? 'Не пришло с бэка'}</dd>
              </div>
            </dl>
          ) : null}
        </section>
      </Container>
    </div>
  );
};

export default Profile;
