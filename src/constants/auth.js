export const loginFields = [
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
]

export const loginContent = {
	alternateLinkLabel: 'Зарегистрироваться',
	alternateLinkTo: '/register',
	alternateText: 'Еще нет аккаунта?',
	description: 'Войдите в аккаунт, используя email и пароль, которые вы указали при регистрации.',
	submitLabel: 'Войти',
	title: 'Login',
}

export const registerFields = [
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
]

export const registerContent = {
	alternateLinkLabel: 'Войти',
	alternateLinkTo: '/login',
	alternateText: 'Уже есть аккаунт?',
	description: 'Создайте аккаунт, указав имя, email и пароль.',
	submitLabel: 'Создать аккаунт',
	title: 'Register',
}
