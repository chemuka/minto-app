import { useEffect, useState } from "react"
import UserGrid from "../grid/UserGrid"
import { toast } from 'sonner'
import UpdateUser from "./UpdateUser"
import ViewUser from "./ViewUser"
import { Search } from "react-bootstrap-icons"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import useFetch from "../hooks/useFetch"

const EditUser = () => {
    const navigate = useNavigate()
    const { getUser, isAuthenticated } = useAuth()
    const { fetchWithAuth } = useFetch()
    const [selectedUser, setSelectedUser] = useState(null)
    const [viewUser, setViewUser] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isAdminOrStaff, setIsAdminOrStaff] = useState(false);
    const [formData, setFormData] = useState(
        {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: "",
            picture: "",
        }
    )

    let user = getUser()

    useEffect(() => {
        const isUserAdminOrStaff = () => {
            if (user !== null) {
                if ((user.decoded.role === 'Admin') || (user.decoded.role === 'Staff'))
                    return true;
                else
                    return false;
            }
        }
        setIsAdminOrStaff(isUserAdminOrStaff())

        if(selectedUser) {
            setFormData({
                firstName: selectedUser.firstName, 
                lastName: selectedUser.lastName,
                email: selectedUser.email,
                role: selectedUser.role,
            })
        }

        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
                setSelectedUser(null)
                setViewUser(false)
            }, 3000)

            return () => clearTimeout(timerId)
        }
    }, [selectedUser, message, viewUser, user])

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (newPassword) => {
        setFormData({ ...formData, password: newPassword });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const response = await fetchWithAuth(`http://localhost:8080/api/v1/users/secure/${formData.email}`, {
                method: 'PATCH',
                credentials: "include",
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    picture: formData.picture,
                }),
            });

            if(!response.ok) {
                console.log(`HTTP error! status: ${response.status}`)
                toast.error('HTTP error!')
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonData = await response.json();
            //console.log(jsonData);
            setMessage(`${jsonData.firstName} ${jsonData.lastName} updated successful`)
            toast.success(`${jsonData.firstName} ${jsonData.lastName} updated successful`)
            navigate('/login')
        } catch (error) {
            console.log(error)
            toast.error('Error updating user. ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {
                isAuthenticated && isAdminOrStaff ? (
                    <div className="card my-3 border border-dark shadow">
                        <div className="card-header text-white bg-dark">
                            <div className="d-flex">
                                <Search size={26} className='text-white me-2' />
                                <h4 className="card-title">Search User</h4>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className="d-flex align-items-center">
                                { message && <span className="text-primary ms-2 h6">{message}</span> }
                            </div>
                            
                            <UserGrid setSelectedUser={setSelectedUser} setViewUser={setViewUser}  />
                            
                            {
                                selectedUser && viewUser && (
                                    <ViewUser formData={formData} />
                                )
                            }                   
                            { 
                                selectedUser && !viewUser && (
                                    <UpdateUser 
                                        loading={loading} 
                                        formData={formData} 
                                        onInputChange={onInputChange} 
                                        handlePasswordChange={handlePasswordChange} 
                                        onSubmit={onSubmit}
                                    />
                                )
                            }    
                        </div>
                    </div>
                ) : (
                    <div className="container my-3 p-2">
                        <h3 className="text-primary text-center">Unauthorized</h3>
                    </div>
                )
            }
        </>
    );
};

export default EditUser