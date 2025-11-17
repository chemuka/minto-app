import PropTypes from 'prop-types'
import LoadingSpinner from '../loading/LoadingSpinner'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Heart, People, PeopleFill, PersonArmsUp, PersonCheck, PersonCheckFill, PersonCircle, PersonHeart, PersonHearts, PersonLinesFill, PersonVcard } from 'react-bootstrap-icons'
import ViewContactCard from '../person/components/ViewContactCard'
import MemberPersonInfoCard from '../person/components/MemberPersonInfoCard'
import { useAuth } from '../hooks/useAuth'
import useFetch from '../hooks/useFetch'

const DEFAULT_MEMBER = {
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
}

const ViewMember = (props) => {
    const { formData } = props
    const [viewMemberData, setViewPersonData] = useState(DEFAULT_MEMBER)
    const [showContact, setShowContact] = useState(false)
    const { getUser, isAuthenticated } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const { fetchWithAuth } = useFetch()
    let user = getUser()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                if((formData.id > 0) && user) {
                    const response = await fetchWithAuth(`http://localhost:8080/api/v1/members/${formData.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    
                    if (!response.ok) {
                        console.log("[ViewMember] - Testing ... line 28")
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
                    const data = await response.json()
                    setViewPersonData(data)
                    toast.success('Person data loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch(error) {
                console.log(error)
                toast.error('Error loading member. ' + error.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
        
        return () => {
            console.log("Cleaned up after fetchData in ViewPerson!")
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
                    <LoadingSpinner caption={'View Member'} clsTextColor={"text-danger"} />
                ) : (
                    isAuthenticated && (
                        <>
                            <div className='card mb-3'>
                                <div className="card-header bg-danger">
                                    <div className="d-flex text-white">
                                        <PersonLinesFill size={30} className='me-2' />
                                        <h3 className='ms-1'>Member Details</h3>
                                    </div>
                                </div>
                                <div className="card-body px-1 px-sm-3">
                                    <div className="form-group row mb-3">
                                        <div className="d-flex">
                                            <PersonVcard size={28} />
                                            <span className="h5 ms-2">
                                                {viewMemberData.application.person.lastName},&nbsp;
                                                {viewMemberData.application.person.firstName}&nbsp;
                                                {viewMemberData.application.person.middleName}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Member Details */}
                                    <h5 className="text-danger mb-3"><strong>Member Details</strong></h5>
                                    <div className="form-group row row-cols-auto">
                                        <div className="col-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="memberId"
                                                    type="text" 
                                                    className="form-control"
                                                    value={viewMemberData.id}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="memberId">Member Id</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="userId"
                                                    type="text" 
                                                    className="form-control"
                                                    value={viewMemberData.userId}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="userId">User Id</label>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="memberCreatedAt"
                                                    type="text" 
                                                    className="form-control"
                                                    value={viewMemberData.memberCreatedAt}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="memberCreatedAt">Member Created At</label>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="memberUpdatedAt"
                                                    type="text" 
                                                    className="form-control"
                                                    value={viewMemberData.memberUpdatedAt}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="memberUpdatedAt">Member Updated At</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xxl-4">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="maritalStatus"
                                                    type="text" 
                                                    className="form-control"
                                                    value={viewMemberData.application.maritalStatus}
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
                                                    value={viewMemberData.application.person.dob}
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
                                                    value={viewMemberData.application.person.lifeStatus}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="lifeStatus">Life Status</label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Application Details */}
                                    <h5 className="text-danger mb-3"><strong>Application Details</strong></h5>
                                    <div className="form-group row row-cols-auto">
                                        <div className="col-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="applicationId"
                                                    type="text" 
                                                    className="form-control"
                                                    value={viewMemberData.application.id}
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
                                                    value={viewMemberData.application.applicationStatus}
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
                                                    value={viewMemberData.application.appCreatedAt}
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
                                                    value={viewMemberData.application.appUpdatedAt}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="appUpdatedAt">App Updated At</label>
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
                                            <ViewContactCard contact={viewMemberData.application.person.contact} />
                                        )
                                    }
                                </div>
                            </div>
                            
                            <MemberPersonInfoCard
                                peopleData={viewMemberData.application.spouses}
                                headerIcon={Heart}
                                bodyIcon={PersonHeart}
                                headerTitle={'Spouses Information'}
                                personTypeMultiple={'Spouses'}
                                personTypeSingle={'Spouse'}
                                priColor={'crimson'}
                            />
                            <MemberPersonInfoCard
                                peopleData={viewMemberData.application.children}
                                headerIcon={PersonCircle}
                                bodyIcon={PersonCircle}
                                headerTitle={'Children Information'}
                                personTypeMultiple={'Children'}
                                personTypeSingle={'Child'}
                                priColor={'limegreen'}
                            />
                            <MemberPersonInfoCard
                                peopleData={viewMemberData.application.parents}
                                headerIcon={People}
                                bodyIcon={PeopleFill}
                                headerTitle={'Parents Information'}
                                personTypeMultiple={'Parents'}
                                personTypeSingle={'Parent'}
                                priColor={'purple'}
                            />
                            <MemberPersonInfoCard
                                peopleData={viewMemberData.application.siblings}
                                headerIcon={PersonArmsUp}
                                bodyIcon={PersonArmsUp}
                                headerTitle={'Siblings Information'}
                                personTypeMultiple={'Siblings'}
                                personTypeSingle={'Sibling'}
                                priColor={'orange'}
                            />
                            <MemberPersonInfoCard
                                peopleData={viewMemberData.application.referees}
                                headerIcon={PersonCheck}
                                bodyIcon={PersonCheckFill}
                                headerTitle={'Reference Information'}
                                personTypeMultiple={'Referees'}
                                personTypeSingle={'Referee'}
                                priColor={'coral'}
                            />
                            <MemberPersonInfoCard
                                peopleData={viewMemberData.application.relatives}
                                headerIcon={PersonLinesFill}
                                bodyIcon={PersonLinesFill}
                                headerTitle={'Club Relatives'}
                                personTypeMultiple={'Relatives'}
                                personTypeSingle={'Relative'}
                                priColor={'teal'}
                            />
                            <MemberPersonInfoCard
                                peopleData={viewMemberData.application.beneficiaries}
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

ViewMember.propTypes = {
    formData: PropTypes.object,
}

export default ViewMember
