import { createContext, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
	clearStoredAuth,
	getAuthToken,
	setAuthToken,
} from '@shared/api/auth/tokenStorage'

export const AuthContext = createContext(null)

const extractToken = response =>
	response?.token ??
	response?.accessToken ??
	response?.data?.token ??
	response?.data?.accessToken ??
	null

export const AuthProvider = ({ children }) => {
	const queryClient = useQueryClient()
	const [token, setToken] = useState(() => getAuthToken())

	const authenticate = response => {
		const nextToken = extractToken(response)

		if (!nextToken) {
			throw new Error('Backend did not return a token')
		}

		setAuthToken(nextToken)
		setToken(nextToken)

		return nextToken
	}

	const logout = () => {
		clearStoredAuth()
		setToken(null)
		queryClient.removeQueries({ queryKey: ['auth'] })
		queryClient.removeQueries({ queryKey: ['user'] })
	}

	return (
		<AuthContext.Provider
			value={{
				authenticate,
				isAuthenticated: Boolean(token),
				logout,
				token,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
