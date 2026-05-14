const BACKEND_MESSAGE_TRANSLATIONS = {
	'The minimum budget cannot be more than the maximum':
		'Минимальный бюджет не может быть больше максимального',
	'The minimum area cannot be more than the maximum':
		'Минимальная площадь не может быть больше максимальной',
	'The minimum floor cannot be more than the maximum':
		'Минимальный этаж не может быть больше максимального',
	'Preferred district must be a valid Saint Petersburg district':
		'Выберите район Санкт-Петербурга из списка',
	'District must be a valid Saint Petersburg district':
		'Выберите район Санкт-Петербурга из списка',
	'Field required': 'Заполните обязательное поле',
	'Input should be a valid integer': 'Введите целое число',
	'Input should be a valid number': 'Введите число',
	'Input should be a valid string': 'Введите текст',
	'Input should be a valid boolean': 'Выберите значение',
	'Input should be greater than or equal to 0': 'Значение не может быть меньше 0',
	'Input should be greater than or equal to 1': 'Значение должно быть не меньше 1',
	'Input should be less than or equal to 10': 'Значение должно быть не больше 10',
	'Input should be less than or equal to 120': 'Значение должно быть не больше 120',
	'Input should be less than or equal to 100': 'Значение должно быть не больше 100',
	'Input should be less than or equal to 1000': 'Значение должно быть не больше 1000',
}

const FIELD_LABELS = {
	budgetMin: 'Бюджет от',
	budgetMax: 'Бюджет до',
	preferredDistrict: 'Район',
	apartmentType: 'Тип квартиры',
	areaMin: 'Площадь от',
	areaMax: 'Площадь до',
	roomsCount: 'Количество комнат',
	hasBalcony: 'Балкон',
	hasLoggia: 'Лоджия',
	floorMin: 'Этаж от',
	floorMax: 'Этаж до',
	houseType: 'Тип дома',
	minutesToMetro: 'Минут до метро',
	wantsShopsNearby: 'Магазины рядом',
	wantsSchoolsNearby: 'Школы рядом',
	wantsKindergartensNearby: 'Детские сады рядом',
	wantsParksNearby: 'Парки рядом',
}

const stripPydanticPrefix = message =>
	message.replace(/^Value error,\s*/i, '').trim()

const looksEnglish = message => /[A-Za-z]/.test(message)

const translateBackendMessage = message => {
	const normalizedMessage = stripPydanticPrefix(String(message ?? ''))

	if (BACKEND_MESSAGE_TRANSLATIONS[normalizedMessage]) {
		return BACKEND_MESSAGE_TRANSLATIONS[normalizedMessage]
	}

	if (/String should have at least \d+ characters/.test(normalizedMessage)) {
		return 'Слишком короткое значение'
	}

	if (/String should have at most \d+ characters/.test(normalizedMessage)) {
		return 'Слишком длинное значение'
	}

	if (/Input should be '.*'/.test(normalizedMessage)) {
		return 'Выберите значение из списка'
	}

	if (/Input should be (less than|greater than)/.test(normalizedMessage)) {
		return 'Значение вне допустимого диапазона'
	}

	return looksEnglish(normalizedMessage)
		? 'Проверьте корректность заполнения поля'
		: normalizedMessage
}

const getFieldLabel = detail => {
	if (!Array.isArray(detail?.loc)) {
		return ''
	}

	const fieldName = [...detail.loc]
		.reverse()
		.find(part => typeof part === 'string')
	return FIELD_LABELS[fieldName] ?? ''
}

export const getApiErrorMessage = (error, fallback) => {
	const data = error?.data

	if (typeof data?.message === 'string' && data.message.trim()) {
		return translateBackendMessage(data.message)
	}

	if (typeof data?.detail === 'string' && data.detail.trim()) {
		return translateBackendMessage(data.detail)
	}

	if (Array.isArray(data?.detail) && data.detail.length > 0) {
		return data.detail
			.map(detail => {
				const message = translateBackendMessage(detail?.msg)
				const label = getFieldLabel(detail)

				return label ? `${label}: ${message}` : message
			})
			.filter(Boolean)
			.join('. ')
	}

	return fallback
}
