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
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    let user = getUser()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                if(user) {
                    const response1 = await fetchWithAuth(`http://localhost:8080/api/v1/profile`, {
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
                    setProfileData(data);
                    setForm({ firstName: data.firstName || '', lastName: data.lastName || '' })
                    toast.success('User data loaded successfully!')

                    fetchApplications()

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

        const fetchApplications = async () => {
            const response = await fetchWithAuth(`http://localhost:8080/api/v1/applications/dto/user`, {
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
            //console.log('Applications fetched successfully:', data)
            setUserApplications(data);
        }

        fetchData()
        
        return () => {
            console.log("Cleaned up after fetchData in Profile!");
          }
    }, [user, fetchWithAuth])

    const handleSave = async () => {
        setSaving(true);
        try {
            //const res = await profileAPI.updateProfile(form);
            const response = await fetchWithAuth('http://localhost:8080/api/v1/profile', {
                method: 'PUT',
                credentials: "include",
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            })

            if (!response.ok) {
                toast.error('HTTP Error: Network response not OK!')
                throw new Error('Network response was not ok!')
            }
            const data = await response.json()
            setProfileData(data);
            //updateUser({ ...user, fullName: res.data.fullName });
            setEditing(false);
            showMessage('Profile updated!');
        } catch (err) {
            showMessage('Failed to update profile.');
        } finally { setSaving(false); }
    };

    const handlePictureUpload = (updatedProfile) => {
        setProfileData(updatedProfile);
        //updateUser({ ...user, profilePictureUrl: updatedProfile.profilePictureUrl });
        showMessage('Profile picture updated!');
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <>
            <div style={{  minHeight:'100vh', background:'#f3f4f6' }}>
                {
                    isLoading ? (
                        <LoadingSpinner caption={'Profile'} clsTextColor={"text-success"} />
                    ) : (
                        isAuthenticated && (
                            <div className="container mt-5 mb-3 pt-4">
                                <ProfileCard 
                                    profileData={profileData}
                                    message={message}
                                    handlePictureUpload={handlePictureUpload}
                                    form={form}
                                    setForm={setForm}
                                    editing={editing}
                                    setEditing={setEditing}
                                    saving={saving}
                                    handleSave={handleSave}
                                />

                                { userApplications.length > 0 ? (
                                    <div className="my-4">
                                        <h3 className="mb-3" style={{ color: 'darkgreen'}}>Your Applications</h3>
                                        <ul className="list-group">
                                            { userApplications.map((app, index) => (
                                                <li key={index} className="list-group-item mb-3">
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
                                    <p className="text-secondary my-4">You have no applications yet.</p>
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