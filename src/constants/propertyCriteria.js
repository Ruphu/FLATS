export const apartmentTypeOptions = [
	{ value: 'new_building', label: 'Новостройка' },
	{ value: 'secondary', label: 'Вторичка' },
]

export const houseTypeOptions = [
	{ value: 'Панельный', label: 'Панельный' },
	{ value: 'Кирпичный', label: 'Кирпичный' },
	{ value: 'Монолитный', label: 'Монолитный' },
]

export const criteriaSections = [
	{
		type: 'range',
		title: 'Бюджет, руб.',
		nameMin: 'budgetMin',
		nameMax: 'budgetMax',
	},
	{
		type: 'text',
		label: 'Предпочитаемый район',
		name: 'preferredDistrict',
		minLength: 2,
		maxLength: 100,
		placeholder: 'Например, Хамовники',
	},
	{
		type: 'radio',
		name: 'apartmentType',
		title: 'Тип квартиры',
		options: apartmentTypeOptions,
	},
	{
		type: 'range',
		title: 'Площадь, м²',
		nameMin: 'areaMin',
		nameMax: 'areaMax',
		step: '0.1',
	},
	{
		type: 'number',
		label: 'Количество комнат (0 = студия)',
		name: 'roomsCount',
		min: '0',
		step: '1',
	},
	{
		type: 'checkbox',
		title: 'Балкон и лоджия',
		options: [
			{ name: 'hasBalcony', label: 'Есть балкон' },
			{ name: 'hasLoggia', label: 'Есть лоджия' },
		],
	},
	{
		type: 'range',
		title: 'Этаж',
		nameMin: 'floorMin',
		nameMax: 'floorMax',
		minMin: '1',
	},
	{
		type: 'radio',
		name: 'houseType',
		title: 'Тип дома',
		options: houseTypeOptions,
	},
	{
		type: 'number',
		label: 'Минут до метро',
		name: 'minutesToMetro',
		min: '0',
		max: '120',
		step: '1',
	},
]

export const initialCriteria = {
	budgetMin: '0',
	budgetMax: '0',
	preferredDistrict: '',
	apartmentType: apartmentTypeOptions[0].value,
	areaMin: '0',
	areaMax: '0',
	roomsCount: '0',
	hasBalcony: false,
	hasLoggia: false,
	floorMin: '1',
	floorMax: '2',
	houseType: houseTypeOptions[0].value,
	minutesToMetro: '0',
}
