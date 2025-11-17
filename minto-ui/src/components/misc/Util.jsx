export function parseJwt(token) {
    if (!token) {
        return
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

export const handleLogError = (error) => {
    if (error.response) {
      console.log(error.response.data)
    } else if (error.request) {
      console.log(error.request)
    } else {
        console.log(error.name + ": " + error.message)
    }
}

/**
 * Fetch Data is a custom fetch method to implement refresh token for JWT
 */
/*
export const fetchData = async (url, options = {}) => {
    const currentUser = localStorage.getItem('user');
    console.log('currentUser', currentUser)
    const accessToken = currentUser.accessToken;
    const refreshToken = currentUser.refreshToken;

    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options
    };

    try {
        const response = await fetch(url, mergedOptions);
        console.log('[fetchData] : DEBUG - response: ', response)
        if (response.status === 401) { // Token expired
            console.log('[fetchData] : DEBUG - Token expired. Fetch refresh-token.')
            const newAccessTokenResponse = await fetch('http://localhost:8080/api/v1/auth/refresh-token', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${refreshToken}`,
                  'Content-Type': 'application/json'
              },
            });
            
            console.log('[fetchData] : DEBUG - newAccessTokenResponse: ', newAccessTokenResponse)
            if (newAccessTokenResponse.ok) {
            console.log('[fetchData] : DEBUG - newAccessTokenResponse is OK.')
                const jsonData = await newAccessTokenResponse.json();
                const newAccessToken = jsonData['access_token'];
                const newRefreshToken = jsonData['refresh_token'];
                const decoded = parseJwt(accessToken);
                
                const authenticatedUser = { decoded, newAccessToken, newRefreshToken };
                localStorage.setItem('user', authenticatedUser);

                // Retry the original request with the new access token
                mergedOptions.headers['Authorization'] = `Bearer ${newAccessToken}`;
                const retryResponse = await fetch(url, mergedOptions);
                return retryResponse.json();
            } else {
                console.log('[fetchData] : ERROR - newAccessTokenResponse is BAD.')
                // Handle refresh token failure (e.g., redirect to login)
                localStorage.removeItem('user');
                //window.location.href = '/login'; // Example: redirect to login page
                throw new Error('Refresh token expired or invalid');
            }
        }

        return response.json();
    } catch (error) {
        console.error('[fetchData] : ERROR - Error fetching data:', error);
        throw error;
    }
};
*/

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        // Redirect to login or handle the absence of a refresh token
        return null;
    }

    try {
        const response = await fetch('/api/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
          // Handle refresh token failure (e.g., redirect to login)
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          return null;
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    } catch (error) {
        // Handle error during refresh
        console.error('Error refreshing token:', error);
        return null;
    }
};

/*
export const fetchData = async (url, options = {}) => {
  //const curUser = localStorage.getItem('user')
  const curUser = JSON.parse(localStorage.getItem('user'))
  let accessToken = curUser.accessToken
  let refreshToken = curUser.refreshToken
  console.log('[fetchData] curUser - ', curUser)
  console.log(curUser)
  console.log('[fetchData] accessToken - ', accessToken)

  // 1. Initial Request Setup
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    },
  };
  const mergedOptions = { ...defaultOptions, ...options };

  try {
    // 2. Perform the Fetch Request
    const response = await fetch(url, mergedOptions);

    // 3. Handle Unauthorized Errors (Token Expired)
    if (response.status === 401) {
      // 4. Attempt Refresh if Refresh Token Exists
      if (refreshToken) {
        const refreshResponse = await fetch('http://localhost:8080/api/v1/auth/refresh-token', { // Replace with your actual endpoint
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
          },
        });

        if (refreshResponse.ok) {
          const jsonData = await refreshResponse.json()
          accessToken = jsonData['access_token'];
          refreshToken = jsonData['refresh_token'];
          const decoded = parseJwt(accessToken);
          const authUser = { decoded, accessToken, refreshToken };
          console.log('[fetchData] authUser => ', authUser)

          localStorage.setItem('user', JSON.stringify(authUser));

          // 5. Retry the Original Request with New Token
          mergedOptions.headers['Authorization'] = `Bearer ${accessToken}`
          return await fetch(url, mergedOptions)
        } else {
          // Refresh failed (e.g., refresh token expired)
          console.log('[fetchData] refreshResponse: ', refreshResponse)
          localStorage.removeItem('user')
          // Redirect to login or handle as needed
          throw new Error('Refresh token expired')
        }
      } else {
        // No refresh token available
        throw new Error('No refresh token available')
      }
    }

    // 6. Handle Other Responses
    return response
  } catch (error) {
    // 7. Handle Fetch Errors
    console.error('[fetchData] Fetch error:', error)
    throw error
  }
};
*/

/*
export const customFetch = async (url, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');
  
    // Add Authorization header with the access token
    const authOptions = {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`,
        },
    };
  
    let response = await fetch(url, authOptions);
  
    if (response.status === 401) {
        // Access token has expired, attempt to refresh it
        const newAccessToken = await refreshAccessToken();
    
        if (newAccessToken) {
            // Retry the request with the new access token
            authOptions.headers['Authorization'] = `Bearer ${newAccessToken}`;
            response = await fetch(url, authOptions);
        } else {
            // Token refresh failed, handle accordingly (e.g., redirect to login)
            return response;
        }
    }
  
    return response;
}; 
*/