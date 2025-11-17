import { useEffect, useState } from "react"
import { Search } from "react-bootstrap-icons"
import { toast } from "sonner"
import MembersGrid from "../grid/MembersGrid";
import ViewMember from "./ViewMember";
//import ModifyMembership from "../membership/ModifyMembership";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import UpdateMember from "./UpdateMember";

const EditMember = () => {
    const navigate = useNavigate()
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated } = useAuth()
    const [selectedMember, setSelectedMember] = useState(null)
    const [viewMember, setViewMember] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        id: 0,
        userId: 0,
        memberCreatedAt: "",
        memberUpdatedAt: "",
        application: {
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
        }
    })

    useEffect(() => {
        if(selectedMember) {
            setFormData(selectedMember)
        }

        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
                setSelectedMember(null)
                setViewMember(false)
            }, 3000)

            return () => clearTimeout(timerId)
        }
    }, [selectedMember, message, viewMember])

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const response = await fetchWithAuth(`http://localhost:8080/api/v1/members`, {
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
            toast.error('Error updating member. ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        {
            isAuthenticated ? (
                <div className="container my-3 px-0">
                    <div className="card mb-4 border border-danger shadow-lg">
                        <div className="card-header text-white bg-danger">
                            <div className="d-flex">
                                <Search size={26} className='text-white me-2' />
                                <h4 className="card-title">Search Member</h4>
                            </div>
                        </div>
                        <div className='card-body px-1 px-sm-3'>
                            <div className="d-flex align-items-center">
                                { message && <span className="text-primary ms-2 h6">{message}</span> }
                            </div>
                            
                            <MembersGrid setSelectedMember={setSelectedMember} setViewMember={setViewMember}  />
                                
                        </div>
                    </div>
                    {
                        selectedMember && viewMember && (
                            <ViewMember formData={formData} />
                        )
                    }                   
                    { 
                        selectedMember && !viewMember && (
                            <>
                            { console.log('selectedMember:', formData)}
                            <UpdateMember
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

export default EditMember