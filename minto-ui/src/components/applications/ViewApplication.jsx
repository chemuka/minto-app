import PropTypes from 'prop-types'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { CardChecklist, Heart, People, PeopleFill, PersonArmsUp, PersonCheck, PersonCheckFill, PersonCircle, PersonHeart, PersonHearts, PersonLinesFill, PersonRaisedHand } from 'react-bootstrap-icons'
import LoadingSpinner from '../loading/LoadingSpinner'
import ViewContactCard from '../person/components/ViewContactCard'
import MemberPersonInfoCard from '../person/components/MemberPersonInfoCard'
import { useAuth } from '../hooks/useAuth'
import useFetch from '../hooks/useFetch'

const DEFAULT_APPLICATION = {
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

const ViewApplication = (props) => {
    const { formData } = props
    const [viewApplicationData, setViewApplicationData] = useState(DEFAULT_APPLICATION)
    const [showContact, setShowContact] = useState(false)
    const { fetchWithAuth } = useFetch()
    const { getUser, isAuthenticated } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    let user = getUser()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                if((formData.id > 0) && user) {
                    const response = await fetchWithAuth(`http://localhost:8080/api/v1/applications/${formData.id}`, {
                        method: 'GET',
                        credentials: 'include',
                    })
                    
                    if (!response.ok) {
                        console.log("[ViewApplication] - Testing ... line 28")
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
                    const data = await response.json()
                    setViewApplicationData(data)
                    //console.log('[ViewApplication] - data: ', data)
                    toast.success('Application data loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch(error) {
                console.log(error)
                toast.error('Error loading application. ' + error.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
        
        return () => {
            console.log("Cleaned up after fetchData in ViewApplication!")
            }
    }, [formData, user, fetchWithAuth])

    const handleToggle = () => {
        setShowContact(!showContact)
    }

    return (
    <>
        <div>
            {
                isLoading ? (
                    <LoadingSpinner caption={'View Application'} clsTextColor={"text-primary"} />
                ) : (
                    isAuthenticated && (
                        <>
                            <div className='card mb-3'>
                                <div className="card-header bg-primary">
                                    <div className="d-flex text-white">
                                        <CardChecklist size={30} className='me-2' />
                                        <h3 className='ms-1'>Application Details</h3>
                                    </div>
                                </div>
                                <div className="card-body px-1 px-sm-3">
                                    <div className="form-group row mb-3">
                                        <div className="d-flex">
                                            <PersonRaisedHand size={28} />
                                            <span className="h5 ms-2">
                                                {viewApplicationData.person.lastName},&nbsp;
                                                {viewApplicationData.person.firstName}&nbsp;
                                                {viewApplicationData.person.middleName}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Application Details */}
                                    <h5 className="text-primary mb-3"><strong>Application Details</strong></h5>
                                    <div className="form-group row row-cols-auto">
                                        <div className="col-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="applicationId"
                                                    type="text" 
                                                    className="form-control"
                                                    value={viewApplicationData.id}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="applicationId">Application Id</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="applicationStatus"
                                                    type="text" 
                                                    className="form-control"
                                                    value={viewApplicationData.applicationStatus}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="applicationStatus">Application Status</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="appCreatedAt"
                                                    type="text" 
                                                    className="form-control"
                                                    value={viewApplicationData.appCreatedAt}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="appCreatedAt">App Created At</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="appUpdatedAt"
                                                    type="text" 
                                                    className="form-control"
                                                    value={viewApplicationData.appUpdatedAt}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="appUpdatedAt">App Updated At</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row row-cols-auto">
                                        <div className="col-6 col-xxl-4">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="maritalStatus"
                                                    type="text" 
                                                    className="form-control"
                                                    value={viewApplicationData.maritalStatus}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="maritalStatus">Marital Status</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xxl-4">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="dob"
                                                    type="text" 
                                                    className="form-control"
                                                    value={viewApplicationData.person.dob}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="dob">Date Of Birth</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xxl-4">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="lifeStatus"
                                                    type="text" 
                                                    className="form-control"
                                                    value={viewApplicationData.person.lifeStatus}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="lifeStatus">Life Status</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex mb-3 justify-content-end">
                                        <button onClick={handleToggle} className="btn btn-dark mb-3">
                                            {showContact ? 'Hide Contact' : 'Show Contact'}
                                        </button>
                                    </div>
                                    {
                                        showContact && (
                                            <ViewContactCard contact={viewApplicationData.person.contact} />
                                        )
                                    }
                                </div>
                            </div>
                            
                            <MemberPersonInfoCard
                                peopleData={viewApplicationData.spouses}
                                headerIcon={Heart}
                                bodyIcon={PersonHeart}
                                headerTitle={'Spouses Information'}
                                personTypeMultiple={'Spouses'}
                                personTypeSingle={'Spouse'}
                                priColor={'crimson'}
                            />
                            <MemberPersonInfoCard
                                peopleData={viewApplicationData.children}
                                headerIcon={PersonCircle}
                                bodyIcon={PersonCircle}
                                headerTitle={'Children Information'}
                                personTypeMultiple={'Children'}
                                personTypeSingle={'Child'}
                                priColor={'limegreen'}
                            />
                            <MemberPersonInfoCard
                                peopleData={viewApplicationData.parents}
                                headerIcon={People}
                                bodyIcon={PeopleFill}
                                headerTitle={'Parents Information'}
                                personTypeMultiple={'Parents'}
                                personTypeSingle={'Parent'}
                                priColor={'purple'}
                            />
                            <MemberPersonInfoCard
                                peopleData={viewApplicationData.siblings}
                                headerIcon={PersonArmsUp}
                                bodyIcon={PersonArmsUp}
                                headerTitle={'Siblings Information'}
                                personTypeMultiple={'Siblings'}
                                personTypeSingle={'Sibling'}
                                priColor={'orange'}
                            />
                            <MemberPersonInfoCard
                                peopleData={viewApplicationData.referees}
                                headerIcon={PersonCheck}
                                bodyIcon={PersonCheckFill}
                                headerTitle={'Reference Information'}
                                personTypeMultiple={'Referees'}
                                personTypeSingle={'Referee'}
                                priColor={'coral'}
                            />
                            <MemberPersonInfoCard
                                peopleData={viewApplicationData.relatives}
                                headerIcon={PersonLinesFill}
                                bodyIcon={PersonLinesFill}
                                headerTitle={'Club Relatives'}
                                personTypeMultiple={'Relatives'}
                                personTypeSingle={'Relative'}
                                priColor={'teal'}
                            />
                            <MemberPersonInfoCard
                                peopleData={viewApplicationData.beneficiaries}
                                headerIcon={PersonHearts}
                                bodyIcon={PersonHearts}
                                headerTitle={'Beneficiaries'}
                                personTypeMultiple={'Beneficiaries'}
                                personTypeSingle={'Beneficiary'}
                                priColor={'saddlebrown'}
                            />
                        </>
                    )
                )
            }
        </div>
    </>
    )
}

ViewApplication.propTypes = {
    formData: PropTypes.object,
}

export default ViewApplication
