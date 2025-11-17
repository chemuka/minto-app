import PropTypes from 'prop-types'
import { toast } from 'sonner'
import { useState } from 'react'
import { CardChecklist, Heart, People, PeopleFill, PersonArmsUp, PersonCheck, PersonCheckFill, PersonCircle, PersonHeart, PersonHearts, PersonLinesFill, PersonRaisedHand, Plus, SendCheck, XCircleFill } from 'react-bootstrap-icons'
//import LoadingSpinner from '../loading/LoadingSpinner'
import ViewContactCard from '../person/components/ViewContactCard'
import MemberPersonInfoCard from '../person/components/MemberPersonInfoCard'
import { useAuth } from '../hooks/useAuth'
//import useFetch from '../hooks/useFetch'
import ConfirmationModal from '../misc/modals/ConfirmationModal'
import useConfirmation from '../hooks/useConfirmation'
import { useNavigate } from 'react-router-dom'
import UserSelectionModal from '../users/UserSelectionModal'

const DEFAULT_USER = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    source: '',
    picture: ''
}

const AddMember = (props) => {
    const { formData, setFormData, onSubmit, loading } = props
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    const [selectedUser, setSelectedUser] = useState(DEFAULT_USER)
    const [showUsersModal, setShowUsersModal] = useState(false)
    const [showContact, setShowContact] = useState(false)
    const { isAuthenticated } = useAuth()
    //const { fetchWithAuth } = useFetch()
    const navigate = useNavigate()
    //let user = getUser()

/*
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
                        console.log("[AddMember] - Testing ... line 28")
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
                    const data = await response.json()
                    setSelectedApplication(data)
                    //console.log('[AddMember] - data: ', data)
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
            console.log("Cleaned up after fetchData in AddMember!")
            }
    }, [formData, user, fetchWithAuth])
*/
    const handleToggle = () => {
        setShowContact(!showContact)
    }

    const cancel = async () => {
        const confirmation = await showConfirmation('Are you sure you want to cancel "Add Member"?')
        if(confirmation) {
            //setFormData(DEFAULT_MEMBER)
            console.log('Add Member Cancelled! The form is reset.')
            toast.info('"Add Member" -> Cancelled!', {
                description: 'The form has been reset.',
            })
            navigate('/login')
        } else {
            console.log('Cancel Aborted! Continue working on Add Member.')
            toast.info('Cancel -> Aborted!', {
                description: 'Continue working on "Add Member".',
            })
        }
    }

    const handleAddUser = (userToAdd) => {
        setSelectedUser(userToAdd)
        addUser(userToAdd)
        setShowUsersModal(false)
    }

    const addUser = (userToAdd) => {
        setFormData(prev => ({
            ...prev,
            userId: userToAdd.id,
        }))
    }

    return (
    <>
        <div>
            {
                isAuthenticated && (
                    <>
                        <div className='card mb-3 border border-danger shadow'>
                            <div className="card-header bg-danger text-white">
                                <div className="d-flex text-white">
                                    <CardChecklist size={30} className='me-2' />
                                    <h3 className='ms-1'>Add Member Details</h3>
                                </div>
                            </div>
                            <div className="card-body px-1 px-sm-3">
                                <div className="form-group row mb-3">
                                    <div className="d-flex">
                                        <PersonRaisedHand size={28} />
                                        <span className="h5 ms-2">
                                            {formData.application.person.lastName},&nbsp;
                                            {formData.application.person.firstName}&nbsp;
                                            {formData.application.person.middleName}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button 
                                            onClick={() => setShowUsersModal(true)}
                                            className="d-flex btn btn-dark text-center me-2"
                                            title={`Select User to Add`}
                                        >
                                            <Plus className="mb-1 text-white" size={21} />
                                            <span className='d-none d-sm-flex text-white'>Select User</span>
                                        </button>
                                    </div>
                                </div>
                                {/* Member Details */}
                                <h5 className="text-danger mb-3"><strong>Member Details</strong></h5>
                                <div className="form-group row row-cols-auto">
                                    <div className="col-6 col-xxl-2">
                                        <div className="form-floating mb-3">
                                            <input 
                                                id="userId"
                                                type="text" 
                                                className="form-control"
                                                value={selectedUser.id}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor="userId">User Id</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-xxl-4">
                                        <div className="form-floating mb-3">
                                            <input 
                                                id="userId"
                                                type="text" 
                                                className="form-control"
                                                value={selectedUser.email}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor="userId">Username / Email</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-xxl-3">
                                        <div className="form-floating mb-3">
                                            <input 
                                                id="userRole"
                                                type="text" 
                                                className="form-control"
                                                value={selectedUser.role}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor="userRole">User Role</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-xxl-3 mb-3">
                                        <div className="form-floating">
                                            <select
                                                className="form-select" 
                                                name="applicationStatus" 
                                                id="applicationStatus"
                                                value={formData.application.applicationStatus}
                                            >
                                                <option value="">Select...</option>
                                                <option value="Draft">Draft</option>
                                                <option value="Submitted">Submitted</option>
                                                <option value="In review">In Review</option>
                                                <option value="Approved">Approved</option>
                                                <option value="Rejected">Rejected</option>
                                                <option value="Withdrawn">Withdrawn</option>
                                            </select>
                                            <label htmlFor={"applicationStatus"}>Application Status</label>
                                        </div>
                                    </div>
                                </div>
                                {/* Application Details */}
                                <h5 className="text-primary mb-3"><strong>Application Details</strong></h5>
                                <div className="form-group row row-cols-auto">
                                    <div className="col-6 col-xxl-4">
                                        <div className="form-floating mb-3">
                                            <input 
                                                id="applicationId"
                                                type="text" 
                                                className="form-control"
                                                value={formData.application.id}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor="applicationId">Application Id</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-xxl-4">
                                        <div className="form-floating mb-3">
                                            <input 
                                                id="appCreatedAt"
                                                type="text" 
                                                className="form-control"
                                                value={formData.application.appCreatedAt}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor="appCreatedAt">App Created At</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-xxl-4">
                                        <div className="form-floating mb-3">
                                            <input 
                                                id="appUpdatedAt"
                                                type="text" 
                                                className="form-control"
                                                value={formData.application.appUpdatedAt}
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
                                                value={formData.application.maritalStatus}
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
                                                value={formData.application.person.dob}
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
                                                value={formData.application.person.lifeStatus}
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
                                        <ViewContactCard contact={formData.application.person.contact} />
                                    )
                                }
                                <MemberPersonInfoCard
                                    peopleData={formData.application.referees}
                                    headerIcon={PersonCheck}
                                    bodyIcon={PersonCheckFill}
                                    headerTitle={'Reference Information'}
                                    personTypeMultiple={'Referees'}
                                    personTypeSingle={'Referee'}
                                    priColor={'coral'}
                                />
                                <MemberPersonInfoCard
                                    peopleData={formData.application.relatives}
                                    headerIcon={PersonLinesFill}
                                    bodyIcon={PersonLinesFill}
                                    headerTitle={'Club Relatives'}
                                    personTypeMultiple={'Relatives'}
                                    personTypeSingle={'Relative'}
                                    priColor={'teal'}
                                />
                                <MemberPersonInfoCard
                                    peopleData={formData.application.spouses}
                                    headerIcon={Heart}
                                    bodyIcon={PersonHeart}
                                    headerTitle={'Spouses Information'}
                                    personTypeMultiple={'Spouses'}
                                    personTypeSingle={'Spouse'}
                                    priColor={'crimson'}
                                />
                                <MemberPersonInfoCard
                                    peopleData={formData.application.children}
                                    headerIcon={PersonCircle}
                                    bodyIcon={PersonCircle}
                                    headerTitle={'Children Information'}
                                    personTypeMultiple={'Children'}
                                    personTypeSingle={'Child'}
                                    priColor={'limegreen'}
                                />
                                <MemberPersonInfoCard
                                    peopleData={formData.application.parents}
                                    headerIcon={People}
                                    bodyIcon={PeopleFill}
                                    headerTitle={'Parents Information'}
                                    personTypeMultiple={'Parents'}
                                    personTypeSingle={'Parent'}
                                    priColor={'purple'}
                                />
                                <MemberPersonInfoCard
                                    peopleData={formData.application.siblings}
                                    headerIcon={PersonArmsUp}
                                    bodyIcon={PersonArmsUp}
                                    headerTitle={'Siblings Information'}
                                    personTypeMultiple={'Siblings'}
                                    personTypeSingle={'Sibling'}
                                    priColor={'orange'}
                                />
                                <MemberPersonInfoCard
                                    peopleData={formData.application.beneficiaries}
                                    headerIcon={PersonHearts}
                                    bodyIcon={PersonHearts}
                                    headerTitle={'Beneficiaries'}
                                    personTypeMultiple={'Beneficiaries'}
                                    personTypeSingle={'Beneficiary'}
                                    priColor={'saddlebrown'}
                                />
                                <div className="text-center my-3">
                                    <button type='button' onClick={cancel} className="btn btn-outline-danger mx-3" disabled={loading} title='Cancel Application Review'>
                                        <span className="d-none d-sm-inline-block">Cancel</span>
                                        <XCircleFill size={20} className="m-0 ms-sm-1 mb-1" />
                                    </button>
                                    <ConfirmationModal
                                        show={show}
                                        message={confirmMsg}
                                        onConfirm={handleConfirm}
                                        onCancel={handleCancel}
                                    />
                                    <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-success mx-3" disabled={loading} title='Update Membership Application'>
                                        <span className="d-none d-sm-inline-block">
                                            { loading ? 'Updating...' : 'Update' }
                                        </span>
                                        <SendCheck size={20} className="m-0 ms-sm-1 mb-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        
                    </>
                )
            }
        </div>
        
        {showUsersModal && (
            <UserSelectionModal
            onClose={() => setShowUsersModal(false)}
            onAddUser={handleAddUser}
            personType={'User'}
            />
        )}
    </>
    )
}

AddMember.propTypes = {
    formData: PropTypes.object,
    setFormData: PropTypes.func,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool,
}

export default AddMember
