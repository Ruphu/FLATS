export const filterSections = [
	{
		type: 'checkbox',
		name: 'flatType',
		title: 'Тип квартиры',
		options: [
			{ value: 'new', label: 'Новостройка' },
			{ value: 'secondary', label: 'Вторичка' },
		],
	},
	{
		type: 'range',
		title: 'Площадь, м²',
		nameMin: 'areaMin',
		nameMax: 'areaMax',
	},
	{
		type: 'range',
		title: 'Количество комнат',
		nameMin: 'roomNumberMin',
		nameMax: 'roomNumberMax',
	},
	{
		type: 'range',
		title: 'Этаж',
		nameMin: 'floorMin',
		nameMax: 'floorMax',
	},
	{
		type: 'checkbox',
		name: 'isBalcony',
		title: 'Наличие балкона/лоджии',
		options: [
			{ value: 'balcony', label: 'Балкон' },
			{ value: 'loggia', label: 'Лоджия' },
		],
	},
]

export const initialFilters = {
	flatType: {
		new: false,
		secondary: false,
	},
	isBalcony: {
		balcony: false,
		loggia: false,
	},
	areaMin: '',
	areaMax: '',
	roomNumberMin: '',
	roomNumberMax: '',
	floorMin: '',
	floorMax: '',
}
