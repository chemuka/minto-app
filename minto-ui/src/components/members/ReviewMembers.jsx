import { useEffect, useState } from "react"
import { Search } from "react-bootstrap-icons"
import { toast } from "sonner"
import ViewApplication from "../applications/ViewApplication"
import ApplicationsGrid from "../grid/ApplicationsGrid"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import useFetch from "../hooks/useFetch"
import AddMember from "./AddMember"
import { defaultMember } from "../../model/defaultMember"

const ReviewMembers = () => {
    const navigate = useNavigate()
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated } = useAuth()
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [viewApplication, setViewApplication] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ ...defaultMember })

    useEffect(() => {
        //console.log('selectedApplication:', selectedApplication)
        if(selectedApplication) {
            setFormData(prev => ({
                ...prev,
                application: selectedApplication,
            }))
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
        console.log('FormData:', formData)

        try {
            const response = await fetchWithAuth(`http://localhost:8080/api/v1/members`, {
                method: 'POST',
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
            toast.error('Error updating submitted application. ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        {
            isAuthenticated ? (
                <div className="container my-3 px-0">
                    <div className="card mb-4 border border-danger shadow">
                        <div className="card-header bg-danger text-white">
                            <div className="d-flex">
                                <Search size={26} className='text-white me-2' />
                                <h4 className="card-title">Search Submitted Application</h4>
                            </div>
                        </div>
                        <div className='card-body px-1 px-sm-3'>
                            <div className="d-flex align-items-center">
                                { message && <span className="text-primary ms-2 h6">{message}</span> }
                            </div>
                            
                            <ApplicationsGrid 
                                setSelectedApplication={setSelectedApplication} 
                                setViewApplication={setViewApplication}  
                                url={"http://localhost:8080/api/v1/applications/status/in/approved,rejected,withdrawn"}
                            />
                                
                        </div>
                    </div>
                    {
                        selectedApplication && viewApplication && (
                            <ViewApplication formData={selectedApplication} />
                        )
                    }
                    { 
                        selectedApplication && !viewApplication && (
                            <>
                            { console.log('formData:', formData)}
                            { <AddMember 
                                formData={formData} 
                                setFormData={setFormData}
                                loading={loading}
                                onSubmit={onSubmit}
                            /> }
                            {/*<ModifyApplication
                                formData={formData}
                                setFormData={setFormData}
                                loading={loading}
                                onSubmit={onSubmit}
                            />*/}
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
    )
}

export default ReviewMembers