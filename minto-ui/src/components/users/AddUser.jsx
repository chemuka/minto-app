import { useEffect, useState } from "react";
import CustomSelect from "../misc/CustomSelect";
import PasswordGenerator from "../misc/PasswordGenerator";
import { toast } from 'sonner'
import { Floppy, XCircleFill } from "react-bootstrap-icons";
import ConfirmationModal from "../misc/modals/ConfirmationModal";
import useConfirmation from "../hooks/useConfirmation";
import { useAuth } from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";

const DEFAULT_USER = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    source: 'DASHBOARD',
    picture: ''
}

const AddUser = () => {
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    const { getUser, isAuthenticated } = useAuth()
    const { fetchWithAuth } = useFetch()
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isAdminOrStaff, setIsAdminOrStaff] = useState(false)
    const [formData, setFormData] = useState(DEFAULT_USER)
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

        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
            }, 3000)

            return () => clearTimeout(timerId)
        }
    }, [message, user])

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handlePasswordChange = (newPassword) => {
        setFormData({ ...formData, password: newPassword });
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('Adding new user...')

        try {
            if(isAuthenticated) {
                const response = await fetchWithAuth('http://localhost:8080/api/v1/users/secure', {
                    method: 'POST',
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
                        source: formData.source,
                        picture: formData.picture
                    }),
                })

                if(!response.ok) {
                    console.log(`HTTP error! status: ${response.status}`)
                    toast.error('HTTP error!')
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const jsonData = await response.json();
                //console.log(jsonData)
                setFormData(DEFAULT_USER)
                setMessage(`User: ${jsonData.firstName} ${jsonData.lastName} created successfully!`)
                toast.success(`User: ${jsonData.firstName} ${jsonData.lastName} created successfully!`)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const cancel = async () => {
        const confirmation = await showConfirmation("Are you sure you want to cancel 'Add New User'?")
        if(confirmation) {
            setFormData(DEFAULT_USER)
            console.log("Add New User Cancelled! The form is reset.")
            toast.info("'Add New User' -> Cancelled!", {
                description: "The form has been reset."
            })
        } else {
            console.log("Cancel Aborted! Continue with 'Add New User'.")
            toast.info("Cancel -> Aborted!", {
                description: "Continue with 'Add New User' form."
            })
        }
    }

    return (
        <>
            <style>{` 
                .form-control::file-selector-button { 
                    background-color: #333;
                    color: #4af;
                    border: 1px solid #333;
                    padding: .375rem .75rem;
                    border-radius: .25rem;
                }  
                .form-control::file-selector-button::hover {
                    background-color: #777;
                    border: 1px solid #777;
                    color: #333;
                }
              `}
            </style>
        {
            isAuthenticated && isAdminOrStaff ? (
                <div className="card my-3 border border-dark shadow">
                    <div className="card-header text-white bg-dark">
                        <h3 className="card-title">Add New User</h3>
                    </div>
                    <div className='card-body'>
                        <form onSubmit={(e) => onSubmit(e)} action="">
                            <div className="border rounded-lg p-1 p-sm-4 mb-3 bg-light">
                                <div className="form-group row">
                                    <div className="col-sm-6 mb-3">
                                        <label htmlFor={"firstName"} className="form-label">
                                            First Name
                                        </label>
                                        <input
                                            id={"firstName"}
                                            name="firstName"
                                            type={"text"}
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={(e) => onInputChange(e)}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label htmlFor={"lastName"} className="form-label">
                                            Last Name
                                        </label>
                                        <input
                                            id={"lastName"}
                                            name="lastName"
                                            type={"text"}
                                            placeholder="Last Name"
                                            value={formData.lastName}
                                            onChange={(e) => onInputChange(e)}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-6 mb-3">
                                        <label htmlFor={"email"} className="form-label">
                                            Email
                                        </label>
                                        <input
                                            id={"email"}
                                            name="email"
                                            type={"email"}
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={(e) => onInputChange(e)}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <PasswordGenerator
                                            className={'text-dark'}
                                            id="password"
                                            name="password"
                                            placeholder="Type or generate password"
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-5 mb-3">
                                        <label htmlFor="role" className="form-label">
                                            Role
                                        </label>
                                        <CustomSelect
                                            className="form-select mb-3"
                                            name="role"
                                            value={formData.role}
                                            placeholder=" -- Select a role -- "
                                            onChange={(e) => onInputChange(e)}
                                            url="http://localhost:8080/api/v1/auth/roles"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-7 mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Picture
                                        </label>
                                        <input
                                            type={"file"}
                                            className="form-control"
                                            placeholder="Profile picture"
                                            name="picture"
                                            value={formData.picture}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center my-3">
                                <button type='button' onClick={cancel} className="btn btn-outline-danger mx-3" title="Cancel New User">
                                    <XCircleFill size={20} className="m-0 me-sm-2 mb-1" />
                                    <span className="d-none d-sm-inline-block">Cancel</span>
                                </button>
                                <ConfirmationModal
                                    show={show}
                                    message={confirmMsg}
                                    onConfirm={handleConfirm}
                                    onCancel={handleCancel}
                                />
                                <button type="submit" className="btn btn-outline-success mx-2 px-3" title="Save New User" >
                                    <Floppy size={20} className="m-0 me-sm-2 mb-1" />
                                    <span className="d-none d-sm-inline-block">
                                        { loading ? 'Saving...' : 'Save' }
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
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

export default AddUser
