import { useEffect, useState } from 'react';
import { ArrowLeftCircleFill, ArrowRightCircleFill, EnvelopeAt, EnvelopeFill, GeoAlt, Heart, People, PeopleFill, Person, PersonArmsUp, PersonCheck, PersonCheckFill, PersonCircle, PersonFill, PersonHeart, PersonHearts, PersonLinesFill, Plus, Send, SendCheck, Telephone, Trash, XCircleFill } from 'react-bootstrap-icons';
import { ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import countriesData from '../../assets/data/countries.json';
import PropTypes from 'prop-types'
import ConfirmationModal from '../misc/modals/ConfirmationModal';
import { toast } from 'sonner';
import useConfirmation from '../hooks/useConfirmation';
import UserSelectionModal from '../users/UserSelectionModal';
import MemberSelectionModal from './MemberSelectionModal';

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

/**
 * Update member details by admin or staff users with higher permissions and priviledges.
 */
const UpdateMember = (props) => {
    const { formData, setFormData, loading, onSubmit } = props
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    const navigate = useNavigate()
    const [selectedUser, setSelectedUser] = useState(DEFAULT_USER)
    const [showUsersModal, setShowUsersModal] = useState(false)
    const [showRefereesModal, setShowRefereesModal] = useState(false)
    const [showRelativesModal, setShowRelativesModal] = useState(false)
    const [selectedReferees, setSelectedReferees] = useState([])
    const [selectedRelatives, setSelectedRelatives] = useState([])
    const [message, setMessage] = useState('')
    const [currentStep, setCurrentStep] = useState(0)

    const steps = [
        { number: 1, title: "Applicant's Info", icon: Person },
        { number: 2, title: "Family Info", icon: Heart },
        { number: 3, title: "Parents Info", icon: People },
        { number: 4, title: "Siblings Info", icon: PersonArmsUp },
        { number: 5, title: "Reference Info", icon: PersonCheck },
        { number: 6, title: "Club Relatives", icon: PersonLinesFill },
        { number: 7, title: "Beneficiaries Info", icon: PersonHearts },
    ]

    const createEmptyPerson = () => ({
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
        lifeStatus: "",
        contact: {
            addresses: [{ type: "", street: "", city: "", state: "", zipcode: "", country: "" }],
            emails: [{ type: "", address: "" }],
            phones: [{ type: "", countryCode: "", number: "" }]
        }
    })

    const createNewReferee = () => ({
        id: 0,
        member: {
            id: 0,
            userId: 0,
            memberCreatedAt: "",
            memberUpdatedAt: "",
            application: {
                id: 0,
                applicationStatus: "",
                maritalStatus: "",
                appCreatedAt: "",
                appUpdatedAt: "",
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
                parents: [],
                spouses: [],
                children: [],
                siblings: [],
                referees: [],
                relatives: [],
                beneficiaries: [],
            }
        }  
    })

    const createEmptyParent = () => ({ person: createEmptyPerson() })
    const createEmptySpouse = () => ({ person: createEmptyPerson(), maritalStatus: "" })
    const createEmptyChild = () => ({ person: createEmptyPerson() })
    const createEmptySibling = () => ({ person: createEmptyPerson(), siblingType: "" })
    const createEmptyReferee = () => ( createNewReferee() )
    const createEmptyRelative = () => ({ person: createEmptyPerson(), relationship: "" })
    const createEmptyBeneficiary = () => ({ person: createEmptyPerson(), percentage: 0.0 })

    const addPersonToArray = (arrayName) => {
        let newEntry
        switch (arrayName) {
        case 'parents': 
            newEntry = createEmptyParent() 
            break
        case 'spouses': 
            newEntry = createEmptySpouse() 
            break
        case 'children': 
            newEntry = createEmptyChild() 
            break
        case 'siblings': 
            newEntry = createEmptySibling() 
            break
        case 'referees': 
            newEntry = createEmptyReferee() 
            break
        case 'relatives': 
            newEntry = createEmptyRelative()
            break
        case 'beneficiaries': 
            newEntry = createEmptyBeneficiary()
            break
        default: 
            newEntry = createEmptyPerson()
        }
        
        setFormData(prev => ({
            ...prev,
            application: {
                ...prev.application,
                [arrayName]: [...prev.application[arrayName], newEntry]
            }
        }))
    }

    const addRefereeToArray = (newReferee) => {
        console.log('newReferee:', newReferee)
        const referee = {member: newReferee}
        setFormData(prev => ({
            ...prev,
            application: {
                ...prev.application,
                referees: [...prev.application.referees, referee]
            }
        }))
    }

    const addRelativeToArray = (newRelative) => {
        console.log('newRelative:', newRelative)
        const relative = {person: newRelative.application.person, relationship: ''}
        setFormData(prev => ({
            ...prev,
            application: {
                ...prev.application,
                relatives: [...prev.application.relatives, relative]
            }
        }))
    }

    const updatePersonInArray = (arrayName, index, field, value, subField = null) => {
        setFormData(prev => ({
            ...prev,
            application: {
                ...prev.application,
                [arrayName]: prev.application[arrayName].map((entry, i) => {
                    if (i === index) {
                        switch (arrayName) {
                            case 'parents':
                            case 'children':
                                if (subField) {
                                    return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                                }
                                return { ...entry, person: { ...entry.person, [field]: value } };
                            
                            case 'referees':
                                if (subField) {
                                    return { 
                                        ...entry, member: {
                                            ...entry.member, application: {
                                                ...entry.member.application, person: {
                                                    ...entry.member.application.person, [field]: {
                                                        ...entry.member.application.person[field], [subField]: value
                                                    }
                                                }
                                            }
                                        }
                                    };
                                }
                                return { 
                                    ...entry, member: { 
                                        ...entry.member, application: { 
                                            ...entry.member.application, person: { 
                                                ...entry.member.application.person, [field]: value 
                                            } 
                                        } 
                                    } 
                                }
                                
                            case 'siblings':
                                if (field === 'siblingType') {
                                    return { ...entry, siblingType: value }
                                }
                                if (subField) {
                                    return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                                }
                                return { ...entry, person: { ...entry.person, [field]: value } }
                            
                            case 'spouses':
                                if (field === 'maritalStatus') {
                                    return { ...entry, maritalStatus: value }
                                }
                                if (subField) {
                                    return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                                }
                                return { ...entry, person: { ...entry.person, [field]: value } }
                            
                            case 'relatives':
                                if (field === 'relationship') {
                                    return { ...entry, relationship: value }
                                }
                                if (subField) {
                                    return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                                }
                                return { ...entry, person: { ...entry.person, [field]: value } }
                            
                            case 'beneficiaries':
                                if (field === 'percentage') {
                                    return { ...entry, percentage: value }
                                }
                                if (subField) {
                                    return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                                }
                                return { ...entry, person: { ...entry.person, [field]: value } }
                            
                            default:
                                return entry
                        }
                    }
                    return entry
                })
            }
        }))
    }

    const updateContactForPerson = (arrayName, personIndex, contactType, contactIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            application: {
                ...prev.application,
                [arrayName]: prev.application[arrayName].map((entry, i) => {
                    if (i === personIndex) {
                        let personObj;
                        switch (arrayName) {
                            case 'parents':
                            case 'children':
                            case 'siblings':
                            case 'spouses':
                            case 'relatives':
                            case 'beneficiaries':
                                personObj = entry.person;
                                return {
                                    ...entry,
                                    person: {
                                        ...personObj,
                                        contact: {
                                            ...personObj.contact,
                                            [contactType]: personObj.contact[contactType].map((contact, j) =>
                                                j === contactIndex ? { ...contact, [field]: value } : contact
                                            )
                                        }
                                    }
                                }
                            
                            case 'referees':
                                personObj = entry.member.application.person
                                return {
                                    ...entry,
                                    member: {
                                        ...entry.member,
                                        application: {
                                            ...entry.member.application,
                                            person: {
                                                ...personObj,
                                                contact: {
                                                    ...personObj.contact,
                                                    [contactType]: personObj.contact[contactType].map((contact, j) =>
                                                        j === contactIndex ? { ...contact, [field]: value } : contact
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }
                            
                            default:
                                return entry
                        }
                    }
                    return entry
                })
            }
        }))
    }

    const addContactForPerson = (arrayName, personIndex, contactType) => {
        const newContact = contactType === 'addresses' 
        ? { type: "", street: "", city: "", state: "", zipcode: "", country: "" }
        : contactType === 'emails'
        ? { type: "", address: "" }
        : { type: "", countryCode: "", number: "" };

        setFormData(prev => ({
            ...prev,
            application: {
                ...prev.application,

                [arrayName]: prev.application[arrayName].map((entry, i) => {
                    if (i === personIndex) {
                        let personObj;
                        switch (arrayName) {
                            case 'parents':
                            case 'children':
                            case 'siblings':
                            case 'spouses':
                            case 'relatives':
                            case 'beneficiaries':
                                personObj = entry.person
                                return {
                                    ...entry,
                                    person: {
                                        ...personObj,
                                        contact: {
                                            ...personObj.contact,
                                            [contactType]: [...personObj.contact[contactType], newContact]
                                        }
                                    }
                                }
                            
                            case 'referees':
                                personObj = entry.member.application.person
                                return {
                                    ...entry,
                                    member: {
                                        ...entry.member,
                                        application: {
                                            ...entry.member.application,
                                            person: {
                                                ...personObj,
                                                contact: {
                                                    ...personObj.contact,
                                                    [contactType]: [...personObj.contact[contactType], newContact]
                                                }
                                            }
                                        }
                                    }
                                }
                            
                            default:
                                return entry
                        }
                    }
                    return entry
                })
            }
        }))
    }

    const removeContactForPerson = (arrayName, personIndex, contactType, contactIndex) => {
        setFormData(prev => ({
            ...prev,
            application: {
                ...prev.application,

                [arrayName]: prev.application[arrayName].map((entry, i) => {
                    if (i === personIndex) {
                        let personObj
                        switch (arrayName) {
                            case 'parents':
                            case 'children':
                            case 'siblings':
                            case 'spouses':
                            case 'relatives':
                            case 'beneficiaries':
                                personObj = entry.person
                                return {
                                    ...entry,
                                    person: {
                                        ...personObj,
                                        contact: {
                                            ...personObj.contact,
                                            [contactType]: personObj.contact[contactType].filter((_, j) => j !== contactIndex)
                                        }
                                    }
                                }
                            
                            case 'referees':
                                personObj = entry.member.application.person
                                return {
                                    ...entry,
                                    member: {
                                        ...entry.member,
                                        application: {
                                            ...entry.member.application,
                                            person: {
                                                ...personObj,
                                                contact: {
                                                    ...personObj.contact,
                                                    [contactType]: personObj.contact[contactType].filter((_, j) => j !== contactIndex)
                                                }
                                            }
                                        }
                                    }
                                }
                            
                            default:
                                return entry
                        }
                    }
                    return entry
                })
            }
        }))
    }

    const removePersonFromArray = (arrayName, index) => {
        setFormData(prev => ({
            ...prev,
            application: {
                ...prev.application,
                [arrayName]: prev.application[arrayName].filter((_, i) => i !== index)
            }
        }))
    }

    const addContact = (type) => {
        const newContact = type === 'addresses' 
        ? { type: "", street: "", city: "", state: "", zipcode: "", country: "" }
        : type === 'emails'
        ? { type: "", address: "" }
        : { type: "", countryCode: "", number: "" }

        setFormData(prev => ({
            ...prev,
            application: {
                ...prev.application,
                person: {
                    ...prev.application.person,
                    contact: {
                        ...prev.application.person.contact,
                        [type]: [ ...prev.application.person.contact[type], newContact]
                    }
                }
            }
        }))
    }

    const removeContact = (type, index) => {
        setFormData(prev => ({
            ...prev,
            application: {
                ...prev.application,
                person: {
                    ...prev.application.person,
                    contact: {
                        ...prev.application.person.contact,
                        [type]: prev.application.person.contact[type].filter((_, i) => i !== index)
                    }
                }
            }
        }))
    }

    const updateContact = (type, index, field, value) => {
        setFormData(prev => ({
            ...prev,
            application: {
                ...prev.application,
                person: {
                    ...prev.application.person,
                    contact: {
                        ...prev.application.person.contact,
                        [type]: prev.application.person.contact[type].map((contact, i) =>
                            i === index ? { ...contact, [field]: value } : contact
                        )
                    }
                }
            }
        }))
    }

    const updateMainPerson = (field, value) => {
        setFormData(prev => ({
            ...prev,
            application: {
                ...prev.application,
                person: {
                    ...prev.application.person,
                    [field]: value
                }
            }
        }))
    }

    const updateApplicationData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            application: {
                ...prev.application,
                [field]: value
            }
        }))
    }

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const nextStep = () => {
        if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
        setCurrentStep(currentStep - 1)
        }
    };

    const cancel = async () => {
        const confirmation = await showConfirmation('Are you sure you want to cancel updating "Membership Application"?')
        if(confirmation) {
            //setFormData(DEFAULT_APPLICATION)
            console.log('Membership Application update Cancelled! The form is reset.')
            toast.info('"Membership Application" update -> Cancelled!', {
                description: 'The form has been reset.',
            })
            navigate('/login')
        } else {
            console.log('Cancel Aborted! Continue working on the Membership Application.')
            toast.info('Cancel -> Aborted!', {
                description: 'Continue working on the "Membership Application".',
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

    useEffect(() => {
        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
            }, 3000) 

            return () => clearTimeout(timerId)
        }
    }, [message])

    const renderPersonForm = (entry, arrayName, index, title) => {
        let person, extraFields = {};
        
        switch (arrayName) {
        case 'parents':
        case 'children':
            person = entry.person;
            break;
        case 'referees':
            person = entry.member.application.person;
            break;
        case 'siblings':
            person = entry.person;
            extraFields.siblingType = entry.siblingType;
            break;
        case 'spouses':
            person = entry.person;
            extraFields.maritalStatus = entry.maritalStatus;
            break;
        case 'relatives':
            person = entry.person;
            extraFields.relationship = entry.relationship;
            break;
        case 'beneficiaries':
            person = entry.person;
            extraFields.percentage = entry.percentage;
            break;
        default:
            person = entry;
        }

        return (
            <>
                <div key={index} className="card mb-2 shadow">
                    <div className="card-header d-flex justify-content-between items-center mb-3 bg-light">
                        <h3 className="font-medium"><strong>{title} {index + 1}</strong></h3>
                        <button
                            type="button"
                            onClick={() => removePersonFromArray(arrayName, index)}
                            className="bg-light text-danger p-2"
                            title={`Remove ${title} ${index + 1}`}
                        >
                            <Trash size={24} />
                        </button>
                    </div>
                    <div className="card-body px-1 px-sm-3">
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`${arrayName}-${index}-firstName`}
                                        type={"text"}
                                        className="form-control"
                                        placeholder="First Name"
                                        value={person.firstName}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'firstName', e.target.value)}
                                    />
                                    <label htmlFor={`${arrayName}-${index}-firstName`}>First Name*</label>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`${arrayName}-${index}-middleName`}
                                        type={"text"}
                                        className="form-control"
                                        placeholder="Middle Name"
                                        value={person.middleName}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'middleName', e.target.value)}
                                    />
                                    <label htmlFor={`${arrayName}-${index}-middleName`}>Middle Name</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`${arrayName}-${index}-lastName`}
                                        type={"text"}
                                        className="form-control"
                                        placeholder="Last Name"
                                        value={person.lastName}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'lastName', e.target.value)}
                                    />
                                    <label htmlFor={`${arrayName}-${index}-lastName`}>Last Name*</label>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`${arrayName}-${index}-dob`}
                                        type={"date"}
                                        className="form-control"
                                        value={person.dob}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'dob', e.target.value)}
                                    />
                                    <label htmlFor={`${arrayName}-${index}-dob`}>Date Of Birth</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <select 
                                        id={`${arrayName}-${index}-lifeStatus`}
                                        className="form-select" 
                                        value={person.lifeStatus}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'lifeStatus', e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        <option value="Living">Living</option>
                                        <option value="Deceased">Deceased</option>
                                    </select>
                                    <label htmlFor={`${arrayName}-${index}-lifeStatus`}>Life Status</label>
                                </div>
                            </div>

                            {arrayName === 'spouses' && (
                                <div className="col-sm-6 mb-3">
                                    <div className="form-floating">
                                        <select
                                            id={`${arrayName}-${index}-maritalStatus`}
                                            value={extraFields.maritalStatus}
                                            onChange={(e) => updatePersonInArray(arrayName, index, 'maritalStatus', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Select...</option>
                                            <option value="Single (Never Married)">Single (Never Married)</option>
                                            <option value="Married">Married</option>
                                            <option value="Living Common-Law">Living Common-Law</option>
                                            <option value="Separated">Separated</option>
                                            <option value="Divorced">Divorced</option>
                                            <option value="Widowed">Widowed</option>
                                        </select>
                                        <label htmlFor={`${arrayName}-${index}-maritalStatus`}>Marital Status</label>
                                    </div>
                                </div>
                            )}

                            {arrayName === 'siblings' && (
                                <div className="col-sm-6 mb-3">
                                    <div className="form-floating">
                                        <select
                                            id={`${arrayName}-${index}-siblingType`}
                                            value={extraFields.siblingType}
                                            onChange={(e) => updatePersonInArray(arrayName, index, 'siblingType', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Select...</option>
                                            <option value="Brother">Brother</option>
                                            <option value="Sister">Sister</option>
                                        </select>
                                        <label htmlFor={`${arrayName}-${index}-siblingType`}>Sibling Type</label>
                                    </div>
                                </div>
                            )}

                            {arrayName === 'relatives' && (
                                <div className="col-sm-6 mb-3">
                                    <div className="form-floating">
                                        <select
                                            id={`relationship-${index}`}
                                            value={extraFields.relationship}
                                            onChange={(e) => updatePersonInArray(arrayName, index, 'relationship', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Select...</option>
                                            <option value="Spouse">Spouse</option>
                                            <option value="Father">Father</option>
                                            <option value="Mother">Mother</option>
                                            <option value="Son">Son</option>
                                            <option value="Daughter">Daughter</option>
                                            <option value="Brother">Brother</option>
                                            <option value="Sister">Sister</option>
                                            <option value="Grandfather">Grandfather</option>
                                            <option value="Grandmother">Grandmother</option>
                                            <option value="Grandson">Grandon</option>
                                            <option value="Granddaughter">Granddaughter</option>
                                            <option value="Uncle">Uncle</option>
                                            <option value="Aunt">Aunt</option>
                                            <option value="Nephew">Nephew</option>
                                            <option value="Niece">Niece</option>
                                            <option value="Cousin">Cousin</option>
                                            <option value="Great-Grandfather">Great-Grandfather</option>
                                            <option value="Great-Grandmother">Great-Grandmother</option>
                                            <option value="Great-Uncle">Great-Uncle</option>
                                            <option value="Great-Aunt">Great-Aunt</option>
                                            <option value="Step relative">Step relative</option>
                                            <option value="Other relative">Other relative</option>
                                        </select>
                                        <label htmlFor={`relationship-${index}`}>Family Relationship</label>
                                    </div>
                                </div>
                            )}

                            {arrayName === 'beneficiaries' && (
                                <div className="col-sm-6 mb-3">
                                    <div className="form-floating">
                                        <input
                                            id={`percentage-${index}`}
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            value={extraFields.percentage}
                                            onChange={(e) => updatePersonInArray(arrayName, index, 'percentage', parseFloat(e.target.value) || 0.0)}
                                            className="form-control"
                                        />
                                        <label htmlFor={`percentage-${index}`}>Percentage</label>
                                    </div>
                                </div>
                            )}
                        </div>
                    
                        {/* Contact Details Card */}
                        <div key={index} className='card mb-3'>
                            <div className="card-header">
                                <div className="d-flex">
                                    <EnvelopeFill size={24} className='me-2' />
                                    <h5 className='text-bold'>{title} {index + 1} - Contacts</h5>
                                </div>
                            </div>
                            <div className="card-body px-1 px-sm-3">
                                {/* Addresses */} 
                                <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg">
                                    <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                                        <div className="d-flex items-center">
                                            <GeoAlt size={20} className='mt-1 mx-1' />
                                            <h5 className="font-semibold"><strong>{title} {index + 1} - Addresses</strong></h5>
                                        </div>
                                        <button 
                                            type="button" 
                                            className="d-flex btn text-center align-items-center" 
                                            onClick={() => addContactForPerson(arrayName, index, 'addresses')}
                                            style={{ backgroundColor: 'black' }}
                                            title={`Add Address for ${title} ${index + 1}`}
                                        >
                                            <Plus className="mb-1" color="white" size={21} />
                                            <span className='d-none d-sm-flex text-white'>Address</span>
                                        </button>
                                    </div>
                                
                                    {person.contact.addresses.map((address, addrIndex) => (
                                        <div key={addrIndex} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                            <div className="d-flex justify-content-between items-center mb-3">
                                                <span className="font-medium"><strong>Address {addrIndex + 1}</strong></span>
                                                {person.contact.addresses.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeContactForPerson(arrayName, index, 'addresses', addrIndex)}
                                                    className="bg-light text-danger p-2"
                                                    title={`Remove Address ${addrIndex + 1} for ${title} ${index + 1}`}
                                                >
                                                    <Trash size={24} />
                                                </button>
                                                )}
                                            </div>

                                            <div className="form-group row">
                                                <div className="col-sm-5 mb-3">
                                                    <div className="form-floating">
                                                        <select
                                                            id={`${arrayName}-${index}-address-type`}
                                                            value={address.type}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'type', e.target.value)}
                                                            className="form-select"
                                                        >
                                                            <option value="">Select...</option>
                                                            <option value="Home">Home</option>
                                                            <option value="Work">Work</option>
                                                            <option value="School">School</option>
                                                            <option value="Mailing">Mailing</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                        <label htmlFor={`${arrayName}-${index}-address-type`}>Type</label>
                                                    </div>
                                                </div>
                                                <div className="col-sm-7 mb-3">
                                                    <div className="form-floating">
                                                        <input
                                                            id={`${arrayName}-${index}-street`}
                                                            type={"text"}
                                                            placeholder="Street Address"
                                                            value={address.street}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'street', e.target.value)}
                                                            className="form-control"
                                                        />
                                                        <label htmlFor={`${arrayName}-${index}-street`}>Street Address</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-5 mb-3">
                                                    <div className="form-floating">
                                                        <input
                                                            id={`${arrayName}-${index}-city`}
                                                            type={"text"}
                                                            placeholder="City"
                                                            value={address.city}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'city', e.target.value)}
                                                            className="form-control"
                                                        />
                                                        <label htmlFor={`${arrayName}-${index}-city`}>City</label>
                                                    </div>
                                                </div>
                                                <div className="col-sm-7 mb-3">
                                                    <div className="form-floating">
                                                        <input
                                                            id={`${arrayName}-${index}-state`}
                                                            type={"text"}
                                                            placeholder="State"
                                                            value={address.state}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'state', e.target.value)}
                                                            className="form-control"
                                                        />
                                                        <label htmlFor={`${arrayName}-${index}-state`}>State</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-5 mb-3">
                                                    <div className="form-floating">
                                                        <input
                                                            id={`${arrayName}-${index}-zipcode`}
                                                            type={"text"}
                                                            placeholder="ZIP Code"
                                                            value={address.zipcode}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'zipcode', e.target.value)}
                                                            className="form-control"
                                                        />
                                                        <label htmlFor={`${arrayName}-${index}-zipcode`}>Zip Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-sm-7 mb-3">
                                                    <div className="form-floating">
                                                        <select 
                                                            id={`${arrayName}-${index}-country`}
                                                            name={`${arrayName}-${index}-country`}
                                                            className="form-select"
                                                            value={address.country}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'country', e.target.value)}
                                                        >
                                                            <option key={'nil'} value="">Select...</option>
                                                            {countriesData.map((country) => (
                                                                <option key={country.cca2} value={country.name}>
                                                                    {country.flag} {country.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <label htmlFor={`${arrayName}-${index}-country`}>Country</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Emails */} 
                                <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg">
                                    <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                                        <div className="d-flex items-center">
                                            <EnvelopeAt size={20} className='mt-1 mx-1' />
                                            <h5 className="text-lg font-semibold"><strong>{title} {index + 1} - Emails</strong></h5>
                                        </div>
                                        <button 
                                            type="button" 
                                            className="d-flex btn text-center align-items-center" 
                                            onClick={() => addContactForPerson(arrayName, index, 'emails')}
                                            style={{ backgroundColor: 'black' }}
                                            title={`Add Email for ${title} ${index + 1}`}
                                        >
                                            <Plus className="mb-1" color="white" size={21} />
                                            <span className='d-none d-sm-flex text-white'>Email</span>
                                        </button>
                                    </div>
                        
                                    {person.contact.emails.map((email, emailIndex) => (
                                        <div key={emailIndex} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                            <div className='mb-2'>
                                                <span className="font-medium"><strong>Email {emailIndex + 1}</strong></span>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-5 mb-3">
                                                    <div className="form-floating">
                                                        <select
                                                            id={`${arrayName}-${index}-email-type`}
                                                            value={email.type}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'emails', emailIndex, 'type', e.target.value)}
                                                            className="form-select"
                                                        >
                                                            <option value="">Select...</option>
                                                            <option value="Personal">Personal</option>
                                                            <option value="Work">Work</option>
                                                            <option value="School">School</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                        <label htmlFor={`${arrayName}-${index}-email-type`}>Type</label>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 mb-3">
                                                    <div className="form-floating">
                                                        <input
                                                            id={`${arrayName}-${index}-email-address`}
                                                            type={"email"}
                                                            placeholder="Email Address"
                                                            value={email.address}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'emails', emailIndex, 'address', e.target.value)}
                                                            className="form-control"
                                                        />
                                                        <label htmlFor={`${arrayName}-${index}-email-address`}>Email Address</label>
                                                    </div>
                                                </div>
                                                {person.contact.emails.length > 1 && (
                                                    <div className="col-sm-1 mb-3 mt-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeContactForPerson(arrayName, index, 'emails', emailIndex)}
                                                            className="bg-light text-danger"
                                                            title={`Remove Email ${emailIndex + 1} for ${title} ${index + 1}`}
                                                        >
                                                            <Trash size={24} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Phones */} 
                                <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg">
                                    <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                                        <div className="d-flex items-center">
                                            <Telephone size={20} className='mt-1 mx-1' />
                                            <h5 className="text-lg font-semibold"><strong>{title} {index + 1} - Phones</strong></h5>
                                        </div>
                                        <button 
                                            type="button" 
                                            className="d-flex btn text-center align-items-center" 
                                            onClick={() => addContactForPerson(arrayName, index, 'phones')}
                                            style={{ backgroundColor: 'black' }}
                                            title={`Add Phone for ${title} ${index + 1}`}
                                        >
                                            <Plus className="mb-1" color="white" size={21} />
                                            <span className='d-none d-sm-flex text-white'>Phone No.</span>
                                        </button>
                                    </div>
                                    
                                    {person.contact.phones.map((phone, phoneIndex) => (
                                        <div key={phoneIndex} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                            <div className='mb-2'>
                                                <span className="font-medium"><strong>Phone {phoneIndex + 1}</strong></span>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-6 mb-3">
                                                    <div className="form-floating">
                                                        <select
                                                            id={`${arrayName}-${index}-phone-type`}
                                                            value={phone.type}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'phones', phoneIndex, 'type', e.target.value)}
                                                            className="form-select"
                                                        >
                                                            <option value="">Select...</option>
                                                            <option value="Mobile">Mobile</option>
                                                            <option value="Home">Home</option>
                                                            <option value="Work">Work</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                        <label htmlFor={`${arrayName}-${index}-phone-type`}>Type</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-5 mb-3">
                                                    <div className="form-floating">
                                                        <select 
                                                            id={`${arrayName}-${index}-phone-country-code`}
                                                            className="form-select"
                                                            name={`country-code-${index}`}
                                                            value={phone.countryCode}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'phones', phoneIndex, 'countryCode', e.target.value)}
                                                        >
                                                            <option value="">Select...</option>
                                                            {countriesData.map((country) => (
                                                                <option key={country.cca2} value={`${country.flag} +${country.code}`}>
                                                                    {country.flag} +{country.code}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <label htmlFor={`${arrayName}-${index}-phone-country-code`}>Country Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 mb-3">
                                                    <div className="form-floating">
                                                        <input
                                                            id={`${arrayName}-${index}-phone-number`}
                                                            type={"tel"}
                                                            placeholder="Phone Number"
                                                            value={phone.number}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'phones', phoneIndex, 'number', e.target.value)}
                                                            className="form-control"
                                                        />
                                                        <label htmlFor={`${arrayName}-${index}-phone-number`}>Phone Number</label>
                                                    </div>
                                                </div>
                                                {person.contact.phones.length > 1 && (
                                                    <div className="col-sm-1 mb-3 mt-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeContactForPerson(arrayName, index, 'phones', phoneIndex)}
                                                            className="bg-light text-danger"
                                                            title={`Remove Phone ${phoneIndex + 1} for ${title} ${index + 1}`}
                                                        >
                                                            <Trash size={24} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    // Personal Information
    const renderPersonalInfo = () => {
        return (
            <>
                <div className='card mb-4'>
                    <div className="card-header bg-light">
                        <div className="d-flex">
                            <PersonFill size={30} className='text-primary me-2' />
                            <h3 className="text-primary">Personal Information</h3>
                        </div>
                    </div>
                    <div className="card-body px-1 px-sm-3">
                        <div className="form-group row">
                            <div className="d-flex justify-content-end">
                                <button 
                                    onClick={() => setShowUsersModal(true)}
                                    className="d-flex btn btn-danger text-center me-2"
                                    title={`Select User to Add`}
                                >
                                    <Plus className="mb-1 text-white" size={21} />
                                    <span className='d-none d-sm-flex text-white'>Select User</span>
                                </button>
                            </div>
                        </div>
                        {/* User Details */}
                        <h5 className="text-danger mb-3"><strong>User Details</strong></h5>
                        <div className="form-group row row-cols-auto">
                            <div className="col-6 col-xxl-3">
                                <div className="form-floating mb-3">
                                    <input 
                                        id="userId"
                                        type="text" 
                                        className="form-control"
                                        value={formData.userId}
                                        onChange={(e) => updateFormData('userId', e.target.value)}
                                        disabled
                                        readOnly
                                    />
                                    <label htmlFor="userId">User Id</label>
                                </div>
                            </div>
                            {/** If selectedUser has a value then show the user role and email. */}
                            { (selectedUser.id !== 0) && (
                                <>
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
                                    <div className="col-6 col-xxl-6">
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
                                </>
                            )}
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-4 mb-3">
                                <div className="form-floating">
                                    <input
                                        id="firstName"
                                        type={"text"}
                                        className="form-control"
                                        placeholder="First Name"
                                        name="firstName"
                                        value={formData.application.person.firstName}
                                        onChange={(e) => updateMainPerson('firstName', e.target.value)}
                                    />
                                    <label htmlFor={"firstName"}>First Name*</label>
                                </div>
                            </div>
                            <div className="col-sm-4 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={"middleName"}
                                        type={"text"}
                                        className="form-control"
                                        placeholder="Middle name"
                                        name="middleName"
                                        value={formData.application.person.middleName}
                                        onChange={(e) => updateMainPerson('middleName', e.target.value)}
                                    />
                                    <label htmlFor={"middleName"}>Middle Name</label>
                                </div>
                            </div>
                            <div className="col-sm-4 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={"lastName"}
                                        type={"text"}
                                        className="form-control"
                                        placeholder="Last name"
                                        name="lastName"
                                        value={formData.application.person.lastName}
                                        onChange={(e) => updateMainPerson('lastName', e.target.value)}
                                    />
                                    <label htmlFor={"lastName"}>Last Name*</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={"dob"}
                                        type={"date"}
                                        className="form-control"
                                        name="dob"
                                        value={formData.application.person.dob}
                                        onChange={(e) => updateMainPerson('dob', e.target.value)}
                                    />
                                    <label htmlFor={"dob"}>Date Of Birth</label>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <select 
                                        className="form-select" 
                                        name="lifeStatus" 
                                        id="lifeStatus"
                                        value={formData.application.person.lifeStatus}
                                        onChange={(e) => updateMainPerson('lifeStatus', e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        <option value="Living">Living</option>
                                        <option value="Deceased">Deceased</option>
                                    </select>
                                    <label htmlFor={"lifeStatus"}>Life Status</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <select 
                                        className="form-select" 
                                        name="maritalStatus" 
                                        id="maritalStatus"
                                        value={formData.application.maritalStatus}
                                        onChange={(e) => updateApplicationData('maritalStatus', e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        <option value="Single (Never Married)">Single (Never Married)</option>
                                        <option value="Married">Married</option>
                                        <option value="Living Common-Law">Living Common-Law</option>
                                        <option value="Separated">Separated</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                    <label htmlFor={"maritalStatus"}>Marital Status</label>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <select
                                        className="form-select" 
                                        name="applicationStatus" 
                                        id="applicationStatus"
                                        value={formData.application.applicationStatus}
                                        onChange={(e) => updateApplicationData('applicationStatus', e.target.value)}
                                        
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
                    </div>
                </div>

                <div className='card'>
                    <div className="card-header bg-light">
                        <div className="d-flex">
                            <EnvelopeFill size={28} className='me-2 text-primary' />
                            <h4 className='text-bold text-primary'>Contact Details</h4>
                        </div>
                    </div>
                    <div className="card-body px-1 px-sm-3">
                        {/* Addresses */}
                        <div className="container p-6 mb-4 rounded-lg border">
                            <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                                <div className="d-flex items-center">
                                    <GeoAlt size={22} className='mt-1 mx-1' />
                                    <h4 className="text-lg font-semibold"><strong>Addresses</strong></h4>
                                </div>
                                <button 
                                    type="button" 
                                    className="d-flex btn text-center" 
                                    onClick={() => addContact('addresses')}
                                    style={{ backgroundColor: 'black' }}
                                    title={`Add Address`}
                                >
                                    <Plus className="mb-1" color="white" size={21} />
                                    <span className='d-none d-sm-flex text-white'>Address</span>
                                </button>
                            </div>
                        
                            {formData.application.person.contact.addresses.map((address, index) => (
                                <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                    <div className="d-flex justify-content-between items-center mb-3">
                                        <span className="font-medium"><strong>Address {index + 1}</strong></span>
                                        {formData.application.person.contact.addresses.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeContact('addresses', index)}
                                            className="bg-light text-danger p-2"
                                            title={`Remove Address ${index + 1}`}
                                        >
                                            <Trash size={24} />
                                        </button>
                                        )}
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-sm-5 mb-3">
                                            <div className="form-floating">
                                                <select
                                                    id={`address-type-${index}`}
                                                    value={address.type}
                                                    onChange={(e) => updateContact('addresses', index, 'type', e.target.value)}
                                                    className="form-select"
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="Home">Home</option>
                                                    <option value="Work">Work</option>
                                                    <option value="School">School</option>
                                                    <option value="Mailing">Mailing</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <label htmlFor={`address-type-${index}`}>Type</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-7 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    id={`address-street-${index}`}
                                                    type={"text"}
                                                    placeholder="Street Address"
                                                    value={address.street}
                                                    onChange={(e) => updateContact('addresses', index, 'street', e.target.value)}
                                                    className="form-control"
                                                />
                                                <label htmlFor={`address-street-${index}`}>Street Address</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-5 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    id={`address-city-${index}`}
                                                    type={"text"}
                                                    placeholder="City"
                                                    value={address.city}
                                                    onChange={(e) => updateContact('addresses', index, 'city', e.target.value)}
                                                    className="form-control"
                                                />
                                                <label htmlFor={`address-city-${index}`}>City</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-7 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    id={`address-state-${index}`}
                                                    type={"text"}
                                                    placeholder="State"
                                                    value={address.state}
                                                    onChange={(e) => updateContact('addresses', index, 'state', e.target.value)}
                                                    className="form-control"
                                                />
                                                <label htmlFor={`address-state-${index}`}>State</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-5 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    id={`address-zipcode-${index}`}
                                                    type={"text"}
                                                    placeholder="ZIP Code"
                                                    value={address.zipcode}
                                                    onChange={(e) => updateContact('addresses', index, 'zipcode', e.target.value)}
                                                    className="form-control"
                                                />
                                                <label htmlFor={`address-zipcode-${index}`}>Zip Code</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-7 mb-3">
                                            <div className="form-floating">
                                                <select 
                                                    id={`country-${index}`}
                                                    name={`country-${index}`}
                                                    className="form-select"
                                                    value={address.country}
                                                    onChange={(e) => updateContact('addresses', index, 'country', e.target.value)}
                                                >
                                                    <option key={'nil'} value="">Select...</option>
                                                    {countriesData.map((country) => (
                                                        <option key={country.cca2} value={country.name}>
                                                            {country.flag} {country.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <label htmlFor={`country-${index}`}>Country</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Emails */}
                        <div className="container p-6 mb-4 rounded-lg border">
                            <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                                <div className="d-flex items-center">
                                    <EnvelopeAt size={22} className='mt-1 mx-1' />
                                    <h4 className="text-lg font-semibold"><strong>Emails</strong></h4>
                                </div>
                                <button 
                                    type="button" 
                                    className="d-flex btn text-center" 
                                    onClick={() => addContact('emails')}
                                    style={{ backgroundColor: 'black' }}
                                    title={`Add Email`}
                                >
                                    <Plus className="mb-1" color="white" size={21} />
                                    <span className='d-none d-sm-flex text-white'>Email</span>
                                </button>
                            </div>
                
                            {formData.application.person.contact.emails.map((email, index) => (
                                <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                    <div className='mb-2'>
                                        <span className="font-medium"><strong>Email {index + 1}</strong></span>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-5 mb-3">
                                            <div className="form-floating">
                                                <select
                                                    id={`email-type-${index}`}
                                                    value={email.type}
                                                    onChange={(e) => updateContact('emails', index, 'type', e.target.value)}
                                                    className="form-select"
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="Personal">Personal</option>
                                                    <option value="Work">Work</option>
                                                    <option value="School">School</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <label htmlFor={`email-type-${index}`}>Type</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    id={`email-address-${index}`}
                                                    type={"email"}
                                                    placeholder="Email Address"
                                                    value={email.address}
                                                    onChange={(e) => updateContact('emails', index, 'address', e.target.value)}
                                                    className="form-control"
                                                />
                                                <label htmlFor={`email-address-${index}`}>Email Address</label>
                                            </div>
                                        </div>
                                        {formData.application.person.contact.emails.length > 1 && (
                                            <div className="col-sm-1 mb-3 mt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => removeContact('emails', index)}
                                                    className="bg-light text-danger"
                                                    title={`Remove Email ${index + 1}`}
                                                >
                                                    <Trash size={24} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Phones */}
                        <div className="container p-6 mb-4 rounded-lg border">
                            <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                                <div className="d-flex items-center">
                                    <Telephone size={22} className='mt-1 mx-1' />
                                    <h4 className="text-lg font-semibold"><strong>Phones</strong></h4>
                                </div>
                                <button 
                                    type="button" 
                                    className="d-flex btn text-center" 
                                    onClick={() => addContact('phones')}
                                    style={{ backgroundColor: 'black' }}
                                    title={`Add Phone`}
                                >
                                    <Plus className="mb-1" color="white" size={21} />
                                    <span className='d-none d-sm-flex text-white'>Phone No.</span>
                                </button>
                            </div>
                            
                            {formData.application.person.contact.phones.map((phone, index) => (
                                <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                    <div className='mb-2'>
                                        <span className="font-medium"><strong>Phone {index + 1}</strong></span>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3">
                                            <div className="form-floating">
                                                <select
                                                    id={`phone-type-${index}`}
                                                    value={phone.type}
                                                    onChange={(e) => updateContact('phones', index, 'type', e.target.value)}
                                                    className="form-select"
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="Mobile">Mobile</option>
                                                    <option value="Home">Home</option>
                                                    <option value="Work">Work</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <label htmlFor={`phone-type-${index}`}>Type</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-5 mb-3">
                                            <div className="form-floating">
                                                <select 
                                                    id={`phone-country-code-${index}`}
                                                    className="form-select"
                                                    name={`phone-country-code-${index}`}
                                                    value={phone.countryCode}
                                                    onChange={(e) => updateContact('phones', index, 'countryCode', e.target.value)}
                                                >
                                                    <option value="">Select...</option>
                                                    {countriesData.map((country) => (
                                                        <option key={country.cca2} value={`${country.flag} +${country.code}`}>
                                                            {country.flag} +{country.code}
                                                        </option>
                                                    ))}
                                                </select>
                                                <label htmlFor={`phone-country-code-${index}`}>Country Code</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    id={`phone-number-${index}`}
                                                    type={"tel"}
                                                    placeholder="Phone Number"
                                                    value={phone.number}
                                                    onChange={(e) => updateContact('phones', index, 'number', e.target.value)}
                                                    className="form-control"
                                                />
                                                <label htmlFor={`phone-number-${index}`}>Phone Number</label>
                                            </div>
                                        </div>
                                        {formData.application.person.contact.phones.length > 1 && (
                                            <div className="col-sm-1 mb-3 mt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => removeContact('phones', index)}
                                                    className="bg-light text-danger"
                                                    title={`Remove Phone ${index + 1}`}
                                                >
                                                    <Trash size={24} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    // Family Info
    const renderFamilyInfo = () => {
        return (
            <div className='card'>
                <div className="card-header text-white" style={{ backgroundColor: 'crimson'}}>
                    <div className="d-flex">
                        <Heart size={28} className='me-2 text-white' />
                        <h3 className='text-bold text-white'>Family Information</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">

                    {/* Spouses Section */}
                    <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg border shadow">
                        <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                            <div className="d-flex items-center">
                                <PersonHeart size={32} className='mt-1 mx-1' style={{ color: 'crimson' }} />
                                <h3 
                                    className="text-lg font-semibold"
                                    style={{ color: 'crimson' }}
                                >
                                    <strong>Spouses</strong>
                                </h3>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => addPersonToArray('spouses')}
                                className="d-flex btn text-center"
                                style={{ backgroundColor: 'crimson' }}
                            >
                                <Plus className="mb-1 text-white" size={21} />
                                <span className='d-none d-sm-flex text-white'>Add Spouse</span>
                            </button>
                        </div>
                    
                        {formData.application.spouses.length === 0 ? (
                            <p className="text-secondary text-center py-4">No spouses added yet</p>
                        ) : (
                            formData.application.spouses.map((spouse, index) => 
                            renderPersonForm(spouse, 'spouses', index, 'Spouse')
                            )
                        )}
                    </div>

                    {/* Children Section */}
                    <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg border shadow">
                        <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                            <div className="d-flex items-center">
                                <PersonCircle size={32} className='mt-1 mx-1' style={{ color: 'limegreen' }} />
                                <h3 
                                    className="text-lg font-semibold"
                                    style={{ color: 'limegreen' }}
                                >
                                    <strong>Children</strong>
                                </h3>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => addPersonToArray('children')}
                                className="d-flex btn text-center"
                                style={{ backgroundColor: 'limegreen' }}
                            >
                                <Plus className="mb-1 text-white" size={21} />
                                <span className='d-none d-sm-flex text-white'>Add Child</span>
                            </button>
                        </div>
                    
                        {formData.application.children.length === 0 ? (
                            <p className="text-secondary text-center py-4">No children added yet</p>
                        ) : (
                            formData.application.children.map((child, index) => 
                            renderPersonForm(child, 'children', index, 'Child')
                            )
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // Parents Information
    const renderParentsInfo = () => {
        return (
            <div className='card'>
                <div className="card-header text-white" style={{ backgroundColor: 'purple' }}>
                    <div className="d-flex">
                        <People size={28} className='me-2 text-white' />
                        <h3 className='text-bold text-white'>Parents Information</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">

                    {/* Parents Section */}
                    <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg border">
                        <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                            <div className="d-flex items-center">
                                <PeopleFill size={32} className='mt-1 mx-1' style={{ color: 'purple' }} />
                                <h3 
                                    className="text-lg font-semibold"
                                    style={{ color: 'purple' }}
                                >
                                    <strong>Parents</strong>
                                </h3>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => addPersonToArray('parents')}
                                className="d-flex btn text-center"
                                style={{ backgroundColor: 'purple' }}
                            >
                                <Plus className="mb-1 text-white" size={21} />
                                <span className='d-none d-sm-flex text-white'>Add Parent</span>
                            </button>
                        </div>
                    
                        {formData.application.parents.length === 0 ? (
                            <p className="text-secondary text-center py-4">No parents added yet</p>
                        ) : (
                            formData.application.parents.map((parent, index) => 
                            renderPersonForm(parent, 'parents', index, 'Parent')
                            )
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // Siblings Information
    const renderSiblingsInfo = () => {
        return (
            <div className='card'>
                <div className="card-header text-white" style={{ backgroundColor: 'orange' }}>
                    <div className="d-flex">
                        <PersonArmsUp size={28} className='me-2 text-white' />
                        <h3 className='text-bold text-white'>Siblings Information</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">

                    {/* Siblings Section */}
                    <div className="container py-6 px-sm-6 mb-4 rounded-lg border">
                        <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                            <div className="d-flex items-center">
                                <PersonArmsUp size={32} className='mt-1 mx-1' style={{ color: 'orange' }} />
                                <h3 
                                    className="text-lg font-semibold"
                                    style={{ color: 'orange' }}
                                >
                                    <strong>Siblings</strong>
                                </h3>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => addPersonToArray('siblings')}
                                className="d-flex btn text-center"
                                style={{ backgroundColor: 'orange' }}
                            >
                                <Plus className="mb-1 text-white" size={21} />
                                <span className='d-none d-sm-flex text-white'>Add Sibling</span>
                            </button>
                        </div>
                    
                        {formData.application.siblings.length === 0 ? (
                            <p className="text-secondary text-center py-4">No siblings added yet</p>
                        ) : (
                            formData.application.siblings.map((sibling, index) => 
                            renderPersonForm(sibling, 'siblings', index, 'Sibling')
                            )
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // Reference Information
    const renderReferenceInfo = () => {
        return (
            <div className='card'>
                <div className="card-header text-white" style={{ backgroundColor: 'coral' }}>
                    <div className="d-flex">
                        <PersonCheck size={28} className='me-2 text-white' />
                        <h3 className='text-bold text-white'>Reference Information</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">

                    {/* Referees Section */}
                    <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg border">
                        <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                            <div className="d-flex items-center">
                                <PersonCheckFill size={32} className='mt-1 mx-1' style={{ color: 'coral' }} />
                                <h3 
                                    className="text-lg font-semibold"
                                    style={{ color: 'coral' }}
                                >
                                    <strong>Referees</strong>
                                </h3>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button 
                                    onClick={() => setShowRefereesModal(true)}
                                    className="d-flex btn text-center me-2"
                                    style={{ backgroundColor: 'coral' }}
                                    title={`Select Referee to Add`}
                                >
                                    <Plus className="mb-1 text-white" size={21} />
                                    <span className='d-none d-sm-flex text-white'>Select Referee(s)</span>
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => addPersonToArray('referees')}
                                    className="d-flex btn text-center"
                                    style={{ backgroundColor: 'coral' }}
                                >
                                    <Plus className="mb-1 text-white" size={21} />
                                    <span className='d-none d-sm-flex text-white'>Add Referee</span>
                                </button>
                            </div>
                        </div>
                    
                        {formData.application.referees.length === 0 ? (
                            <p className="text-secondary text-center py-4">No referees added yet</p>
                        ) : (
                            formData.application.referees.map((referee, index) => 
                            renderPersonForm(referee, 'referees', index, 'Referee')
                            )
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // Club Relatives
    const renderClubRelatives = () => {
        return (
            <div className='card'>
                <div className="card-header text-white" style={{ backgroundColor: 'teal' }}>
                    <div className="d-flex">
                        <PersonLinesFill size={28} className='me-2 text-white' />
                        <h3 className='text-bold text-white'>Club Relatives</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">

                    {/* Relatives Section */}
                    <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg border">
                        <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                            <div className="d-flex items-center">
                                <PersonLinesFill size={32} className='mt-1 mx-1' style={{ color: 'teal' }} />
                                <h3 
                                    className="text-lg font-semibold"
                                    style={{ color: 'teal' }}
                                >
                                    <strong>Relatives</strong>
                                </h3>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button 
                                    onClick={() => setShowRelativesModal(true)}
                                    className="d-flex btn text-center me-2"
                                    style={{ backgroundColor: 'teal' }}
                                    title={`Select Relative to Add`}
                                >
                                    <Plus className="mb-1 text-white" size={21} />
                                    <span className='d-none d-sm-flex text-white'>Select Relative(s)</span>
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => addPersonToArray('relatives')}
                                    className="d-flex btn text-center"
                                    style={{ backgroundColor: 'teal' }}
                                >
                                    <Plus className="mb-1 text-white" size={21} />
                                    <span className='d-none d-sm-flex text-white'>Add Relative</span>
                                </button>
                            </div>
                        </div>
                    
                        {formData.application.relatives.length === 0 ? (
                            <p className="text-secondary text-center py-4">No relatives added yet</p>
                        ) : (
                            formData.application.relatives.map((relative, index) => 
                            renderPersonForm(relative, 'relatives', index, 'Relative')
                            )
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // Beneficiaries
    const renderBeneficiaries = () => {
        return (
            <div className='card'>
                <div className="card-header text-white" style={{ backgroundColor: 'saddlebrown' }}>
                    <div className="d-flex">
                        <PersonHearts size={28} className='me-2 text-white' />
                        <h3 className='text-bold text-white'>Beneficiaries</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">

                    {/* Beneficiaries Section */}
                    <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg border">
                        <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                            <div className="d-flex items-center">
                                <PersonHearts size={32} className='mt-1 mx-1' style={{ color: 'saddlebrown' }} />
                                <h3 
                                    className="text-lg font-semibold"
                                    style={{ color: 'saddlebrown' }}
                                >
                                    <strong>Beneficiaries</strong>
                                </h3>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => addPersonToArray('beneficiaries')}
                                className="d-flex btn text-center"
                                style={{ backgroundColor: 'saddlebrown'}}
                            >
                                <Plus className="mb-1 text-white" size={21} />
                                <span className='d-none d-sm-flex text-white'>Add Beneficiary</span>
                            </button>
                        </div>
                    
                        {formData.application.beneficiaries.length === 0 ? (
                            <p className="text-secondary text-center py-4">No beneficiaries added yet</p>
                        ) : (
                            formData.application.beneficiaries.map((beneficiary, index) => 
                            renderPersonForm(beneficiary, 'beneficiaries', index, 'Beneficiary')
                            )
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // Review & Submit
    const renderReviewAndSubmit = () => {
        return (
            <div className='card'>
                <div className="card-header bg-success text-white">
                    <div className="d-flex">
                        <Send size={28} className='me-2 text-white' />
                        <h3 className='text-bold text-white'>Review & Submit</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">
                    <div className="bg-gray-50 py-6 px-1 px-sm-6 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 overflow-auto max-h-96">
                            {JSON.stringify(formData, null, 2)}
                        </pre>
                    </div>
                    <div className="align-items-center text-center">
                        { message && <span className="text-success ms-2 h5">...{message}...</span> }
                    </div>
                </div>
            </div>
        )
    }

    const renderStep = () => {
        switch (currentStep) {
            case 0: return renderPersonalInfo()
            case 1: return renderFamilyInfo()
            case 2: return renderParentsInfo()
            case 3: return renderSiblingsInfo()
            case 4: return renderReferenceInfo()
            case 5: return renderClubRelatives()
            case 6: return renderBeneficiaries()
            case 7: return renderReviewAndSubmit()
            default:
                return null;
        }
    }
    
    const handleAddReferences = (membersToAdd) => {
        if (selectedReferees.length >= 2) {
            // Optionally, deselect the oldest selection or show a warning
            alert('Alert: You can only add up to 2 referees.')
            // You might need to programmatically deselect a row here
            // For simplicity, this example just alerts.
        } else {
            // Logic to add membersToAdd to selectedReferees, ensuring no duplicates and handling the limit if needed
            setSelectedReferees((prevMembers) => {
                const newMembers = [...prevMembers]
                membersToAdd.forEach(member => {
                    if (!newMembers.some(m => m.id === member.id)) {
                        newMembers.push(member)
                        addRefereeToArray(member)
                        //addPersonToArray('referees') // Add empty form for each referee selected
                    }
                })
                return newMembers
            })
        }
        setShowRefereesModal(false)
    }

    const handleAddRelatives = (membersToAdd) => {
        if (selectedRelatives.length >= 2) {
            alert('Alert: You can only add up to 2 relatives.')
        } else {
            // Logic to add membersToAdd to selectedReferees, ensuring no duplicates and handling the limit if needed
            setSelectedRelatives((prevRelatives) => {
                const newRelatives = [...prevRelatives]
                membersToAdd.forEach(relative => {
                    if (!newRelatives.some(m => m.id === relative.id)) {
                        newRelatives.push(relative)
                        addRelativeToArray(relative)
                    }
                })
                return newRelatives
            })
        }
        setShowRelativesModal(false)
    }

  return (
    <>
        <div className="card my-3 border shadow"> 
            <div className='card-header text-white bg-danger'>
                <h5 className="card-title">Update Member Details</h5>
            </div>
            {/* New Progress Bar */}
            <div className='card-body px-1 px-sm-3'>
                <div className="container mb-8">
                    <div className="row mb-2">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon;
                            return (
                                <div key={index} className="col d-flex px-0 px-md-2 justify-content-center">
                                    <div className="d-flex flex-column">
                                        <div className="d-flex justify-content-center">
                                            <div className={`rounded-circle p-2
                                                ${(currentStep + 1) >= step.number
                                                    ? 'shadow-lg bg-primary text-white'
                                                    : 'bg-secondary text-white'
                                                }
                                                `}>
                                                <IconComponent size={20}/>
                                            </div>
                                        </div>
                                        <div className="d-none d-md-flex text-center">
                                            <p className="small mb-0">{step.title}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="row mb-0">
                        <ProgressBar now={`${((currentStep + 1) / steps.length) * 100}`} label={`Step ${currentStep + 1}`} className='bg-white' />
                    </div>
                    <div className="row mb-4">
                        <div className="col">
                            <span className="small mb-0">Step {currentStep + 1} of {steps.length + 1}</span>
                        </div>
                        <div className="col">
                            <span className="small mb-0">{Math.round(((currentStep) / (steps.length)) * 100)}% Complete</span>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6">
                    {renderStep()}
                </div>
            </div>
        </div>
        <div className="card-footer">
            <div className="text-center my-2">
                <button type="button" onClick={prevStep} className="btn btn-outline-primary mx-3" disabled={(currentStep === 0) || loading} title='Previous Step'>
                    <ArrowLeftCircleFill size={20} className="m-0 me-sm-1 mb-1" />
                    <span className="d-none d-sm-inline-block">Prev</span>
                </button>
                <button type='button' onClick={cancel} className="btn btn-outline-danger mx-3" disabled={loading} title='Cancel Membership Application'>
                    <span className="d-none d-sm-inline-block">Cancel</span>
                    <XCircleFill size={20} className="m-0 ms-sm-1 mb-1" />
                </button>
                <ConfirmationModal
                    show={show}
                    message={confirmMsg}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
                {currentStep < (steps.length) ? (
                    <button type="button" onClick={nextStep} className="btn btn-outline-primary mx-3" disabled={loading} title='Next Step'>
                        <span className="d-none d-sm-inline-block">Next</span>
                        <ArrowRightCircleFill size={20} className="m-0 ms-sm-1 mb-1" />
                    </button>
                ) : (
                    <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-success mx-3" disabled={loading} title='Update Member'>
                        <span className="d-none d-sm-inline-block">
                            { loading ? 'Updating...' : 'Update' }
                        </span>
                        <SendCheck size={20} className="m-0 ms-sm-1 mb-1" />
                    </button>
                )}
            </div>
        </div>

        {showUsersModal && (
            <UserSelectionModal
            onClose={() => setShowUsersModal(false)}
            onAddUser={handleAddUser}
            personType={'User'}
            />
        )}
        {showRefereesModal && (
            <MemberSelectionModal
            onClose={() => setShowRefereesModal(false)}
            onAddMembers={handleAddReferences}
            personType={'Referee'}
            />
        )}
        {showRelativesModal && (
            <MemberSelectionModal
            onClose={() => setShowRelativesModal(false)}
            onAddMembers={handleAddRelatives}
            personType={'Relative'}
            />
        )}
    </>
  )
}

UpdateMember.propTypes = {
    formData: PropTypes.object,
    setFormData: PropTypes.func,
    loading: PropTypes.bool, 
    onSubmit: PropTypes.func,
}

export default UpdateMember
