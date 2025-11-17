import { useEffect, useState } from "react"
import { Search } from "react-bootstrap-icons"
import RefereesGrid from "../grid/RefereesGrid"
import ViewMember from "../members/ViewMember"
import { useAuth } from "../hooks/useAuth"

const SelectReferee = () => {
    const { isAuthenticated } = useAuth()
    const [selectedMember, setSelectedMember] = useState(null)
    const [viewMember, setViewMember] = useState(false)
    const [message, setMessage] = useState('')
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
                    phones: [{ id: 0, type: "", countryCode: "", number: "" }]
                }
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
       // console.log('selectedMember:', selectedMember)
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

    return (
        <>
        {
            isAuthenticated ? (
                <div className="container mt-3 px-0">
                    <div className="card mb-4 border shadow" style={{ borderColor: 'coral'}}>
                        <div className="card-header text-white" style={{ backgroundColor: 'coral' }}>
                            <div className="d-flex">
                                <Search size={26} className='text-white me-2' />
                                <h5 className="card-title">Search & Select Referees</h5>
                            </div>
                        </div>
                        <div className='card-body px-1 px-sm-3'>
                            <div className="d-flex align-items-center">
                                { message && <span className="text-primary ms-2 h6">{message}</span> }
                            </div>
                            
                            <RefereesGrid setSelectedMember={setSelectedMember} setViewMember={setViewMember}  />
                                
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

export default SelectReferee