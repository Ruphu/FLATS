import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '@components/AuthForm';
import Container from '@shared/Container';
import { useAuth } from '@shared/api/auth/AuthContext';
import styles from './Login.module.scss';

const loginFields = [
  {
    autoComplete: 'email',
    label: 'Email',
    name: 'email',
    placeholder: 'you@example.com',
    type: 'email',
  },
  {
    autoComplete: 'current-password',
    label: 'Password',
    name: 'password',
    placeholder: 'Введите пароль',
    type: 'password',
  },
];

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from ?? '/profile';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (values) => {
    await login(values);
    navigate(redirectTo, { replace: true });
  };

  return (
    <main className={styles.page}>
      <Container>
        <AuthForm
          alternateLinkLabel="Зарегистрироваться"
          alternateLinkTo="/register"
          alternateText="Еще нет аккаунта?"
          description="Войдите в аккаунт, используя email и пароль, которые вы указали при регистрации."
          fields={loginFields}
          onSubmit={handleSubmit}
          submitLabel="Войти"
          title="Login"
        />
      </Container>
    </main>
  );
};

export default Login;
