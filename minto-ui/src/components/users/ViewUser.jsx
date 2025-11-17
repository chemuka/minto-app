import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner'
import LoadingSpinner from '../loading/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';

const DEFAULT_USER = {
    firstName: '',
    lastName: '', 
    email: '', 
    role: '', 
    source: '', 
    picture: '',
    createdAt: '', 
    updatedAt: ''
}

const ViewUser = (props) => {
    const { formData } = props
    const [viewUserData, setViewUserData] = useState(DEFAULT_USER)
    const { getUser, isAuthenticated } = useAuth()
    const { fetchWithAuth } = useFetch()
    const [isLoading, setIsLoading] = useState(false)
    let user = getUser()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                if(formData && user) {
                    const response = await fetchWithAuth(`http://localhost:8080/api/v1/users/${formData.email}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    
                    if (!response.ok) {
                        console.log("[ViewUser] - Testing ... line 28")
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
                    const data = await response.json();
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
                                                <div className="row pt-2">
                                                    <p className="h5 text-dark">Picture: </p>
                                                    {
                                                        viewUserData.picture ? (
                                                            <img src={viewUserData.picture} alt="Profile Picture" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                                                        ) : (
                                                            <img src="./images/dashboard/Avatar.PNG" alt="Test Profile Picture" style={{ maxWidth: '200px', maxHeight: '200px' }} />
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