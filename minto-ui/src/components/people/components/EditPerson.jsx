import { useEffect, useState } from "react"
import ViewPerson from "./ViewPerson"
import PeopleGrid from "../../grid/PeopleGrid"
import ModifyPerson from "./ModifyPerson"
import { Search } from "react-bootstrap-icons"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import useFetch from "../../hooks/useFetch"

const DEFAULT_PERSON = {
    id: 0,
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    lifeStatus: "",
    contact: {
        id: 0,
        addresses: [{ id: 0, type: "", street: "", city: "", state: "", zipcode: "", country: "" }],
        emails: [{ id: 0, type: "", address: "" }],
        phones: [{ id: 0, type: "", countryCode: "", number: "" }]
    },
    createdAt: "",
    updatedAt: "",
}

const EditPerson = () => {
    const navigate = useNavigate()
    const { fetchWithAuth } = useFetch()
    const { getUser, isAuthenticated } = useAuth()
    const [selectedPerson, setSelectedPerson] = useState(null)
    const [viewPerson, setViewPerson] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(DEFAULT_PERSON)
    const [isAdminOrStaff, setIsAdminOrStaff] = useState(false)
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

        if(selectedPerson) {
            setFormData(selectedPerson)
        }

        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
                setSelectedPerson(null)
                setViewPerson(false)
            }, 3000)

            return () => clearTimeout(timerId)
        }
    }, [selectedPerson, message, viewPerson, user])

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        //console.log('FormData:', formData)

        try {
            const response = await fetchWithAuth(`http://localhost:8080/api/v1/people/${formData.id}`, {
                method: 'PATCH',
                credentials: "include",
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if(!response.ok) {
                console.log(`HTTP error! status: ${response.status}`)
                toast.error('HTTP error!')
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const jsonData = await response.json()
            setFormData(jsonData)
            //console.log(jsonData)
            setMessage('Update successful')
            toast.success('Update successful')
            navigate('/login')
        } catch (error) {
            console.log(error)
            toast.error('Error updating person. ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {
                isAuthenticated && isAdminOrStaff ? (
                    <div className="container my-3 px-0">
                        <div className="card mb-4 border border-info shadow">
                            <div className="card-header bg-info">
                                <div className="d-flex">
                                    <Search size={26} className='me-2' />
                                    <h4 className="card-title">Search Person</h4>
                                </div>
                            </div>
                            <div className='card-body px-1 px-sm-3'>
                                <div className="d-flex align-items-center">
                                    { message && <span className="text-primary ms-2 h6">{message}</span> }
                                </div>
                                
                                <PeopleGrid setSelectedPerson={setSelectedPerson} setViewPerson={setViewPerson}  />
                                
                                {
                                    selectedPerson && viewPerson && (
                                        <ViewPerson formData={formData} />
                                    )
                                }                   
                                { 
                                    selectedPerson && !viewPerson && (
                                        <ModifyPerson
                                            formData={formData}
                                            setFormData={setFormData}
                                            loading={loading}
                                            onInputChange={onInputChange}
                                            onSubmit={onSubmit}
                                        />
                                    )
                                }    
                            </div>
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

export default EditPerson