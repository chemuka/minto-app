import { useEffect, useRef, useState } from "react"
import { parseJwt } from "../misc/Util"
import { toast } from "sonner"
import PropTypes from 'prop-types'
import AuthenticationContext from "../context/AuthenticationContext"

// Token refresh state manager to handle concurrent requests
class TokenRefreshManager {
    constructor() {
        this.refreshPromise = null;
        this.isRefreshing = false;
    }

    async refresh(refreshFn) {
        // If already refreshing, return the existing promise
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise;
        }

        // Start a new refresh
        this.isRefreshing = true;
        this.refreshPromise = refreshFn()
        .finally(() => {
            this.isRefreshing = false;
            this.refreshPromise = null;
        });

        return this.refreshPromise;
    }

    reset() {
        this.refreshPromise = null;
        this.isRefreshing = false;
    }
}

const AuthenticationProvider = ({ children }) => {
    const tokenRefreshManager = useRef(new TokenRefreshManager());
    const userRef = useRef(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
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

    // Refresh the access token
    const refreshJwt = async () => {
        // Use the token refresh manager to prevent concurrent refresh calls
        return tokenRefreshManager.current.refresh(async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const refreshToken = storedUser?.refreshToken;
                
                if (!storedUser || !refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await fetch('http://localhost:8080/api/v1/auth/refresh-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${refreshToken}`
                    },
                });

                if (!response.ok) {
                throw new Error('Failed to refresh token');
                }

                const data = await response.json();
                const accessToken = data['access_token']
                const newRefreshToken = data['refresh_token']
                const decoded = parseJwt(accessToken)

                const authenticatedUser = { 
                    decoded: decoded, 
                    accessToken: accessToken, 
                    refreshToken: newRefreshToken,
                }

                userRef.current = authenticatedUser
                localStorage.setItem('user', JSON.stringify(authenticatedUser))
                return data['access_token'];
            } catch (err) {
                // Clear tokens and logout on refresh failure
                logout();
                throw err;
            }
        });
    };

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
