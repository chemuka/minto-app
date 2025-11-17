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
            const response = await fetch(url, { ...options, headers })
            if(response.status === 401) {
                await refreshJwt()
                user = getUser()
                headers.Authorization = `Bearer ${user.accessToken}`
                return fetch(url, { ...options, headers })
            }
            return response
        } catch (error) {
            console.log(error)
            throw error
        }
    }, [getUser, refreshJwt])

    return {
        fetchWithAuth
    }

}

export default useFetch
