import { useEffect, useState } from 'react';
import { ArrowLeftCircleFill, ArrowRightCircleFill, EnvelopeAt, EnvelopeFill, GeoAlt, Heart, People, PeopleFill, Person, PersonArmsUp, PersonCheck, PersonCheckFill, PersonCircle, PersonFill, PersonHeart, PersonHearts, PersonLinesFill, Plus, Send, SendCheck, Telephone, Trash, XCircleFill } from 'react-bootstrap-icons';
import { ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import countriesData from '../../assets/data/countries.json';
import { toast } from 'sonner';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';

const ClubMembershipForm = () => {
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated } = useAuth()
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState({
        applicationStatus: "",
        person: {
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
        },
        maritalStatus: "",
        parents: [],
        spouses: [],
        children: [],
        siblings: [],
        referees: [],
        relatives: [],
        beneficiaries: []
    });

    const steps = [
        { number: 1, title: "Applicant's Info", icon: Person },
        { number: 2, title: "Family Info", icon: Heart },
        { number: 3, title: "Parents Info", icon: People },
        { number: 4, title: "Siblings Info", icon: PersonArmsUp },
        { number: 5, title: "Reference Info", icon: PersonCheck },
        { number: 6, title: "Club Relatives", icon: PersonLinesFill },
        { number: 7, title: "Beneficiaries Info", icon: PersonHearts },
    ];

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
                        phones: [{ id: 0, type: "", countryCode: "", number: "" }]
                    }
                },
                parents: [],
                spouses: [],
                children: [],
                siblings: [],
                referees: [],
                relatives: [],
                beneficiaries: []
            }
        }  
    })

    const createEmptyParent = () => ({ person: createEmptyPerson() });
    const createEmptySpouse = () => ({ spouse: { person: createEmptyPerson(), maritalStatus: "" } });
    const createEmptyChild = () => ({ person: createEmptyPerson() });
    const createEmptySibling = () => ({ sibling: { person: createEmptyPerson(), siblingType: "" } });
    const createEmptyReferee = () => ({ referee: createNewReferee() });
    const createEmptyRelative = () => ({ relative: { person: createEmptyPerson(), relationship: "" } });
    const createEmptyBeneficiary = () => ({ beneficiary: { person: createEmptyPerson(), percentage: 0.0 } });

    const addPersonToArray = (arrayName) => {
        let newEntry;
        switch (arrayName) {
        case 'parents': 
            newEntry = createEmptyParent(); 
            break;
        case 'spouses': 
            newEntry = createEmptySpouse(); 
            break;
        case 'children': 
            newEntry = createEmptyChild(); 
            break;
        case 'siblings': 
            newEntry = createEmptySibling(); 
            break;
        case 'referees': 
            newEntry = createEmptyReferee(); 
            break;
        case 'relatives': 
            newEntry = createEmptyRelative(); 
            break;
        case 'beneficiaries': 
            newEntry = createEmptyBeneficiary(); 
            break;
        default: 
            newEntry = createEmptyPerson();
        }
        
        setFormData(prev => ({
        ...prev,
        [arrayName]: [...prev[arrayName], newEntry]
        }));
    };

    const updatePersonInArray = (arrayName, index, field, value, subField = null) => {
        setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].map((entry, i) => {
            if (i === index) {
                switch (arrayName) {
                    case 'parents':
                    case 'children':
                        if (subField) {
                            return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } };
                        }
                        return { ...entry, person: { ...entry.person, [field]: value } };
                    
                    case 'referees':
                        if (subField) {
                            return { ...entry, member: { ...entry.member, [field]: { ...entry.member[field], [subField]: value } } };
                        }
                        return { ...entry, member: { ...entry.member, [field]: value } };
                        
                    case 'siblings':
                        if (field === 'siblingType') {
                            return { ...entry, sibling: { ...entry.sibling, siblingType: value } };
                        }
                        if (subField) {
                            return { ...entry, sibling: { ...entry.sibling, person: { ...entry.sibling.person, [field]: { ...entry.sibling.person[field], [subField]: value } } } };
                        }
                        return { ...entry, sibling: { ...entry.sibling, person: { ...entry.sibling.person, [field]: value } } };
                    
                    case 'spouses':
                        if (field === 'maritalStatus') {
                            return { ...entry, spouse: { ...entry.spouse, maritalStatus: value } }
                        }
                        if (subField) {
                            return { ...entry, spouse: { ...entry.spouse, person: { ...entry.spouse.person, [field]: { ...entry.spouse.person[field], [subField]: value } } } }
                        }
                        return { ...entry, spouse: { ...entry.spouse, person: { ...entry.spouse.person, [field]: value } } }
                    
                    case 'relatives':
                        if (field === 'relationship') {
                            return { ...entry, relative: { ...entry.relative, relationship: value } }
                        }
                        if (subField) {
                            return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                        }
                        return { ...entry, person: { ...entry.person, [field]: value } }
                    
                    case 'beneficiaries':
                        if (field === 'percentage') {
                            return { ...entry, beneficiary: { ...entry.beneficiary, percentage: value } }
                        }
                        if (subField) {
                            return { ...entry, beneficiary: { ...entry.beneficiary, person: { ...entry.beneficiary.person, [field]: { ...entry.beneficiary.person[field], [subField]: value } } } }
                        }
                        return { ...entry, beneficiary: { ...entry.beneficiary, person: { ...entry.beneficiary.person, [field]: value } } }
                    
                    default:
                        return entry
                }
            }
            return entry
        })
        }))
    }

    const updateContactForPerson = (arrayName, personIndex, contactType, contactIndex, field, value) => {
        setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].map((entry, i) => {
            if (i === personIndex) {
                let personObj;
                switch (arrayName) {
                    case 'parents':
                    case 'children':
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
                        personObj = entry.member.application.person;
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
                    
                    case 'siblings':
                        personObj = entry.sibling.person;
                        return {
                            ...entry,
                            sibling: {
                            ...entry.sibling,
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
                    
                    case 'spouses':
                        personObj = entry.spouse.person;
                        return {
                            ...entry,
                            spouse: {
                            ...entry.spouse,
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
                        };
                    
                    case 'relatives':
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
                        };
                    
                    case 'beneficiaries':
                        personObj = entry.beneficiary.person;
                        return {
                            ...entry,
                            beneficiary: {
                            ...entry.beneficiary,
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
                        };
                    
                    default:
                        return entry;
                }
            }
            return entry;
        })
        }));
    };

    const addContactForPerson = (arrayName, personIndex, contactType) => {
        const newContact = contactType === 'addresses' 
        ? { type: "", street: "", city: "", state: "", zipcode: "", country: "" }
        : contactType === 'emails'
        ? { type: "", address: "" }
        : { type: "", countryCode: "", number: "" };

        setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].map((entry, i) => {
            if (i === personIndex) {
                let personObj;
                switch (arrayName) {
                    case 'parents':
                    case 'children':
                        personObj = entry.person;
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
                        personObj = entry.member.application.person;
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
                    
                    case 'siblings':
                        personObj = entry.sibling.person;
                        return {
                            ...entry,
                            sibling: {
                            ...entry.sibling,
                            person: {
                                ...personObj,
                                contact: {
                                ...personObj.contact,
                                [contactType]: [...personObj.contact[contactType], newContact]
                                }
                            }
                            }
                        }
                    
                    case 'spouses':
                        personObj = entry.spouse.person;
                        return {
                            ...entry,
                            spouse: {
                            ...entry.spouse,
                            person: {
                                ...personObj,
                                contact: {
                                ...personObj.contact,
                                [contactType]: [...personObj.contact[contactType], newContact]
                                }
                            }
                            }
                        };
                    
                    case 'relatives':
                        personObj = entry.person;
                        return {
                            ...entry,
                            person: {
                            ...personObj,
                            contact: {
                                ...personObj.contact,
                                [contactType]: [...personObj.contact[contactType], newContact]
                            }
                            }
                        };
                    
                    case 'beneficiaries':
                        personObj = entry.beneficiary.person;
                        return {
                            ...entry,
                            beneficiary: {
                            ...entry.beneficiary,
                            person: {
                                ...personObj,
                                contact: {
                                ...personObj.contact,
                                [contactType]: [...personObj.contact[contactType], newContact]
                                }
                            }
                            }
                        };
                    
                    default:
                        return entry;
                }
            }
            return entry;
        })
        }));
    };

    const removeContactForPerson = (arrayName, personIndex, contactType, contactIndex) => {
        setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].map((entry, i) => {
            if (i === personIndex) {
                let personObj;
                switch (arrayName) {
                    case 'parents':
                    case 'children':
                        personObj = entry.person;
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
                        personObj = entry.member.application.person;
                        return {
                            ...entry,
                            person: {
                            ...personObj,
                            contact: {
                                ...personObj.contact,
                                [contactType]: personObj.contact[contactType].filter((_, j) => j !== contactIndex)
                            }
                            }
                        };
                    
                    case 'siblings':
                        personObj = entry.sibling.person;
                        return {
                            ...entry,
                            sibling: {
                            ...entry.sibling,
                            person: {
                                ...personObj,
                                contact: {
                                ...personObj.contact,
                                [contactType]: personObj.contact[contactType].filter((_, j) => j !== contactIndex)
                                }
                            }
                            }
                        }

                    case 'spouses':
                        personObj = entry.spouse.person;
                        return {
                            ...entry,
                            spouse: {
                            ...entry.spouse,
                            person: {
                                ...personObj,
                                contact: {
                                ...personObj.contact,
                                [contactType]: personObj.contact[contactType].filter((_, j) => j !== contactIndex)
                                }
                            }
                            }
                        };
                    
                    case 'relatives':
                        personObj = entry.person;
                        return {
                            ...entry,
                            person: {
                            ...personObj,
                            contact: {
                                ...personObj.contact,
                                [contactType]: personObj.contact[contactType].filter((_, j) => j !== contactIndex)
                            }
                            }
                        };
                    
                    case 'beneficiaries':
                        personObj = entry.beneficiary.person;
                        return {
                            ...entry,
                            beneficiary: {
                            ...entry.beneficiary,
                            person: {
                                ...personObj,
                                contact: {
                                ...personObj.contact,
                                [contactType]: personObj.contact[contactType].filter((_, j) => j !== contactIndex)
                                }
                            }
                            }
                        };
                    
                    default:
                        return entry;
                }
            }
            return entry;
        })
        }));
    };

    const removePersonFromArray = (arrayName, index) => {
        setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index)
        }));
    };

    const addContact = (type) => {
        const newContact = type === 'addresses' 
        ? { type: "", street: "", city: "", state: "", zipcode: "", country: "" }
        : type === 'emails'
        ? { type: "", address: "" }
        : { type: "", countryCode: "", number: "" };

        setFormData(prev => ({
        ...prev,
        person: {
            ...prev.person,
            contact: {
            ...prev.person.contact,
            [type]: [...prev.person.contact[type], newContact]
            }
        }
        }));
    };

    const removeContact = (type, index) => {
        setFormData(prev => ({
        ...prev,
        person: {
            ...prev.person,
            contact: {
            ...prev.person.contact,
            [type]: prev.person.contact[type].filter((_, i) => i !== index)
            }
        }
        }));
    };

    const updateContact = (type, index, field, value) => {
        setFormData(prev => ({
        ...prev,
        person: {
            ...prev.person,
            contact: {
            ...prev.person.contact,
            [type]: prev.person.contact[type].map((contact, i) => 
                i === index ? { ...contact, [field]: value } : contact
            )
            }
        }
        }));
    };

    const updateMainPerson = (field, value) => {
        setFormData(prev => ({
        ...prev,
        person: {
            ...prev.person,
            [field]: value
        }
        }));
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({
        ...prev,
        [field]: value
        }));
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
        }
    };

    useEffect(() => {
        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
            }, 3000) 

            return () => clearTimeout(timerId)
        }
    }, [message])

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('Sending membership application...')
        
        try {
            if(isAuthenticated) {
                const response = await fetchWithAuth('http://localhost:8080/api/v1/applications', {
                    method: 'POST',
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

                const jsonData = await response.json();
                console.log(jsonData)
                setMessage('Membership application submitted successfully!')
                toast.success('Membership application submitted successfully!')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const renderPersonForm = (entry, arrayName, index, title) => {
        let person, extraFields = {}
        
        switch (arrayName) {
        case 'parents':
        case 'children':
            person = entry.person
            break
        case 'referees':
            person = entry.member.application.person
            break
        case 'siblings':
            person = entry.sibling.person
            extraFields.siblingType = entry.sibling.siblingType
            break;
        case 'spouses':
            person = entry.spouse.person
            extraFields.maritalStatus = entry.spouse.maritalStatus
            break
        case 'relatives':
            person = entry.relative.person
            extraFields.relationship = entry.relative.relationship
            break
        case 'beneficiaries':
            person = entry.beneficiary.person
            extraFields.percentage = entry.beneficiary.percentage
            break
        default:
            person = entry
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
                        >
                            <Trash size={24} />
                        </button>
                    </div>
                    <div className="card-body px-1 px-sm-3">
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">First Name*</span>
                                    <input
                                        type={"text"}
                                        className="form-control"
                                        placeholder="First Name"
                                        value={person.firstName}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'firstName', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">Middle Name</span>
                                    <input
                                        type={"text"}
                                        className="form-control"
                                        placeholder="Middle Name"
                                        value={person.middleName}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'middleName', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">Last Name*</span>
                                    <input
                                        type={"text"}
                                        className="form-control"
                                        placeholder="Last Name"
                                        value={person.lastName}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'lastName', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">Date Of Birth*</span>
                                    <input
                                        type={"date"}
                                        className="form-control"
                                        value={person.dob}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'dob', e.target.value)}
                                
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">Life Status</span>
                                    <select 
                                        className="form-select" 
                                        value={person.lifeStatus}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'lifeStatus', e.target.value)}
                                    >
                                        <option value="">Choose...</option>
                                        <option value="Living">Living</option>
                                        <option value="Deceased">Deceased</option>
                                    </select>
                                </div>
                            </div>

                            {arrayName === 'spouses' && (
                                <div className="col-sm-6 mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text">Marital Status</span>
                                        <select
                                            value={extraFields.maritalStatus}
                                            onChange={(e) => updatePersonInArray(arrayName, index, 'maritalStatus', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Choose...</option>
                                            <option value="Single (Never Married)">Single (Never Married)</option>
                                            <option value="Married">Married</option>
                                            <option value="Living Common-Law">Living Common-Law</option>
                                            <option value="Separated">Separated</option>
                                            <option value="Divorced">Divorced</option>
                                            <option value="Widowed">Widowed</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {arrayName === 'relatives' && (
                                <div className="col-sm-6 mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text">Family Relationship</span>
                                        <select
                                            value={extraFields.relationship}
                                            onChange={(e) => updatePersonInArray(arrayName, index, 'relationship', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Choose...</option>
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
                                    </div>
                                </div>
                            )}

                            {arrayName === 'beneficiaries' && (
                                <div className="col-sm-6 mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text">Percentage</span>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            value={extraFields.percentage}
                                            onChange={(e) => updatePersonInArray(arrayName, index, 'percentage', parseFloat(e.target.value) || 0.0)}
                                            className="form-control"
                                        />
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
                                                >
                                                    <Trash size={24} />
                                                </button>
                                                )}
                                            </div>

                                            <div className="form-group row">
                                                <div className="col-sm-5 mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text">Type</span>
                                                        <select
                                                            value={address.type}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'type', e.target.value)}
                                                            className="form-select"
                                                        >
                                                            <option value="">Choose...</option>
                                                            <option value="Home">Home</option>
                                                            <option value="Work">Work</option>
                                                            <option value="School">School</option>
                                                            <option value="Mailing">Mailing</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-sm-7 mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text">Street</span>
                                                        <input
                                                            type={"text"}
                                                            placeholder="Street Address"
                                                            value={address.street}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'street', e.target.value)}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-5 mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text">City</span>
                                                        <input
                                                            type={"text"}
                                                            placeholder="City"
                                                            value={address.city}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'city', e.target.value)}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-7 mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text">State</span>
                                                        <input
                                                            type={"text"}
                                                            placeholder="State"
                                                            value={address.state}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'state', e.target.value)}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-5 mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text">ZIP Code</span>
                                                        <input
                                                            type={"text"}
                                                            placeholder="ZIP Code"
                                                            value={address.zipcode}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'zipcode', e.target.value)}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-7 mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text">Country</span>
                                                        <select 
                                                            id={`country-${index}`}
                                                            name={`country-${index}`}
                                                            className="form-select"
                                                            value={address.country}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'country', e.target.value)}
                                                        >
                                                            <option key={'nil'} value="">Choose...</option>
                                                            {countriesData.map((country) => (
                                                                <option key={country.cca2} value={country.name}>
                                                                    {country.flag} {country.name}
                                                                </option>
                                                            ))}
                                                        </select>
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
                                        >
                                            <Plus className="mb-1" color="white" size={21} />
                                            <span className='d-none d-sm-flex text-white'>Email</span>
                                        </button>
                                    </div>
                        
                                    {person.contact.emails.map((email, emailIndex) => (
                                        <div key={emailIndex} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                            <div className="form-group row">
                                                <div className="col-sm-4 mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text">Type</span>
                                                        <select
                                                            value={email.type}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'emails', emailIndex, 'type', e.target.value)}
                                                            className="form-select"
                                                        >
                                                            <option value="">Choose...</option>
                                                            <option value="Personal">Personal</option>
                                                            <option value="Work">Work</option>
                                                            <option value="School">School</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-sm-7 mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text">Email</span>
                                                        <input
                                                            type={"email"}
                                                            placeholder="Email Address"
                                                            value={email.address}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'emails', emailIndex, 'address', e.target.value)}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                                {person.contact.emails.length > 1 && (
                                                    <div className="col-sm-1 mb-3 mt-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeContactForPerson(arrayName, index, 'emails', emailIndex)}
                                                            className="bg-light text-danger"
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
                                        >
                                            <Plus className="mb-1" color="white" size={21} />
                                            <span className='d-none d-sm-flex text-white'>Phone No.</span>
                                        </button>
                                    </div>
                                    
                                    {person.contact.phones.map((phone, phoneIndex) => (
                                        <div key={phoneIndex} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                            <div className="form-group row">
                                                <div className="col-sm-6 mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text">Type</span>
                                                        <select
                                                            value={phone.type}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'phones', phoneIndex, 'type', e.target.value)}
                                                            className="form-select"
                                                        >
                                                            <option value="">Choose...</option>
                                                            <option value="Mobile">Mobile</option>
                                                            <option value="Home">Home</option>
                                                            <option value="Work">Work</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-5 mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text">Country Code</span>
                                                        <input
                                                            type={"text"}
                                                            placeholder="Country Code"
                                                            value={phone.countryCode}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'phones', phoneIndex, 'countryCode', e.target.value)}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text">Number</span>
                                                        <input
                                                            type={"tel"}
                                                            placeholder="Phone Number"
                                                            value={phone.number}
                                                            onChange={(e) => updateContactForPerson(arrayName, index, 'phones', phoneIndex, 'number', e.target.value)}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                                {person.contact.phones.length > 1 && (
                                                    <div className="col-sm-1 mb-3 mt-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeContactForPerson(arrayName, index, 'phones', phoneIndex)}
                                                            className="bg-light text-danger"
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
                            <div className="col-sm-4 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">First Name*</span>
                                    <input
                                        type={"text"}
                                        className="form-control"
                                        placeholder="First Name"
                                        name="firstName"
                                        value={formData.person.firstName}
                                        onChange={(e) => updateMainPerson('firstName', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-4 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">Middle Name</span>
                                    <input
                                        type={"text"}
                                        className="form-control"
                                        placeholder="Middle name"
                                        name="middleName"
                                        value={formData.person.middleName}
                                        onChange={(e) => updateMainPerson('middleName', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-4 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">Last Name*</span>
                                    <input
                                        type={"text"}
                                        className="form-control"
                                        placeholder="Last name"
                                        name="lastName"
                                        value={formData.person.lastName}
                                        onChange={(e) => updateMainPerson('lastName', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">Date Of Birth*</span>
                                    <input
                                        type={"date"}
                                        className="form-control"
                                        name="dob"
                                        value={formData.person.dob}
                                        onChange={(e) => updateMainPerson('dob', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">Life Status</span>
                                    <select 
                                        className="form-select" 
                                        name="lifeStatus" 
                                        id="lifeStatus"
                                        value={formData.person.lifeStatus}
                                        onChange={(e) => updateMainPerson('lifeStatus', e.target.value)}
                                    >
                                        <option value="">Choose...</option>
                                        <option value="Living">Living</option>
                                        <option value="Deceased">Deceased</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">Marital Status</span>
                                    <select 
                                        className="form-select" 
                                        name="maritalStatus" 
                                        id="maritalStatus"
                                        value={formData.maritalStatus}
                                        onChange={(e) => updateFormData('maritalStatus', e.target.value)}
                                    >
                                        <option value="">Choose...</option>
                                        <option value="Single (Never Married)">Single (Never Married)</option>
                                        <option value="Married">Married</option>
                                        <option value="Living Common-Law">Living Common-Law</option>
                                        <option value="Separated">Separated</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">Application Status</span>
                                    <select
                                        className="form-select" 
                                        name="applicationStatus" 
                                        id="applicationStatus"
                                        value={formData.applicationStatus}
                                        onChange={(e) => updateFormData('applicationStatus', e.target.value)}
                                        
                                    >
                                        <option value="">Choose...</option>
                                        <option value="Draft">Draft</option>
                                        <option value="Submitted">Submitted</option>
                                        <option value="In review">In Review</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Withdrawn">Withdrawn</option>
                                    </select>
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
                                >
                                    <Plus className="mb-1" color="white" size={21} />
                                    <span className='d-none d-sm-flex text-white'>Address</span>
                                </button>
                            </div>
                        
                            {formData.person.contact.addresses.map((address, index) => (
                                <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                    <div className="d-flex justify-content-between items-center mb-3">
                                        <span className="font-medium"><strong>Address {index + 1}</strong></span>
                                        {formData.person.contact.addresses.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeContact('addresses', index)}
                                            className="bg-light text-danger p-2"
                                        >
                                            <Trash size={24} />
                                        </button>
                                        )}
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-sm-5 mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text">Type</span>
                                                <select
                                                    value={address.type}
                                                    onChange={(e) => updateContact('addresses', index, 'type', e.target.value)}
                                                    className="form-select"
                                                >
                                                    <option value="">Choose...</option>
                                                    <option value="Home">Home</option>
                                                    <option value="Work">Work</option>
                                                    <option value="School">School</option>
                                                    <option value="Mailing">Mailing</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-sm-7 mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text">Street</span>
                                                <input
                                                    type={"text"}
                                                    placeholder="Street Address"
                                                    value={address.street}
                                                    onChange={(e) => updateContact('addresses', index, 'street', e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-5 mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text">City</span>
                                                <input
                                                    type={"text"}
                                                    placeholder="City"
                                                    value={address.city}
                                                    onChange={(e) => updateContact('addresses', index, 'city', e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-7 mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text">State</span>
                                                <input
                                                    type={"text"}
                                                    placeholder="State"
                                                    value={address.state}
                                                    onChange={(e) => updateContact('addresses', index, 'state', e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-5 mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text">ZIP Code</span>
                                                <input
                                                    type={"text"}
                                                    placeholder="ZIP Code"
                                                    value={address.zipcode}
                                                    onChange={(e) => updateContact('addresses', index, 'zipcode', e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-7 mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text">Country</span>
                                                <select 
                                                    id={`country-${index}`}
                                                    name={`country-${index}`}
                                                    className="form-select"
                                                    value={address.country}
                                                    onChange={(e) => updateContact('addresses', index, 'country', e.target.value)}
                                                >
                                                    <option key={'nil'} value="">Choose...</option>
                                                    {countriesData.map((country) => (
                                                        <option key={country.cca2} value={country.name}>
                                                            {country.flag} {country.name}
                                                        </option>
                                                    ))}
                                                </select>
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
                                >
                                    <Plus className="mb-1" color="white" size={21} />
                                    <span className='d-none d-sm-flex text-white'>Email</span>
                                </button>
                            </div>
                
                            {formData.person.contact.emails.map((email, index) => (
                                <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                    <div className="form-group row">
                                        <div className="col-sm-4 mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text">Type</span>
                                                <select
                                                    value={email.type}
                                                    onChange={(e) => updateContact('emails', index, 'type', e.target.value)}
                                                    className="form-select"
                                                >
                                                    <option value="">Choose...</option>
                                                    <option value="Personal">Personal</option>
                                                    <option value="Work">Work</option>
                                                    <option value="School">School</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-sm-7 mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text">Email</span>
                                                <input
                                                    type={"email"}
                                                    placeholder="Email Address"
                                                    value={email.address}
                                                    onChange={(e) => updateContact('emails', index, 'address', e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        {formData.person.contact.emails.length > 1 && (
                                            <div className="col-sm-1 mb-3 mt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => removeContact('emails', index)}
                                                    className="bg-light text-danger"
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
                                >
                                    <Plus className="mb-1" color="white" size={21} />
                                    <span className='d-none d-sm-flex text-white'>Phone No.</span>
                                </button>
                            </div>
                            
                            {formData.person.contact.phones.map((phone, index) => (
                                <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text">Type</span>
                                                <select
                                                    value={phone.type}
                                                    onChange={(e) => updateContact('phones', index, 'type', e.target.value)}
                                                    className="form-select"
                                                >
                                                    <option value="">Choose...</option>
                                                    <option value="Mobile">Mobile</option>
                                                    <option value="Home">Home</option>
                                                    <option value="Work">Work</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-5 mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text">Country Code</span>
                                                <input
                                                    type={"text"}
                                                    placeholder="Country Code"
                                                    value={phone.countryCode}
                                                    onChange={(e) => updateContact('phones', index, 'countryCode', e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text">Number</span>
                                                <input
                                                    type={"tel"}
                                                    placeholder="Phone Number"
                                                    value={phone.number}
                                                    onChange={(e) => updateContact('phones', index, 'number', e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        {formData.person.contact.phones.length > 1 && (
                                            <div className="col-sm-1 mb-3 mt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => removeContact('phones', index)}
                                                    className="bg-light text-danger"
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
                    
                        {formData.spouses.length === 0 ? (
                            <p className="text-secondary text-center py-4">No spouses added yet</p>
                        ) : (
                            formData.spouses.map((spouse, index) => 
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
                    
                        {formData.children.length === 0 ? (
                            <p className="text-secondary text-center py-4">No children added yet</p>
                        ) : (
                            formData.children.map((child, index) => 
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
                    
                        {formData.parents.length === 0 ? (
                            <p className="text-secondary text-center py-4">No parents added yet</p>
                        ) : (
                            formData.parents.map((parent, index) => 
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
                    
                        {formData.siblings.length === 0 ? (
                            <p className="text-secondary text-center py-4">No siblings added yet</p>
                        ) : (
                            formData.siblings.map((sibling, index) => 
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
                    
                        {formData.referees.length === 0 ? (
                            <p className="text-secondary text-center py-4">No referees added yet</p>
                        ) : (
                            formData.referees.map((referee, index) => 
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
                    
                        {formData.relatives.length === 0 ? (
                            <p className="text-secondary text-center py-4">No relatives added yet</p>
                        ) : (
                            formData.relatives.map((relative, index) => 
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
                    
                        {formData.beneficiaries.length === 0 ? (
                            <p className="text-secondary text-center py-4">No beneficiaries added yet</p>
                        ) : (
                            formData.beneficiaries.map((beneficiary, index) => 
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
    };

  return (
    <div className="container mt-5 pt-4">
        <div className="card my-3 border shadow"> 
            <div className='card-header text-white bg-primary'>
                <h5 className="card-title">Club Membership Form</h5>
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

                {/* Navigation */}
                
            </div>
        </div>
        <div className="card-footer">
            <div className="text-center my-2">
                <button type="button" onClick={prevStep} className="btn btn-outline-primary mx-3" disabled={currentStep === 0}>
                    <ArrowLeftCircleFill size={20} className="m-0 me-sm-1 mb-1" />
                    <span className="d-none d-sm-inline-block">Prev</span>
                </button>
                <Link className="btn btn-outline-danger mx-3" to="/view-all-applications">
                    <span className="d-none d-sm-inline-block">Cancel</span>
                    <XCircleFill size={20} className="m-0 ms-sm-1 mb-1" />
                </Link>
                {currentStep < (steps.length) ? (
                    <button type="button" onClick={nextStep} className="btn btn-outline-primary mx-3">
                        <span className="d-none d-sm-inline-block">Next</span>
                        <ArrowRightCircleFill size={20} className="m-0 ms-sm-1 mb-1" />
                    </button>
                ) : (
                    <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-success mx-3">
                        <span className="d-none d-sm-inline-block">
                            { loading ? 'Sending...' : 'Submit' }
                        </span>
                        <SendCheck size={20} className="m-0 ms-sm-1 mb-1" />
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default ClubMembershipForm;