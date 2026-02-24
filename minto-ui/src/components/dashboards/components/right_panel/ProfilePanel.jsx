import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth"
import { defaultUser } from "../../../../model/defaultUser";
import useFetch from "../../../hooks/useFetch";
import { toast } from "sonner";
import LoadingSpinner from "../../../loading/LoadingSpinner";

const API_BASE_URL = "http://localhost:8080";

const ProfilePanel = () => {
    const { getUser } = useAuth()
    const { fetchWithAuth } = useFetch()
    const [profileData, setProfileData] = useState({ ...defaultUser })
    const [isLoading, setIsLoading] = useState(false)
    let user  = getUser()

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        setIsLoading(true)
        try {
            if(user) {
                const response = await fetchWithAuth(`http://localhost:8080/api/v1/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                
                if (!response.ok) {
                    toast.error('HTTP Error: Network response not OK!')
                    throw new Error('Network response was not ok!')
                }
                
                const data = await response.json()
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

    return (
        <div className="profile">
            {
                isLoading ? (
                    <LoadingSpinner caption={'profile'} clsTextColor={"text-success"} />
                ) : (
                    <>
                        { user ? (
                            <>
                                <div className="info">
                                    <p>Hey, <b>{user.decoded.firstName}</b></p>
                                    <small className="text-muted">{user.decoded.role}</small>
                                </div>
                                <div className="profile-photo">
                                    { profileData.picture ? (
                                        <img src={`${API_BASE_URL}${profileData.picture}`} alt="Profile" />
                                    ) : (
                                        <img src="../images/dashboard/Avatar.PNG" alt="Profile" />
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="info">
                                    <p>Hey, <b>TestUser</b></p>
                                    <small className="text-muted">Admin</small>
                                </div>
                                <div className="profile-photo">
                                    <img src="../images/dashboard/Avatar.PNG" alt="Profile" />
                                </div>
                            </>
                        )}
                    </>
                )
            }
            
        </div>
    )
}

export default ProfilePanel
