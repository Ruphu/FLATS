import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@components/AuthForm';
import Container from '@shared/Container';
import { useAuth } from '@shared/api/auth/AuthContext';
import styles from './Register.module.scss';

const registerFields = [
  {
    autoComplete: 'name',
    label: 'Name',
    name: 'name',
    placeholder: 'Ваше имя',
    type: 'text',
  },
  {
    autoComplete: 'email',
    label: 'Email',
    name: 'email',
    placeholder: 'you@example.com',
    type: 'email',
  },
  {
    autoComplete: 'new-password',
    label: 'Password',
    name: 'password',
    placeholder: 'Придумайте пароль',
    type: 'password',
  },
];

const Register = () => {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values) => {
    await register(values);
    navigate('/profile', { replace: true });
  };

  return (
    <main className={styles.page}>
      <Container>
        <AuthForm
          alternateLinkLabel="Войти"
          alternateLinkTo="/login"
          alternateText="Уже есть аккаунт?"
          description="Создайте аккаунт, указав имя, email и пароль."
          fields={registerFields}
          onSubmit={handleSubmit}
          submitLabel="Создать аккаунт"
          title="Register"
        />
      </Container>
    </main>
  );
};

export default Register;
