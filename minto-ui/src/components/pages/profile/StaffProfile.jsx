import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import LoadingSpinner from '../../loading/LoadingSpinner'
import ProfileCard from './ProfileCard'
import { useAuth } from '../../hooks/useAuth'
import useFetch from '../../hooks/useFetch'
import { defaultUser } from '../../../model/defaultUser'

const StaffProfile = () => {
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated, getUser } = useAuth()
    const [profileData, setProfileData] = useState({ ...defaultUser })
    const [isLoading, setIsLoading] = useState(false)
    let user = getUser()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                if(user) {
                    const response = await fetchWithAuth(`http://localhost:8080/api/v1/users/${user.decoded.sub}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    
                    if (!response.ok) {
                        console.error('HTTP Error: Network response not OK!', response)
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
                    const data = await response.json()
                    console.log('user fetched successfully:', data)
                    setProfileData(data);
                    toast.success('Profile data loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch(error) {
                console.log(error)
                toast.error('Error loading profile. ' + error.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
        
        return () => {
            console.log("Cleaned up after fetchData in Profile!");
          }
    }, [user, fetchWithAuth])

    return (
        <>
            <div>
                {
                    isLoading ? (
                        <LoadingSpinner caption={'Profile'} clsTextColor={"text-success"} />
                    ) : (
                        isAuthenticated && (
                            <div className="container mt-5 mb-3 pt-4">
                                <ProfileCard profileData={profileData} />
                            </div>
                        )
                    )
                }
            </div>
        </>
    )
};

export default StaffProfile