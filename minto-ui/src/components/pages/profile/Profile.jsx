import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import LoadingSpinner from '../../loading/LoadingSpinner'
import ProfileCard from './ProfileCard'
import { useAuth } from '../../hooks/useAuth'
import useFetch from '../../hooks/useFetch'
import { defaultUser } from '../../../model/defaultUser'

const Profile = () => {
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated, getUser } = useAuth()
    const [profileData, setProfileData] = useState({ ...defaultUser })
    const [userApplications, setUserApplications] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    let user = getUser()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                if(user) {
                    const response1 = await fetchWithAuth(`http://localhost:8080/api/v1/users/${user.decoded.sub}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    
                    if (!response1.ok) {
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
                    const data = await response1.json()
                    //console.log('user fetched successfully:', data)
                    setProfileData(data);
                    toast.success('Profile data loaded successfully!')

                    const response2 = await fetchWithAuth(`http://localhost:8080/api/v1/applications/dto/user`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    
                    if (!response2.ok) {
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
                    const data2 = await response2.json()
                    //console.log('Applications fetched successfully:', data2)
                    setUserApplications(data2);
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

                                { userApplications.length > 0 ? (
                                    <div className="mt-4">
                                        <h3 className="mb-3" style={{ color: 'darkgreen'}}>Your Applications</h3>
                                        <ul className="list-group">
                                            { userApplications.map((app, index) => (
                                                <li key={index} className="list-group-item">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="fw-bold text-primary">Application {index + 1}</span>
                                                        <span className={`badge ${app.applicationStatus === 'Approved' ? 'bg-success' 
                                                            : app.applicationStatus === 'Under review' ? 'bg-primary'
                                                            : app.applicationStatus === 'Submitted' ? 'bg-primary'
                                                            : app.applicationStatus === 'Rejected' ? 'bg-danger' 
                                                            : app.applicationStatus === 'Returned' ? 'bg-warning' 
                                                            : 'bg-secondary'} text-white`}>
                                                            {app.applicationStatus}
                                                        </span>
                                                    </div>
                                                    Application #: {app.applicationNumber}
                                                    {/**if submitted show submitted date, if approved show approved date, if rejected show rejected date */}
                                                    { app.submitted && <><br />Submitted On: {new Date(app.submittedDate).toLocaleDateString()}</> }
                                                    { app.approved && <><br />Approved On: {new Date(app.approvedDate).toLocaleDateString()}</> }
                                                    { app.rejectedDate && <><br />Rejected On: {new Date(app.rejectedDate).toLocaleDateString()}</> }
                                                    { app.applicationStatus === 'Rejected' && app.rejectionReason && <><br />Rejection Reason: {app.rejectionReason}</> }
                                                    { (app.submitted || app.approved) && <><br />Notes: {app.notes}</> }
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="text-secondary mt-4">You have no applications yet.</p>
                                )}
                            </div>
                        )
                    )
                }
            </div>
        </>
    )
}

export default Profile