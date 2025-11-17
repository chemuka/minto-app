import PropTypes from 'prop-types'
import { EnvelopeAt, EnvelopeFill, GeoAlt, Plus, Telephone, Trash } from 'react-bootstrap-icons'
import countriesData from '../../../assets/data/countries.json';

const PersonForm = (props) => {
    const { entry, arrayName, index, title, setFormData } = props
    
    console.log('Entry:', entry)

    let person, extraFields = {}
    switch (arrayName) {
    case 'parents':
    case 'children':
    case 'sibling':
    case 'referees':
        person = entry.person
        break
    case 'spouses':
        person = entry.spouse.person
        extraFields.maritalStatus = entry.spouse.maritalStatus
        break
    case 'relatives':
        person = entry.person
        extraFields.familyRelationship = entry.familyRelationship
        break
    case 'beneficiaries':
        person = entry.beneficiary.person
        extraFields.percentage = entry.beneficiary.percentage
        break
    default:
        person = entry
    }

    const updatePersonInArray = (arrayName, index, field, value, subField = null) => {
        setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].map((entry, i) => {
            if (i === index) {
                switch (arrayName) {
                    case 'parents':
                    case 'children':
                    case 'sibling':
                    case 'referees':
                        if (subField) {
                            return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                        }
                        return { ...entry, person: { ...entry.person, [field]: value } }
                        
                    case 'spouses':
                        if (field === 'maritalStatus') {
                            return { ...entry, spouse: { ...entry.spouse, maritalStatus: value } }
                        }
                        if (subField) {
                            return { ...entry, spouse: { ...entry.spouse, person: { ...entry.spouse.person, [field]: { ...entry.spouse.person[field], [subField]: value } } } }
                        }
                        return { ...entry, spouse: { ...entry.spouse, person: { ...entry.spouse.person, [field]: value } } }
                    
                    case 'relatives':
                        if (field === 'familyRelationship') {
                            return { ...entry, familyRelationship: value }
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

    const removePersonFromArray = (arrayName, index) => {
        setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index)
        }));
    }

    const addContactForPerson = (arrayName, personIndex, contactType) => {
        const newContact = contactType === 'addresses' 
        ? { type: "", street: "", city: "", state: "", zipcode: "", country: "" }
        : contactType === 'emails'
        ? { type: "", address: "" }
        : { type: "", countryCode: "", number: "" }

        setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].map((entry, i) => {
            if (i === personIndex) {
                let personObj
                switch (arrayName) {
                    case 'parents':
                    case 'children':
                    case 'sibling':
                    case 'referees':
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
                    
                    case 'spouses':
                        personObj = entry.spouse.person
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
                        }
                    
                    case 'relatives':
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
                    
                    case 'beneficiaries':
                        personObj = entry.beneficiary.person
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
                        }
                    
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
                let personObj
                switch (arrayName) {
                    case 'parents':
                    case 'children':
                    case 'sibling':
                    case 'referees':
                        personObj = entry.person
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
                    
                    case 'spouses':
                        personObj = entry.spouse.person
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
                        }
                    
                    case 'relatives':
                        personObj = entry.person
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
                    
                    case 'beneficiaries':
                        personObj = entry.beneficiary.person
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
                    case 'children':
                    case 'sibling':
                    case 'referees':
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
                    
                    case 'spouses':
                        personObj = entry.spouse.person
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
                        }
                    
                    case 'relatives':
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
                    
                    case 'beneficiaries':
                        personObj = entry.beneficiary.person
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
                        }
                    
                    default:
                        return entry;
                }
            }
            return entry;
        })
        }))
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
                                        value={extraFields.familyRelationship}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'familyRelationship', e.target.value)}
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

PersonForm.propTypes = {
    entry: PropTypes.object, 
    arrayName: PropTypes.string, 
    index: PropTypes.number, 
    title: PropTypes.string,
    setFormData: PropTypes.func,
}

export default PersonForm
