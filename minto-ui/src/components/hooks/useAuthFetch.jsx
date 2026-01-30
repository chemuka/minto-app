// useAuthFetch.js (Custom Hook)
import { useAuth } from './useAuth';
import { useCallback, useRef } from 'react';
import { parseJwt } from "../misc/Util"

const useAuthFetch = () => {
    const { getUser, logout } = useAuth();
    const isRefreshing = useRef(false); // Ref to handle concurrent refreshes
    const subscribers = useRef([]);
    let user = getUser();

    const subscribeToTokenRefresh = (cb) => {
        subscribers.current.push(cb);
    };

    const onRefreshed = (newAccessToken) => {
        subscribers.current.forEach((cb) => cb(newAccessToken));
        subscribers.current = [];
    };

    const refreshToken = useCallback(async () => {
        try {
            isRefreshing.current = true;
            // API call to your refresh token endpoint
            const response = await fetch('http://localhost:8080/api/v1/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.refreshToken}`
                },
            });
            
            if (!response.ok) throw new Error('Refresh failed');
            
            const jsonData = await response.json()
            const newAccessToken = jsonData['access_token']
            const newRefreshToken = jsonData['refresh_token']
            const decoded = parseJwt(newAccessToken)

            const authenticatedUser = { 
                decoded: decoded, 
                accessToken: newAccessToken, 
                refreshToken: newRefreshToken,
            }

            localStorage.setItem('user', JSON.stringify(authenticatedUser))

            onRefreshed(newAccessToken);
            isRefreshing.current = false;

            return newAccessToken;
        } catch (error) {
            logout(); // Redirect to login on refresh failure
            isRefreshing.current = false;
            throw error;
        }
    }, [user, logout]);

    const authFetch = useCallback(async (url, options = {}) => {
        let accessToken = getUser().accessToken;
        let newToken;
        // 1. Attach the token to the request
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        };
        console.log('accessToken in authFetch: ' + accessToken)
        
        let response = await fetch(url, options);

        // 2. Handle token expiry (401 status)
        if (response.status === 401) {
            if (!isRefreshing.current) {
                // Start refresh process if not already running
                newToken = await refreshToken();
            } else {
                // Wait for ongoing refresh to complete
                await new Promise(resolve => subscribeToTokenRefresh(resolve));
            }
            
            // Retry the original request with the new token
            if (!newToken) {
                newToken = getUser().accessToken; // Get the updated token
            }
            console.log('Retrying original request with new access token:' + newToken);
            options.headers.Authorization = `Bearer ${newToken}`; // Get the updated token
            response = await fetch(url, options);
        }

        return response;
    }, [getUser, refreshToken]); // Include dependencies

    return {
        authFetch
    };
};

export default useAuthFetch;