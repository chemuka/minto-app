import { useEffect, useState } from "react"
import { Search } from "react-bootstrap-icons"
import { toast } from "sonner"
import ViewApplication from "./ViewApplication"
import ModifyApplication from "./ModifyApplication"
import ApplicationsGrid from "../grid/ApplicationsGrid"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import useFetch from "../hooks/useFetch"

const EditApplication = () => {
    const navigate = useNavigate()
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated } = useAuth()
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [viewApplication, setViewApplication] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        id: 0,
        appCreatedAt: "",
        appUpdatedAt: "",
        applicationStatus: "",
        maritalStatus: "",
        person: {
            id: 0,
            firstName: "",
            middleName: "",
            lastName: "",
            dob: "",
            lifeStatus: "",
            createdAt: "",
            updatedAt: "",
            contact: {
                id: 0,
                addresses: [{ id: 0, type: "", street: "", city: "", state: "", zipcode: "", country: "" }],
                emails: [{ id: 0, type: "", address: "" }],
                phones: [{ id: 0, type: "", countryCode: "", number: "" }],
            },
        },
        beneficiaries: [],
        children: [],
        parents: [],
        referees: [],
        relatives: [],
        siblings: [],
        spouses: [],
    })

    useEffect(() => {
        //console.log('selectedApplication:', selectedApplication)
        if(selectedApplication) {
            setFormData(selectedApplication)
        }

        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
                setSelectedApplication(null)
                setViewApplication(false)
            }, 3000)

            return () => clearTimeout(timerId)
        }
    }, [selectedApplication, message])

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        //console.log('FormData:', formData)

        try {
            const response = await fetchWithAuth(`http://localhost:8080/api/v1/applications`, {
                method: 'PUT',
                credentials: "include",
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if(!response.ok) {
                console.log(`HTTP error! status: ${response.status}`)
                toast.error('HTTP error!')
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonData = await response.json();
            setFormData(jsonData)
            //console.log(jsonData);
            setMessage('Update successful')
            toast.success('Update successful')
            navigate('/login')
        } catch (error) {
            console.log(error)
            toast.error('Error updating application. ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        {
            isAuthenticated ? (
                <div className="container my-3 px-0">
                    <div className="card mb-4 border border-primary shadow">
                        <div className="card-header text-white bg-primary">
                            <div className="d-flex">
                                <Search size={26} className='text-white me-2' />
                                <h4 className="card-title">Search Application</h4>
                            </div>
                        </div>
                        <div className='card-body px-1 px-sm-3'>
                            <div className="d-flex align-items-center">
                                { message && <span className="text-primary ms-2 h6">{message}</span> }
                            </div>
                            
                            <ApplicationsGrid 
                                setSelectedApplication={setSelectedApplication} 
                                setViewApplication={setViewApplication}  
                                url={"http://localhost:8080/api/v1/applications"}
                            />
                                
                        </div>
                    </div>
                    {
                        selectedApplication && viewApplication && (
                            <ViewApplication formData={formData} />
                        )
                    }                   
                    { 
                        selectedApplication && !viewApplication && (
                            <>
                            { console.log('selectedApplication:', formData)}
                            <ModifyApplication
                                formData={formData}
                                setFormData={setFormData}
                                loading={loading}
                                onSubmit={onSubmit}
                            />
                            </>
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
    );
};

export default EditApplication