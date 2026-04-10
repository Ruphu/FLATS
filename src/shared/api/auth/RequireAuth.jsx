import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '@hooks/useAuth'

const RequireAuth = ({ children }) => {
	const location = useLocation()
	const { isAuthenticated } = useAuth()

	if (!isAuthenticated) {
		return <Navigate replace state={{ from: location.pathname }} to='/login' />
	}

	return children
}

export default RequireAuth
