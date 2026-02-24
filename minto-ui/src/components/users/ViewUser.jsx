import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner'
import LoadingSpinner from '../loading/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';
import { defaultUser } from '../../model/defaultUser';

const API_BASE_URL = "http://localhost:8080";

const ViewUser = (props) => {
    const { formData } = props
    const [viewUserData, setViewUserData] = useState({ ...defaultUser })
    const { getUser, isAuthenticated } = useAuth()
    const { fetchWithAuth } = useFetch()
    const [isLoading, setIsLoading] = useState(false)
    let user = getUser()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                console.log('formData: ', formData)
                if(formData.email && user) {
                    const response = await fetchWithAuth(`http://localhost:8080/api/v1/users/${formData.email}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    console.log('Response: ', response)
                    if (!response.ok) {
                        console.log("[ViewUser] - Error: ", response.status)
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
                    const data = await response.json();
                    console.log('User: ', data)
                    setViewUserData(data);
                    toast.success('User data loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch(error) {
                console.log(error)
                toast.error('Error loading user. ' + error.message)
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
        
        return () => {
            console.log("Cleaned up after fetchData in ViewUser!");
          }
    }, [formData, user, fetchWithAuth]);

    return (
        <>
            {
                (isAuthenticated && ((user.decoded.role === 'Admin') || (user.decoded.role === 'Staff'))) ? (
                    <div>
                        {
                            isLoading ? (
                                <LoadingSpinner caption={'View user'} clsTextColor={"text-black"} />
                            ) : (
                                isAuthenticated && (
                                    <div className="container my-3 px-0">
                                        <div className="card my-4 border">
                                            <div className="card-header text-white bg-dark">
                                                <h5 className="card-title">View User: {viewUserData.lastName}, {viewUserData.firstName}</h5>
                                            </div>
                                            <div className='card-body'>
                                                <p className="h5 text-dark">Picture: </p>
                                                <div className="row mb-3">
                                                    {
                                                        viewUserData.picture ? (
                                                            <img src={`${API_BASE_URL}${viewUserData.picture}`} alt="Profile Picture" style={s.avatar} />
                                                        ) : (
                                                            <img src="./images/dashboard/Avatar.PNG" alt="Test Profile Picture" style={s.avatar} />
                                                        )
                                                    }
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12 mb-3">
                                                        <p className="h5 form-label text-dark">Email:</p>
                                                        <p className="form-control bg-light">{viewUserData.email}</p>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <div className="col-sm-6 mb-3">
                                                        <p className="h5 form-label text-dark">First Name:</p>
                                                        <p className="form-control bg-light">{viewUserData.firstName}</p>
                                                    </div>
                                                    <div className="col-sm-6 mb-3">
                                                        <p className="h5 form-label text-dark">Last Name:</p>
                                                        <p className="form-control bg-light">{viewUserData.lastName}</p>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <div className="col-sm-6 mb-3">
                                                        <p className="h5 form-label text-dark">Source:</p>
                                                        <p className="form-control bg-light">{viewUserData.source}</p>
                                                    </div>
                                                    <div className="col-sm-6 mb-3">
                                                        <p className="h5 form-label text-dark">Role:</p>
                                                        <p className="form-control bg-light">{viewUserData.role}</p>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <div className="col-sm-6 mb-3">
                                                        <p className="h5 form-label text-dark">Created At:</p>
                                                        <p className="form-control bg-light">{viewUserData.createdAt}</p>
                                                    </div>
                                                    <div className="col-sm-6 mb-3">
                                                        <p className="h5 form-label text-dark">Updated At:</p>
                                                        <p className="form-control bg-light">{viewUserData.updatedAt}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </div>
                ) : (
                    <div className="container my-3 p-2">
                        <h3 className="text-primary text-center">Unauthorized</h3>
                    </div>
                )
            }
        </>
    )
}

ViewUser.propTypes = {
    formData: PropTypes.object,
}

export default ViewUser

const s = {
    avatar: { width:'150px', height:'150px', borderRadius:'50%', objectFit:'cover', border:'4px solid #12ab34', boxShadow:'0 4px 20px rgba(102,126,234,0.3)' },
}