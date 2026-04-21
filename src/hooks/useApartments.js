import { useQuery } from '@tanstack/react-query'
import { getApartmentsRequest } from '@shared/api/apartment/apartmentApi'

const useApartments = () =>
	useQuery({
		queryKey: ['apartments', 'list'],
		queryFn: getApartmentsRequest,
	})

export default useApartments
