import { useEffect, useRef, useState } from "react"
import { parseJwt } from "../misc/Util"
import { toast } from "sonner"
import PropTypes from 'prop-types'
import AuthenticationContext from "../context/AuthenticationContext"

const AuthenticationProvider = ({ children }) => {
    const userRef = useRef(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    let isRefreshing = false;
    let refreshPromise = null;

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if(storedUser) {
            userRef.current = JSON.parse(storedUser)
            setIsAuthenticated(true)
        }
    }, [])

    const login = async (credentials) => {
        setLoading(true)
        setError(null)

         try {
            const response = await fetch('http://localhost:8080/api/v1/auth/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            })

            if (!response.ok) {
                throw new Error('Authentication failed. Please check your credentials.')
            }

            const jsonData = await response.json()
            const accessToken = jsonData['access_token']
            const refreshToken = jsonData['refresh_token']
            const decoded = parseJwt(accessToken)

            const authenticatedUser = { 
                decoded: decoded, 
                accessToken: accessToken, 
                refreshToken: refreshToken,
            }

            userRef.current = authenticatedUser
            localStorage.setItem('user', JSON.stringify(authenticatedUser))
            setIsAuthenticated(true)
            toast.success('Login successful')
            
        } catch (err) {
            setError(err.message)
            toast.error(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            if(userRef.current) {
                const response = await fetch('http://localhost:8080/api/v1/auth/logout/email', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userRef.current.accessToken}`
                    },
                    body: JSON.stringify({ 
                        email: userRef.current.decoded.sub,
                    }),
                })

                if(!response.ok) {
                    toast.error('Logout request failed!')
                    throw new Error('Logout request failed!')
                }
            
                const data = await response.json()
                console.log(data.message)
                toast.success(data.message)
            } else {
                console.log('No user to log out.')
            }
        } catch(err) {
            console.log('Logout Error:', err.message)
        } finally {
            userRef.current = null
            localStorage.removeItem('user')
            setIsAuthenticated(false)
            toast.info('User logged out.')
        }
    }

    const refreshJwt = async () => {
        console.log('Refreshing JWT token...')
        try {
            if (isRefreshing && refreshPromise) {
                console.log('Token refresh already in progress, waiting for it to complete...')
                await refreshPromise;
                //return;
            }

            if (!isRefreshing) {
                isRefreshing = true; 
            }
                const storedUser = JSON.parse(localStorage.getItem('user'))
                refreshPromise = await fetch('http://localhost:8080/api/v1/auth/refresh-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedUser.refreshToken}`
                    },
                })
        
                if (!refreshPromise.ok) {
                    console.log('Failed to refresh token, logging out.')
                    console.log(refreshPromise)
                    throw new Error(`HTTP error! status: ${refreshPromise.status}`);
                }

                const jsonData = await refreshPromise.json()
                const accessToken = jsonData['access_token']
                const refreshToken = jsonData['refresh_token']
                const decoded = parseJwt(accessToken)

                const authenticatedUser = { 
                    decoded: decoded, 
                    accessToken: accessToken, 
                    refreshToken: refreshToken,
                }

                userRef.current = authenticatedUser
                localStorage.setItem('user', JSON.stringify(authenticatedUser))
                console.log('New refresh-token successful')
                refreshPromise = null;
                isRefreshing = false;
            //}
        } catch (error) {
            refreshPromise = null;
            isRefreshing = false;
            console.error('[Error refreshing token]:', error.message);
            logout();
        }
    }

    const getUser = () => userRef.current

    const contextValue = {
        isAuthenticated,
        error,
        loading,
        login,
        logout,
        refreshJwt,
        getUser,
    }

    return (
        <AuthenticationContext.Provider value={contextValue}>
            {children}
        </AuthenticationContext.Provider>
    )
}

AuthenticationProvider.propTypes = {
    children: PropTypes.node
}

export default AuthenticationProvider
