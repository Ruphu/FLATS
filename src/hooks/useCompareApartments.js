import { useQuery } from '@tanstack/react-query'
import { compareApartmentsRequest } from '@shared/api/apartment/apartmentApi'

const useCompareApartments = ids =>
	useQuery({
		queryKey: ['apartments', 'compare', ids],
		queryFn: () => compareApartmentsRequest(ids),
		enabled: ids.length >= 2,
	})

export default useCompareApartments
