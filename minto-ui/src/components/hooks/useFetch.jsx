import { useCallback } from "react"
import { useAuth } from "./useAuth"

const useFetch = () => {
    const { getUser, refreshJwt } = useAuth()

    const fetchWithAuth = useCallback(async (url, options = {}) => {
        let user = getUser()
        const headers = {
            ...options.headers,
            Authorization: `Bearer ${user.accessToken}`,
        }

        try {
            let response = await fetch(url, { ...options, headers })
            if(response.status === 401 ) { // Unauthorized, try refreshing token
                console.log('Access token expired, refreshing token...')
                await refreshJwt()
                user = getUser()
                headers.Authorization = `Bearer ${user.accessToken}`
                console.log('Retrying fetch with new token.')
                response = await fetch(url, { ...options, headers })
                return response
            } 
            return response
        } catch (error) {
            console.log(error.message)
            throw error
        }
    }, [getUser, refreshJwt])

    return {
        fetchWithAuth
    }

}

export default useFetch
