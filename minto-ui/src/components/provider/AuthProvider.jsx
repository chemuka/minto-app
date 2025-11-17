import { useCallback, useEffect, useMemo, useState } from "react";
import AuthContext from "../context/AuthContext";
import PropTypes from 'prop-types';
import { parseJwt } from "../misc/Util";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);

        if(storedUser) {
            console.log('INFO: [AuthProvider] - Found stored user');
            //console.log(storedUser);
        }
    }, []);

    const getUser = useCallback(() => {
        return JSON.parse(localStorage.getItem('user'));
    }, []);

    const userLogin = useCallback((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    }, []);

    const userLogout = useCallback(() => {
        localStorage.removeItem('user');
        setUser(null);
    }, []);

    const userIsAuthenticated = useCallback(() => {
        console.log('Call => userIsAuthenticated')

        const refreshAccessToken = async (refreshTkn) => {
            console.log('Call => refreshAccessToken')
           
            try {
                const response = await fetch('http://localhost:8080/api/v1/auth/refresh-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${refreshTkn}`
                    },
                });
        
                if (!response.ok) {
                    throw new Error('Failed to refresh token');
                }
                
                const jsonData = await response.json();
                const accessToken = jsonData['access_token'];
                const refreshToken = jsonData['refresh_token'];
                const decoded = parseJwt(accessToken);
                const authenticatedUser = { decoded, accessToken, refreshToken };
                userLogin(authenticatedUser);
                console.log('New refresh-token successful')
            } catch (error) {
                console.error('Error refreshing token:', error);
                userLogout();
            }
        };

        let storedUser = localStorage.getItem('user');
        if (!storedUser) {
            return false;
        }
        storedUser = JSON.parse(storedUser);

        //If user's access token is expired, logout the user
        if (Date.now() > storedUser.decoded.exp * 1000) {
            console.log('token expired! Refresh token.')
            refreshAccessToken(storedUser.refreshToken);
            console.log('Token refreshed.')
            storedUser = JSON.parse(localStorage.getItem('user'))
            if (Date.now() > storedUser.decoded.exp * 1000) {
                userLogout();
                return false;
            }
        }
        return true;
    }, [userLogin, userLogout]);

    const contextValue = useMemo(() => ({
        user,
        getUser,
        userIsAuthenticated,
        userLogin,
        userLogout,
    }), [user, getUser, userIsAuthenticated, userLogin, userLogout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node
};

export default AuthProvider