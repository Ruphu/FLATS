import { useQuery } from '@tanstack/react-query'
import { getRecommendedApartmentsRequest } from '@shared/api/apartment/apartmentApi'

const useRecommendedApartments = (options = {}) =>
	useQuery({
		queryKey: ['apartments', 'recommendations', options],
		queryFn: () => getRecommendedApartmentsRequest(options),
		enabled: Boolean(options.enabled),
	})

export default useRecommendedApartments
