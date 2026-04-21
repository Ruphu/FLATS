import { initialCriteria } from '@constants/propertyCriteria'

const toNumberValue = value => Number(value)
const toStringValue = value => (value == null ? '' : String(value))

const criteriaBuilders = {
	payload: criteria => ({
		budgetMin: toNumberValue(criteria.budgetMin),
		budgetMax: toNumberValue(criteria.budgetMax),
		preferredDistrict: criteria.preferredDistrict.trim(),
		apartmentType: criteria.apartmentType,
		areaMin: toNumberValue(criteria.areaMin),
		areaMax: toNumberValue(criteria.areaMax),
		roomsCount: toNumberValue(criteria.roomsCount),
		hasBalcony: Boolean(criteria.hasBalcony),
		hasLoggia: Boolean(criteria.hasLoggia),
		floorMin: toNumberValue(criteria.floorMin),
		floorMax: toNumberValue(criteria.floorMax),
		houseType: criteria.houseType,
		minutesToMetro: toNumberValue(criteria.minutesToMetro),
	}),
	form: criteria => ({
		...initialCriteria,
		budgetMin: toStringValue(criteria?.budgetMin ?? initialCriteria.budgetMin),
		budgetMax: toStringValue(criteria?.budgetMax ?? initialCriteria.budgetMax),
		preferredDistrict:
			criteria?.preferredDistrict ?? initialCriteria.preferredDistrict,
		apartmentType: criteria?.apartmentType ?? initialCriteria.apartmentType,
		areaMin: toStringValue(criteria?.areaMin ?? initialCriteria.areaMin),
		areaMax: toStringValue(criteria?.areaMax ?? initialCriteria.areaMax),
		roomsCount: toStringValue(criteria?.roomsCount ?? initialCriteria.roomsCount),
		hasBalcony: Boolean(criteria?.hasBalcony),
		hasLoggia: Boolean(criteria?.hasLoggia),
		floorMin: toStringValue(criteria?.floorMin ?? initialCriteria.floorMin),
		floorMax: toStringValue(criteria?.floorMax ?? initialCriteria.floorMax),
		houseType: criteria?.houseType ?? initialCriteria.houseType,
		minutesToMetro: toStringValue(
			criteria?.minutesToMetro ?? initialCriteria.minutesToMetro,
		),
	}),
}

export const buildCriteria = (criteria, format = 'payload') =>
	criteriaBuilders[format](criteria)
