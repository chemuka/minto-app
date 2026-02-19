import { useEffect, useState } from 'react';
import { ArrowLeftCircleFill, ArrowRightCircleFill, Floppy2, Heart, People, Person, PersonArmsUp, 
    PersonCheck,  PersonHearts, PersonLinesFill, Send, SendCheck, XCircleFill } from 'react-bootstrap-icons';
import { ProgressBar } from 'react-bootstrap';
import { toast } from 'sonner';
import PropTypes from 'prop-types'
import useConfirmation from '../../hooks/useConfirmation';
import ConfirmationModal from '../../misc/modals/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
//import API_BASE_URL from '../../../apiConfig';
import LoadingSpinner from '../../loading/LoadingSpinner';
import { defaultParent } from '../../../model/defaultParent';
import { defaultSpouse } from '../../../model/defaultSpouse';
import { defaultChild } from '../../../model/defaultChild';
import { defaultSibling } from '../../../model/defaultSibling';
import { defaultReferee } from '../../../model/defaultReferee';
import { defaultRelative } from '../../../model/defaultRelative';
import { defaultBeneficiary } from '../../../model/defaultBeneficiary';
import { defaultPerson } from '../../../model/defaultPerson';
import { defaultApplication } from '../../../model/defaultApplication';
import PersonForm from '../../person/person-form/PersonForm';
import RefereesForm from '../../person/RefereesForm';
import SiblingsForm from '../../person/SiblingsForm';
import ParentsForm from '../../person/ParentsForm';
import FamilyInfo from '../../person/FamilyInfo';
import ClubRelativesForm from '../../person/ClubRelativesForm';
import BeneficiariesForm from '../../person/BeneficiariesForm';
import PersonalInfoForm from '../../person/personal-info-form/PersonalInfoForm';

const DEFAULT_ERRORS = {
    formData: {
        person: {
            contact: {
                addresses: [],
                emails: [],
                phones: [],
            },
        },
    },
}

/**
 * Create draft membership application by users with regular user permissions.
 */
const DraftApplication = (props) => {
    const { title, headerBgColor, cardBorderColor } = props
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    const navigate = useNavigate()
    const { isAuthenticated, getUser } = useAuth()
    const { fetchWithAuth } = useFetch()
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState({ ...defaultApplication, applicationStatus: 'Draft' })
    const [formErrors, setFormErrors] = useState(DEFAULT_ERRORS)
    const user = getUser()

    const steps = [
        { number: 1, title: "Applicant's Info", icon: Person },
        { number: 2, title: "Family Info", icon: Heart },
        { number: 3, title: "Parents Info", icon: People },
        { number: 4, title: "Siblings Info", icon: PersonArmsUp },
        { number: 5, title: "Reference Info", icon: PersonCheck },
        { number: 6, title: "Club Relatives", icon: PersonLinesFill },
        { number: 7, title: "Beneficiaries Info", icon: PersonHearts },
    ]

    const addPersonToArray = (arrayName) => {
        let newEntry
        switch (arrayName) {
        case 'parents': 
            newEntry = { ...defaultParent } 
            break
        case 'spouses': 
            newEntry = { ...defaultSpouse } 
            break
        case 'children': 
            newEntry = { ...defaultChild } 
            break
        case 'siblings': 
            newEntry = { ...defaultSibling } 
            break
        case 'referees': 
            newEntry =  { ...defaultReferee }
            break
        case 'relatives': 
            newEntry = { ...defaultRelative }
            break
        case 'beneficiaries': 
            newEntry = { ...defaultBeneficiary }
            break
        default: 
            newEntry = { ...defaultPerson }
        }
        
        setFormData(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], newEntry]
        }))
    }

    const updatePersonInArray = (arrayName, index, field, value, subField = null) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].map((entry, i) => {
                if (i === index) {
                    switch (arrayName) {
                        case 'parents':
                            if (field === 'parentType') {
                                return { ...entry, parentType: value }
                            }
                            if (subField) {
                                return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                            }
                            return { ...entry, person: { ...entry.person, [field]: value } }
                        
                        case 'children':
                            if (field === 'childType') {
                                return { ...entry, childType: value }
                            }
                            if (subField) {
                                return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                            }
                            return { ...entry, person: { ...entry.person, [field]: value } }
                        
                        case 'referees':
                            if (field === 'membershipNumber') {
                                return { ...entry, membershipNumber: value }
                            }
                            if (subField) {
                                return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                            }
                            return { ...entry, person: { ...entry.person, [field]: value } }
                        
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
                            if (field === 'membershipNumber') {
                                return { ...entry, membershipNumber: value }
                            }
                            if (field === 'familyRelationship') {
                                return { ...entry, familyRelationship: value }
                            }
                            if (subField) {
                                return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                            }
                            return { ...entry, person: { ...entry.person, [field]: value } }
                        
                        case 'beneficiaries':
                            if (field === 'percentage') {
                                return { ...entry, percentage: value }
                            }
                            if (field === 'relationship') {
                                return { ...entry, relationship: value }
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
                        case 'spouses':
                        case 'children':
                        case 'siblings':
                        case 'referees':
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
                        
                        default:
                            return entry
                    }
                }
                return entry
            })
        }))
    }

    const addContactForPerson = (arrayName, personIndex, contactType) => {
        const newContact = contactType === 'addresses' 
        ? { addressType: "", street: "", city: "", state: "", zipcode: "", country: "" }
        : contactType === 'emails'
        ? { emailType: "", address: "" }
        : { phoneType: "", countryCode: "", number: "" };

        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].map((entry, i) => {
                if (i === personIndex) {
                    let personObj;
                    switch (arrayName) {
                        case 'parents':
                        case 'spouses':
                        case 'children':
                        case 'siblings':
                        case 'referees':
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
                        
                        default:
                            return entry
                    }
                }
                return entry
            })
        }))
    }

    const removeContactForPerson = (arrayName, personIndex, contactType, contactIndex) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].map((entry, i) => {
                if (i === personIndex) {
                    let personObj
                    switch (arrayName) {
                        case 'parents':
                        case 'spouses':
                        case 'children':
                        case 'siblings':
                        case 'referees':
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
                        
                        default:
                            return entry
                    }
                }
                return entry
            })
        }))
    }


    const removePersonFromArray = (arrayName, index) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index)
        }));
    };

    const addContact = (contactType) => {
        const newContact = contactType === 'addresses' 
        ? { addressType: "", street: "", city: "", state: "", zipcode: "", country: "" }
        : contactType === 'emails'
        ? { emailType: "", address: "" }
        : { phoneType: "", countryCode: "", number: "" };

        setFormData(prev => ({
            ...prev,
            person: {
                ...prev.person,
                contact: {
                ...prev.person.contact,
                [contactType]: [...prev.person.contact[contactType], newContact]
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
        }))
    }

    const updateMainPerson = (field, value) => {
        setFormData(prev => ({
            ...prev,
            person: {
                ...prev.person,
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
        if(validateForm()) {
            if (currentStep < steps.length) {
                setCurrentStep(currentStep + 1);
            }
        } else {
            console.log('Invalid form! Please correct the errors before proceeding to the next step.')
            toast.error('Invalid form! Please correct the errors before proceeding to the next step.')
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }

    const cancel = async () => {
        const confirmation = await showConfirmation("Are you sure you want to cancel this 'Membership Application'?")
        if(confirmation) {
            setFormData({ ...defaultApplication })
            console.log("Membership Application Cancelled! The form is reset.")
            toast.info("'Membership Application' -> Cancelled!", {
                description: "The form has been reset.",
            })
            navigate('/login')
        } else {
            console.log("Cancel Aborted! Continue working on the Membership Application.")
            toast.info("Cancel -> Aborted!", {
                description: "Continue working on the 'Membership Application'.",
            })
        }
    }

    useEffect(() => {
        const loadApplications = async () => {
            //setLoading(true)
            try {
                if(user) {
                    //const response = await fetchWithAuth(`${API_BASE_URL}/applications/draft`, {
                    const response = await fetchWithAuth('http://localhost:8080/api/v1/applications/draft', {
                        method: 'GET',
                        credentials: "include",
                    })
                    
                    if (!response.ok) {
                        console.log("[ApplicationsGrid] - Network response was not ok")
                        toast.error('HTTP Error: Network response was NOT ok!')
                        throw new Error('Network response was not ok')
                    }
    
                    const applicationsData = await response.json()
                    //console.log(applicationsData)
                    if(applicationsData.applicationNumber) {// Only set formData if a draft application exists
                        setFormData(applicationsData)
                        toast.success('Applications loaded successfully!')
                    } else {
                        console.log('No draft application found for the user.')
                        toast.error('No draft application found for the user.')
                    }
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch(error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        loadApplications()
        if(isSubmitted) {
            const timer = setTimeout(() => {
                navigate(-1) // Go back to the previous page after 3 seconds
            }, 3000)
            return () => clearTimeout(timer)
        }
        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
            }, 3000) // Clear message after 3 seconds
            return () => clearTimeout(timerId)
        }
    }, [isSubmitted, message, user, fetchWithAuth, navigate])

    const onSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage('Saving membership application...')
        console.log('Saving membership application => ')
        //console.log(formData)

        try {
            if(isAuthenticated) {
                if (validateForm()) {
                    toast.success('Application form is valid!')
                    const response = await fetchWithAuth('http://localhost:8080/api/v1/applications/draft', {
                        method: 'POST',
                        credentials: "include",
                        headers: { 
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData), 
                    })

                    if(!response.ok) {
                        const respObj = await response.json()
                        console.log(`Error: ${respObj.message}`)
                        toast.error(respObj.message)
                        throw new Error(respObj.message)
                    }

                    const jsonData = await response.json();
                    console.log(jsonData)
                    setMessage('Membership application saved successfully!')
                    toast.success('Membership application saved successfully!')
                    setFormErrors(DEFAULT_ERRORS)
                    //navigate('/login')
                } else {
                    console.log('Invalid form! Please correct the errors and try again.')
                    console.log(formErrors)
                    toast.error('Invalid form! Please correct the errors and try again.')
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setSaving(false)
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('Sending membership application...')
        
        try {
            if(isAuthenticated) {
                const response = await fetchWithAuth('http://localhost:8080/api/v1/applications/draft/submit', {
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
                setIsSubmitted(true)
                setMessage('Membership application submitted successfully!')
                toast.success('Membership application submitted successfully!')
                //navigate('/login')
            }
        } catch (error) {
            console.error('Error submitting application:', error)
            toast.error('Error submitting application: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const validateForm = () => {
        let isValid = true
        const newErrors = DEFAULT_ERRORS
        const emailRegex = /\S+@\S+\.\S+/;
        const CountryCodeRegex = /\p{Regional_Indicator}{2}\s?\+\d{1,4}/u;
        //const oneUCaseRegex = /(?=.*?[A-Z])/;
        //const oneLCaseRegex = /(?=.*?[a-z])/;
        //const oneDigitRegex = /(?=.*?[0-9])/;
        //const oneSpecialCharRegex = /(?=.*?[!@#$%^&*()_+=[\]{}|;':",./<>?])/;
        //const minEightCharRegex = /.{8,}/;

        if (!formData.person.firstName) {
            newErrors.formData.person.firstName = 'Firstname cannot be empty!';
            isValid = false;
        } else if (formData.person.firstName.length < 2) {
            newErrors.formData.person.firstName = 'Firstname must be at least 2 characters';
            isValid = false;
        } else if (formData.person.firstName.trim() !== formData.person.firstName) {
            newErrors.formData.person.firstName = 'Firstname cannot have leading or trailing spaces';
            isValid = false;
        } else {
            newErrors.formData.person.firstName = '';
        }   

        if (!formData.person.lastName) {
            newErrors.formData.person.lastName = 'Lastname cannot be empty!';
            isValid = false;
        } else if (formData.person.lastName.length < 2) {
            newErrors.formData.person.lastName = 'Lastname must be at least 2 characters';
            isValid = false;
        } else if (formData.person.lastName.trim() !== formData.person.lastName) {
            newErrors.formData.person.lastName = 'Lastname cannot have leading or trailing spaces';
            isValid = false;
        } else {
            newErrors.formData.person.lastName = '';
        }

        if (!formData.person.dob) {
            newErrors.formData.person.dob = 'Date of Birth is required!';
            isValid = false;
        } else {
            const dobDate = new Date(formData.person.dob);
            const today = new Date();

            if (dobDate > today) {
                newErrors.formData.person.dob = 'Date of Birth cannot be in the future!';
                isValid = false;
            } else {
                newErrors.formData.person.dob = ''
            }
        }

        if (!formData.person.lifeStatus) {
            newErrors.formData.person.lifeStatus = 'Life Status is required!';
            isValid = false;
        } else {
            newErrors.formData.person.lifeStatus = ''
        }

        if (!formData.maritalStatus) {
            newErrors.formData.maritalStatus = 'Marital Status is required!';
            isValid = false;
        } else {
            newErrors.formData.maritalStatus = ''
        }

        if (!formData.applicationStatus) {
            newErrors.formData.applicationStatus = 'Application Status is required!';
            isValid = false;
        } else {
            newErrors.formData.applicationStatus = ''
        }

        // Addresses validation
        formData.person.contact.addresses.forEach((address, index) => {
            let addressErrors = {addressType: '', street: '', city: '', state: '', zipcode: '', country: '' }
            if (address) {
                console.log('Found addresses')
                if (!address.addressType) {
                    console.log('Address Type required')
                    addressErrors.addressType = 'Address type is required!';
                    isValid = false;
                } else if (address.addressType.trim() === '') {
                    addressErrors.addressType = 'Address type cannot be empty!';
                    isValid = false;
                } else if (address.addressType.trim() !== address.addressType) {
                    addressErrors.addressType = 'Address type cannot have leading or trailing spaces!';
                    isValid = false;
                }

                if (!address.street) {
                    addressErrors.street = 'Street is required!';
                    isValid = false;
                } else if (address.street.length < 5) {
                    addressErrors.street = 'Street address must be at least 5 characters!';
                    isValid = false;
                } else if (address.street.trim() !== address.street) {
                    addressErrors.street = 'Street address cannot have leading or trailing spaces!';
                    isValid = false;
                }
                    
                if (!address.city) {
                    addressErrors.city = 'City is required!';
                    isValid = false;
                } else if (address.city.length < 2) {
                    addressErrors.city = 'City must be at least 2 characters!';
                    isValid = false;
                } else if (address.city.trim() !== address.city) {
                    addressErrors.city = 'City cannot have leading or trailing spaces!';
                    isValid = false;
                }
                    
                if (address.state && address.state.length < 2) {
                    addressErrors.state = 'State must be at least 2 characters!';
                    isValid = false;
                } else if (address.state.trim() !== address.state) {   
                    addressErrors.state = 'State cannot have leading or trailing spaces!';
                    isValid = false;
                }
                    
                if (address.zipcode && address.zipcode.trim() !== address.zipcode) {
                    addressErrors.zipcode = 'Zipcode cannot have leading or trailing spaces!';
                    isValid = false;
                }

                if (!address.country) {
                    addressErrors.country = 'Country is required!';
                    isValid = false;
                } else if (address.country.trim() !== address.country) {
                    addressErrors.country = 'Country cannot have leading or trailing spaces!';
                    isValid = false;
                } else if (address.country.length < 2) {
                    addressErrors.country = 'Country must be at least 2 characters!';
                    isValid = false;
                } else if (address.country.length > 56) {
                    addressErrors.country = 'Country cannot exceed 56 characters!';
                    isValid = false;
                }
            }
            newErrors.formData.person.contact.addresses[index] = addressErrors
        })

        // Phones validation
        formData.person.contact.phones.forEach((phone, index) => {
            let phoneErrors = { phoneType: '', countryCode: '', number: '' }
            if (phone) {
                if (phone.phoneType.trim() === '') {
                    phoneErrors.phoneType = 'Phone type cannot be empty!';  
                    isValid = false;
                } else if (phone.phoneType.trim() !== phone.phoneType) {
                    phoneErrors.phoneType = 'Phone type cannot have leading or trailing spaces!';
                    isValid = false;
                }

                if (phone.number.length < 7 || phone.number.length > 15) {
                    phoneErrors.number = 'Phone number must be between 7 and 15 digits!'; 
                    isValid = false;
                } else if (!/^\d+$/.test(phone.number)) {
                    phoneErrors.number = 'Phone number must contain only digits!';
                    isValid = false;
                } else if (phone.number.trim() !== phone.number) {
                    phoneErrors.number = 'Phone number cannot have leading or trailing spaces!';
                    isValid = false;
                }

                //if (!/^\+\d{1,4}$/.test(formData.person.contact.phones[0].countryCode)) { 
                if (!CountryCodeRegex.test(phone.countryCode)) {
                    phoneErrors.countryCode = 'Country code must be in format +123!';  
                    isValid = false;
                } else if (phone.countryCode.trim() !== phone.countryCode) {
                    phoneErrors.countryCode = 'Country code cannot have leading or trailing spaces!';
                    isValid = false;
                }
            }
            newErrors.formData.person.contact.phones[index] = phoneErrors
        })
        
        // Emails validation
        formData.person.contact.emails.forEach((email, index) => {
            let emailErrors = { emailType: '', address: '' }
            if (email) {
                if(!email.emailType) {
                    emailErrors.emailType = 'Email type is required!';  
                    isValid = false;
                } else if (email.emailType.trim() === '') {
                    emailErrors.emailType = 'Email type cannot be empty!';  
                    isValid = false;
                } else if (email.emailType.trim() !== email.emailType) {
                    emailErrors.emailType = 'Email type cannot have leading or trailing spaces!';
                    isValid = false;
                }

                if(email.address.length === 0) {
                    emailErrors.address = 'Email address cannot be empty!';  
                    isValid = false;
                } else if(email.address.trim() === '') {
                    emailErrors.address = 'Email address cannot be empty or just spaces!';  
                    isValid = false;
                } else if(email.address.trim() !== email.address) {
                    emailErrors.address = 'Email address cannot have leading or trailing spaces!';
                    isValid = false;
                } else if (email.address.length < 5) {
                    emailErrors.address = 'Email address must be at least 5 characters!';  
                    isValid = false;
                } else if (email.address.length > 100) {
                    emailErrors.address = 'Email address cannot exceed 100 characters!';  
                    isValid = false;
                } else if (!emailRegex.test(email.address)) {
                    emailErrors.address = 'Email address format is invalid!';  
                    isValid = false;
                }
            }
            newErrors.formData.person.contact.emails[index] = emailErrors;
        })

        setFormErrors(newErrors);
        return isValid;
    }

    const renderPersonForm = (entry, arrayName, index, title) => {
        return (
            <PersonForm 
                key={index}
                entry={entry}
                arrayName={arrayName}
                index={index}
                title={title}
                removePersonFromArray={removePersonFromArray}
                updatePersonInArray={updatePersonInArray}
                addContactForPerson={addContactForPerson}
                updateContactForPerson={updateContactForPerson}
                removeContactForPerson={removeContactForPerson}
            />
        )
    }

    // Personal Information
    const renderPersonalInfo = () => {
        return (
            <PersonalInfoForm
                formData={formData}
                updateFormData={updateFormData}
                updateMainPerson={updateMainPerson}
                addContact={addContact}
                removeContact={removeContact}
                updateContact={updateContact}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
            />
        )
    }

    // Family Info
    const renderFamilyInfo = () => {
        return (
            <FamilyInfo
                formData={formData}
                addPersonToArray={addPersonToArray}
                renderPersonForm={renderPersonForm}
             />
        )
    }

    // Parents Information
    const renderParentsInfo = () => {
        return (
            <ParentsForm
                formData={formData}
                addPersonToArray={addPersonToArray}
                renderPersonForm={renderPersonForm}
             />
        )
    }

    // Siblings Information
    const renderSiblingsInfo = () => {
        return (
            <SiblingsForm
                formData={formData}
                addPersonToArray={addPersonToArray}
                renderPersonForm={renderPersonForm}
             />
        )
    }

    // Reference Information
    const renderReferenceInfo = () => {
        return (
            <RefereesForm
                formData={formData}
                addPersonToArray={addPersonToArray}
                renderPersonForm={renderPersonForm}
            />
        )
    }

    // Club Relatives
    const renderClubRelatives = () => {
        return (
            <ClubRelativesForm 
                formData={formData}
                addPersonToArray={addPersonToArray}
                renderPersonForm={renderPersonForm}
             />
        )
    }

    // Beneficiaries
    const renderBeneficiaries = () => {
        return (
            <BeneficiariesForm 
                formData={formData}
                addPersonToArray={addPersonToArray}
                renderPersonForm={renderPersonForm}
            />
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

    if (isSubmitted) {
        return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
            <h2>Application Submitted Successfully!</h2>
            <p>You will be redirected to the previous page shortly...</p>
            {/* Optional: Add a manual "Go Back" button */}
            <button 
                onClick={() => navigate(-1)} 
                className="btn btn-primary mt-3"
            >
                Go Back Now
            </button>
        </div>
        );
    }

    return (
        <>
            {
                isAuthenticated ? (
                    <>
                        {/* loading && <LoadingSpinner caption={'Application...'} clsTextColor={"text-primary"} /> */}
                        { loading ? (
                            <LoadingSpinner caption={'Application...'} clsTextColor={"text-primary"} />
                        ) : (
                            <div className={`card my-3 border ${cardBorderColor} shadow-lg`}>
                                <div className={`card-header text-white position-sticky ${headerBgColor}`}  style={{ top: '56px', zIndex: 100 }}>
                                    <h5 className="card-title">{title}</h5>
                                    <span>App No.: {formData.applicationNumber}</span>
                                </div>
                                {/* New Progress Bar */}
                                <div className='card-body px-1 px-sm-3'>
                                    <div className="container pt-2 mb-8 position-sticky bg-white"  style={{ top: '129px', zIndex: 100, borderBottom: '1px solid #dee2e6' }}>
                                        <div className="row mb-2">
                                            {steps.map((step, index) => {
                                                const IconComponent = step.icon;
                                                return (
                                                    <>
                                                        {/* Highlight current and completed steps with a different background color and border */}
                                                        <div key={index} className={`col d-flex px-0 px-md-2 justify-content-center
                                                            ${(currentStep + 1) >= step.number
                                                                ? 'fw-bold border border-3 border-primary rounded'
                                                                : ''
                                                            }
                                                            `}
                                                            style={{ 
                                                                backgroundColor: (currentStep + 1) >= step.number ? '#d5f3ff' : '',
                                                                transition: 'background-color 0.3s, border-color 0.3s', 
                                                                }}
                                                        >
                                                            <div className="d-flex flex-column mb-1">
                                                                <div className="d-flex justify-content-center">
                                                                    <div className={`rounded-circle mt-1 p-2
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
                                                    </>
                                                )
                                            })}
                                        </div>
                                        <div className="row mb-0">
                                            <ProgressBar now={`${((currentStep + 1) / steps.length) * 100}`} label={`Step ${currentStep + 1}`} className='bg-white' />
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col">
                                                <span className="small mb-0 fw-bold">Step {currentStep + 1} of {steps.length + 1}</span>
                                            </div>
                                            <div className="col">
                                                <span className="small mb-0 fw-bold">{Math.round(((currentStep) / (steps.length)) * 100)}% Complete</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Content */}
                                    <div className="p-6">
                                        <fieldset disabled={loading || saving}> {/* Disable form interactions when loading or saving */}
                                            {renderStep()}
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="text-center my-2">
                                        <button type="button" onClick={prevStep} className="btn btn-outline-primary mx-2 mx-xl-3" disabled={(currentStep === 0) || loading || saving} title='Previous Step'>
                                            <ArrowLeftCircleFill size={20} className="m-0 me-sm-1 mb-1" />
                                            <span className="d-none d-sm-inline-block">Prev</span>
                                        </button>
                                        <button type='button' onClick={cancel} className="btn btn-outline-danger mx-2 mx-xl-3" disabled={loading || saving} title='Cancel Membership Application'>
                                            <span className="d-none d-sm-inline-block">Cancel</span>
                                            <XCircleFill size={20} className="m-0 ms-sm-1 mb-1" />
                                        </button>
                                        <button type="submit" onClick={(e) => onSave(e)} className="btn btn-primary mx-2 mx-xl-3" disabled={loading || saving} title='Save Membership Application'>
                                            <span className="d-none d-sm-inline-block">
                                                { saving ? 'Saving...' : 'Save' }
                                            </span>
                                            <Floppy2 size={20} className="m-0 ms-sm-1 mb-1" />
                                        </button>
                                        <ConfirmationModal
                                            show={show}
                                            message={confirmMsg}
                                            onConfirm={handleConfirm}
                                            onCancel={handleCancel}
                                        />
                                        {currentStep < (steps.length) ? (
                                            <button type="button" onClick={nextStep} className="btn btn-outline-primary mx-2 mx-xl-3" disabled={loading || saving} title='Next Step'>
                                                <span className="d-none d-sm-inline-block">Next</span>
                                                <ArrowRightCircleFill size={20} className="m-0 ms-sm-1 mb-1" />
                                            </button>
                                        ) : (
                                            <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-success mx-2 mx-xl-3" disabled={loading || saving} title='Submit Membership Application'>
                                                <span className="d-none d-sm-inline-block">
                                                    { loading ? 'Sending...' : 'Submit' }
                                                </span>
                                                <SendCheck size={20} className="m-0 ms-sm-1 mb-1" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                    </>
                ) : (
                    <div className="container my-3 p-2">
                        <h3 className="text-primary text-center">Loading...</h3>
                    </div>
                )
            }
            
        </>
    );
};

DraftApplication.propTypes = {
    title: PropTypes.string,
    headerBgColor: PropTypes.string,
    cardBorderColor: PropTypes.string,
};

export default DraftApplication;