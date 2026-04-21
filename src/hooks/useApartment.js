import { useQuery } from '@tanstack/react-query'
import { getApartmentRequest } from '@shared/api/apartment/apartmentApi'

const useApartment = apartmentId =>
	useQuery({
		queryKey: ['apartments', apartmentId],
		queryFn: () => getApartmentRequest(apartmentId),
		enabled: Boolean(apartmentId),
	})

export default useApartment
