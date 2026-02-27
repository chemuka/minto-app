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
import { defaultErrors } from '../../../model/defaultErrors';
import { validators } from '../../validate/validators';

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
    const [formErrors, setFormErrors] = useState({ ...defaultErrors })
    const [complete, setComplete] = useState(false)
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

        setFormErrors(prev => ({ ...prev,
            person: { ...prev.person,
                contact: { ...prev.person.contact,
                    [type]: prev.person.contact[type].map((contact, i) => 
                        i === index ? { ...contact, [field]: "" } : contact
                    )
                }
            }
        }))
    }

    const updateMainPerson = (field, value) => {
        setFormData(prev => ({ ...prev,
            person: {
                ...prev.person, [field]: value
            }
        }))

        setFormErrors(prev => ({ ...prev, 
            person: {
                ...prev.person, [field]: ""
            }
        }))
    }

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setFormErrors(prev => ({ ...prev, [field]: "" }));
    }

    const nextStep = () => {
        if(validateStep(currentStep)) {
            if (currentStep < steps.length) {
                setCurrentStep(currentStep + 1);
            }
        } else {
            console.log('Invalid form! Please correct the errors before proceeding to the next step.')
            toast.error('Invalid form! Please correct the errors.')
        }
    }

    const prevStep = () => {
        if(validateStep(currentStep)) {
            if (currentStep > 0) {
                setCurrentStep(currentStep - 1);
            }
        } else {
            console.log('Invalid form! Please correct the errors before proceeding to the next step.')
            toast.error('Invalid form! Please correct the errors before proceeding to the next step.')
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

        try {
            if(isAuthenticated) {
                if (validateStep(currentStep)) {
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
                    setFormErrors({})
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
                setFormErrors({})
            }
        } catch (error) {
            console.error('Error submitting application:', error)
            toast.error('Error submitting application: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    /**
     * Returns true if any string value within the nested data structure is an empty
     * string (or a string with only whitespaces), and false otherwise
     */
    const hasEmptyString = (data) => {
        // 1. Check if the current value is a string
        if (typeof data === 'string') {
            // Return true if the string is empty or contains only whitespace
            return data.trim().length === 0;
        }

        // 2. Check if the current value is an array
        if (Array.isArray(data)) {
            // Iterate over the array elements
            for (const item of data) {
                // Recursively call the function for each element
                if (hasEmptyString(item)) {
                    return true; // Found an empty string in a nested structure
                }
            }
        }

        // 3. Check if the current value is an object (and not null)
        if (typeof data === 'object' && data !== null) {
            // Iterate over the object's values
            for (const value of Object.values(data)) {
                // Recursively call the function for each value
                if (hasEmptyString(value)) {
                    return true; // Found an empty string in a nested structure
                }
            }
        }

        // If none of the above conditions returned true, there are no empty strings
        return false;
    };

    /**
     * Recursively checks if all string values in an array or object are empty strings.
     * Considers null, undefined, false, 0, and empty arrays/objects as "empty" in this context.
     * 
     * @param {*} val The value to check.
     * @returns {boolean} True if all values are empty, false otherwise.
     */
    const areAllEmptyStrings = (val) => {
        // Check for primitive falsy values (null, undefined, false, 0, "")
        if (!val && val !== 0 && val !== false) {
            return true;
        }

        // If it is an array or object, recursively check its contents
        if (typeof val === "object" && val !== null) {
            const values = Array.isArray(val) ? val : Object.values(val);
            // Use Array.prototype.every() to check if all elements satisfy the condition
            // For an empty array, every() returns true (vacuously true).
            return values.every(areAllEmptyStrings);
        }
        
        // For other non-falsy primitive types (like numbers, booleans, or non-empty strings), 
        // it is not "empty" according to the requirement, so return false.
        return false;
    };

    const validatePerson = (obj) => {
        let person = { 
            firstName: '', middleName: '', lastName: '', dob: '', lifeStatus: '', 
            contact: {
                addresses: [],
                emails: [],
                phones: []
            } 
        }
        person.firstName = validators.name(obj.person.firstName);
        person.middleName = validators.optionalString(2)(obj.person.middleName)
        person.lastName = validators.name(obj.person.lastName)
        person.dob = validators.required(obj.person.dob) || validators.dob(obj.person.dob)
        person.lifeStatus = validators.required(obj.person.lifeStatus)

        // Reset Addresses Errors
        person.contact.addresses = [];
        // Addresses validation
        obj.person.contact.addresses.forEach((address, index) => {
            let addressErrors = { addressType: "", street: "", city: "", state: "", zipcode: "", country: "" };
            addressErrors.addressType = validators.required(address.addressType);
            addressErrors.street = validators.street(address.street);
            addressErrors.city = validators.required(address.city);
            addressErrors.state = validators.optionalString(2)(address.state);
            addressErrors.zipcode = validators.optionalString(3)(address.zipcode);
            addressErrors.country = validators.required(address.country);
            person.contact.addresses[index] = addressErrors;
        });

        // Reset Emails Errors
        person.contact.emails = [];
        // Emails validation
        obj.person.contact.emails.forEach((email, index) => {
            let emailErrors = { emailType: '', address: ''};
            emailErrors.emailType = validators.required(email.emailType);
            emailErrors.address = validators.email(email.address);
            person.contact.emails[index] = emailErrors;
        });

        // Reset Phones Errors
        person.contact.phones = [];
        // Phones validation
        obj.person.contact.phones.forEach((phone, index) => {
            let phoneErrors = { phoneType: '', countryCode: '', number: '' }
            phoneErrors.phoneType = validators.required(phone.phoneType);
            phoneErrors.countryCode = validators.countryCode(phone.countryCode);
            phoneErrors.number = validators.phone(phone.number);
            person.contact.phones[index] = phoneErrors;
        })

        return person
    }

    const validateStep = (s = currentStep) => {
        const e = { ...defaultErrors }
        
        if (s === 0) { // Step 1: Personal Info
            e.applicationStatus = validators.required(formData.applicationStatus)
            e.person.firstName = validators.name(formData.person.firstName);
            e.person.middleName = validators.optionalString(2)(formData.person.middleName)
            e.person.lastName = validators.name(formData.person.lastName)
            e.person.dob = validators.required(formData.person.dob) || validators.dob(formData.person.dob)
            e.person.lifeStatus = validators.required(formData.person.lifeStatus)
            e.maritalStatus = validators.required(formData.maritalStatus)

            // Reset Addresses Errors
            e.person.contact.addresses = [];
            // Addresses validation
            formData.person.contact.addresses.forEach((address, index) => {
                let addressErrors = { addressType: "", street: "", city: "", state: "", zipcode: "", country: "" };
                addressErrors.addressType = validators.required(address.addressType);
                addressErrors.street = validators.street(address.street);
                addressErrors.city = validators.required(address.city);
                addressErrors.state = validators.optionalString(2)(address.state);
                addressErrors.zipcode = validators.optionalString(3)(address.zipcode);
                addressErrors.country = validators.required(address.country);
                e.person.contact.addresses[index] = addressErrors;
            });

            // Reset Emails Errors
            e.person.contact.emails = [];
            // Emails validation
            formData.person.contact.emails.forEach((email, index) => {
                let emailErrors = { emailType: '', address: ''};
                emailErrors.emailType = validators.required(email.emailType);
                emailErrors.address = validators.email(email.address);
                e.person.contact.emails[index] = emailErrors;
            });

            // Reset Phones Errors
            e.person.contact.phones = [];
            // Phones validation
            formData.person.contact.phones.forEach((phone, index) => {
                let phoneErrors = { phoneType: '', countryCode: '', number: '' }
                phoneErrors.phoneType = validators.required(phone.phoneType);
                phoneErrors.countryCode = validators.countryCode(phone.countryCode);
                phoneErrors.number = validators.phone(phone.number);
                e.person.contact.phones[index] = phoneErrors;
            })
        }
        
        if (s === 1) { // Step 2: Family Info
            e.spouses = []
            formData.spouses.forEach((spouse, index) => {
                let personErrors = validatePerson(spouse);
                let spouseErrors = { maritalStatus: '', person: {} };
                spouseErrors.maritalStatus = validators.required(spouse.maritalStatus);
                spouseErrors.person = personErrors
                e.spouses[index] = spouseErrors;
            })

            e.children = []
            formData.children.forEach((child, index) => {
                let personErrors = validatePerson(child);
                let childErrors = { childType: '', person: {} };
                childErrors.childType = validators.required(child.childType);
                childErrors.person = personErrors;
                e.children[index] = childErrors;
            })
        }
        
        if (s === 2) { // Step 3: Parent Info
            e.parents = []
            formData.parents.forEach((parent, index) => {
                let personErrors = validatePerson(parent);
                let parentErrors = { parentType: '', person: {} };
                parentErrors.parentType = validators.required(parent.parentType);
                parentErrors.person = personErrors;
                e.parents[index] = parentErrors;
            })
        }
        
        if (s === 3) { // Step 4: Sibling Info
            e.siblings = []
            formData.siblings.forEach((sibling, index) => {
                let personErrors = validatePerson(sibling);
                let siblingErrors = { siblingType: '', person: {} };
                siblingErrors.siblingType = validators.required(sibling.siblingType);
                siblingErrors.person = personErrors;
                e.siblings[index] = siblingErrors;
            })
        }

        if (s === 4) { // Step 5: Reference Info
            e.referees = []
            formData.referees.forEach((referee, index) => {
                let personErrors = validatePerson(referee);
                let refereeErrors = { membershipNumber: '', person: {} };
                refereeErrors.membershipNumber = validators.membershipNumber(referee.membershipNumber);
                refereeErrors.person = personErrors;
                e.referees[index] = refereeErrors;
            })
        }

        if (s === 5) { // Step 6: Relatives Info
            e.relatives = []
            formData.relatives.forEach((relative, index) => {
                let personErrors = validatePerson(relative);
                let relativeErrors = { membershipNumber: '', familyRelationship: '', person: {} };
                relativeErrors.familyRelationship = validators.required(relative.familyRelationship);
                relativeErrors.membershipNumber = validators.membershipNumber(relative.membershipNumber);
                relativeErrors.person = personErrors;
                e.relatives[index] = relativeErrors;
            })
        }

        if (s === 6) { // Step 7: Beneficiaries Info
            e.beneficiaries = []
            formData.beneficiaries.forEach((beneficiary, index) => {
                let personErrors = validatePerson(beneficiary);
                let beneficiaryErrors = { percentage: '', relationship: '', person: {} };
                beneficiaryErrors.relationship = validators.name(beneficiary.relationship);
                beneficiaryErrors.percentage = validators.percentage(beneficiary.percentage);
                beneficiaryErrors.person = personErrors;
                e.beneficiaries[index] = beneficiaryErrors;
            })
        }
        
        console.log(e)
        setFormErrors(e);
        return areAllEmptyStrings(e);
    }

    const renderPersonForm = (entry, arrayName, index, title, formErrors) => {
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
                formErrors={formErrors}
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
                formErrors={formErrors}
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
                formErrors={formErrors}
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
                formErrors={formErrors}
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
                formErrors={formErrors}
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
                formErrors={formErrors}
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
                formErrors={formErrors}
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