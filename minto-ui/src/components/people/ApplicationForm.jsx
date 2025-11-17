import { Link } from "react-router-dom"
import { useState } from "react"
import { ArrowLeftCircleFill, ArrowRightCircleFill, EnvelopeAt, Globe, GlobeAmericas, Plus, SendCheckFill, Telephone, XCircleFill } from "react-bootstrap-icons"
import countriesData from '../../assets/data/countries.json';

const ApplicationForm = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        applicationStatus: "Draft",
        person: {
            firstName: "",
            middleName: "",
            lastName: "",
            dob: "",
            lifeStatus: "",
            contact: {
                addresses: [],
                emails: [],
                phones: [],
            },
        },
        maritalStatus: "",
        parents: [],
        spouses: [],
        children: [],
        siblings: [],
        referees: [],
        relatives: [],
        beneficiaries: [],
    }); 

    const [person, setPerson] = useState(
        {
            firstName: "",
            middleName: "",
            lastName: "",
            dob: "",
            lifeStatus: "",
            contact: {
                addresses: [],
                emails: [],
                phones: [],
            },
        }
    );

    const [contact, setContact] = useState(
        {
            addresses: [],
            emails: [],
            phones: [],
        }
    );
    
    const onInputChange = (e) => {
        const newPerson = { ...person, [e.target.name]: e.target.value }
        setPerson(newPerson);
        setFormData({ ...formData, person: newPerson });
    };
    
    const updateFormData = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }
    
    
    const nextStep = () => {
        if(currentStep < 7)
            setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        if(currentStep > 1)
            setCurrentStep(currentStep - 1)
    }

    const handleSubmit = (e) => {
        e.preventDefault
        console.log('Person:', person)
        console.log('Form Data:', formData)
    
    }
/*
    const updatePerson = (field, value) => {
        const updatedPerson = { ...formData.person };
        updatedPerson[field] = value;
        setFormData({ ...formData, person: updatedPerson })
    }
*/
    const handleAddressChange = (index, field, value) => {
        const updatedAddresses = [...contact.addresses];
        updatedAddresses[index][field] = value;
        const newContact = { ...contact, addresses: updatedAddresses }
        const newPerson = { ...person, contact: newContact }
        setContact(newContact);
        setPerson(newPerson);
        setFormData({ ...formData, person: newPerson });
    };

    const handleEmailChange = (index, field, value) => {
        const updatedEmails = [...contact.emails];
        updatedEmails[index][field] = value;
        setContact({ ...contact, emails: updatedEmails });
        setPerson({ ...person, contact: contact });
        setFormData({ ...formData, person: person });
    };

    const handlePhoneChange = (index, field, value) => {
        const updatedPhones = [...contact.phones];
        updatedPhones[index][field] = value;
        setContact({ ...contact, phones: updatedPhones });
        setPerson({ ...person, contact: contact });
        setFormData({ ...formData, person: person });
    };

    const addAddress = () => {
        let newContacts = { ...contact };
        
        setContact((prevContacts) => {
          newContacts = { ...prevContacts, addresses: [...prevContacts.addresses, { type: '', street: '', city: '', state: '', zipcode: '', country: '' }] };
          return newContacts;
        });

        let newPerson = { ...person, contact: newContacts }
        setPerson((prevPerson) => {
            newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
        
        setFormData((prevFormData) => {
            const newFormData = { ...prevFormData, person: newPerson };
            return newFormData;
        });
    };

    const removeAddress = (id) => {
        let newContacts = { ...contact };
        console.log("Address Id: " + id);
        setContact((prevContacts) => {
            const updatedAddresses = [...prevContacts.addresses];
            updatedAddresses.splice(id, 1);
            newContacts = { ...prevContacts, addresses: updatedAddresses };
            return newContacts;
        });

        let newPerson = { ...person }
        setPerson((prevPerson) => {
            newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });

        setFormData((prevFormData) => {
            const newFormData = { ...prevFormData, person: newPerson };
            return newFormData;
        });
    };

    const addEmail = () => {
        let newContacts = { ...contact };
        
        setContact((prevContacts) => {
          newContacts = { ...prevContacts, emails: [...prevContacts.emails, { type: '', address: '' }] };
          return newContacts;
        });

        let newPerson = { ...person }
        setPerson((prevPerson) => {
            newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
        
        setFormData((prevFormData) => {
            const newFormData = { ...prevFormData, person: newPerson };
            return newFormData;
        });
    };

    const removeEmail = (id) => {
        let newContacts = { ...contact };
        console.log("Email Id: " + id);
        setContact((prevContacts) => {
            const updatedEmails = [...prevContacts.emails];
            updatedEmails.splice(id, 1);
            newContacts = { ...prevContacts, emails: updatedEmails };
            return newContacts;
        });

        let newPerson = { ...person }
        setPerson((prevPerson) => {
            newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
        
        setFormData((prevFormData) => {
            const newFormData = { ...prevFormData, person: newPerson };
            return newFormData;
        });
    }

    const addPhone = () => {
        let newContacts = { ...contact };
        
        setContact((prevContacts) => {
          newContacts = { ...prevContacts, phones: [...prevContacts.phones, { type: '', countryCode: '',  number: '' }] };

          return newContacts;
        });

        let newPerson = { ...person }
        setPerson((prevPerson) => {
            newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
        
        setFormData((prevFormData) => {
            const newFormData = { ...prevFormData, person: newPerson };
            return newFormData;
        });
    };

    const removePhone = (id) => {
        let newContacts = { ...contact };
        console.log("Phone Id: " + id);
        setContact((prevContacts) => {
            const updatedPhones = [...prevContacts.phones];
            updatedPhones.splice(id, 1);
            newContacts = { ...prevContacts, phones: updatedPhones };
            return newContacts;
        });

        let newPerson = { ...person }
        setPerson((prevPerson) => {
            newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
        
        setFormData((prevFormData) => {
            const newFormData = { ...prevFormData, person: newPerson };
            return newFormData;
        });
    }

    const renderStep1 = () => (
        <>
            <div>
                <div className="form-group row">
                    <h5 className="text-primary">Personal Details:</h5>
                    <div className="col-sm-4 mb-3">
                        <div className="input-group">
                            <span className="input-group-text">First Name</span>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder="Enter first name"
                                name="firstName"
                                value={person.firstName}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                    </div>
                    <div className="col-sm-4 mb-3">
                        <div className="input-group">
                            <span className="input-group-text">Middle Name</span>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder="Enter middle name"
                                name="middleName"
                                value={person.middleName}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                    </div>
                    <div className="col-sm-4 mb-3">
                        <div className="input-group">
                            <span className="input-group-text">Last Name</span>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder="Enter last name"
                                name="lastName"
                                value={person.lastName}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-6 mb-3">
                        <div className="input-group">
                            <span className="input-group-text">DOB</span>
                            <input
                                type={"date"}
                                className="form-control"
                                name="dob"
                                value={person.dob}
                                onChange={(e) => onInputChange(e)}
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
                                value={person.lifeStatus}
                                onChange={(e) => onInputChange(e)}
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
                            <input
                                type={"text"}
                                className="form-control"
                                name="applicationStatus"
                                value={formData.applicationStatus}
                                onChange={(e) => updateFormData('applicationStatus', e.target.value)}
                                disabled
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </div>

            { person.contact.addresses.map((address, index) => (
                <div key={index}>
                    <hr />
                    <div className="d-flex justify-content-between mb-3">
                        <h5>Address {index + 1}:</h5>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={removeAddress}>
                            <XCircleFill size={20} />
                        </button>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-3 mb-3">
                            <div className="input-group">
                                <span className="input-group-text">Type</span>
                                <select name={`address-type-${index}`} id={`address-type-${index}`}
                                    className="form-select"
                                    value={address.type}
                                    onChange={(e) => handleAddressChange(index, 'type', e.target.value)}>
                                    <option value="">Choose...</option>
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="School">School</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-5 mb-3">
                            <div className="input-group">
                                <span className="input-group-text">Street</span>
                                <input
                                    type={"text"} id={`street-${index}`}
                                    className="form-control"
                                    placeholder="Enter street address"
                                    name={`street-${index}`}
                                    value={address.street}
                                    onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-sm-4 mb-3">
                            <div className="input-group">
                                <span className="input-group-text">City</span>
                                <input
                                    type={"text"} id={`city-${index}`}
                                    className="form-control"
                                    placeholder="Enter city"
                                    name={`city-${index}`}
                                    value={address.city}
                                    onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-4 mb-3">
                            <div className="input-group">
                                <span className="input-group-text">State</span>
                                <input
                                    type={"text"} id={`state-${index}`}
                                    className="form-control"
                                    placeholder="Enter state"
                                    name={`state-${index}`}
                                    value={address.state}
                                    onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-sm-4 mb-3">
                            <div className="input-group">
                                <span className="input-group-text">Zip Code</span>
                                <input
                                    type={"text"} id={`zipcode-${index}`}
                                    className="form-control"
                                    placeholder="Enter zip code"
                                    name={`zipcode-${index}`}
                                    value={address.zipcode}
                                    onChange={(e) => handleAddressChange(index, 'zipcode', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-sm-4 mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <GlobeAmericas />
                                </span>
                                <select 
                                    className="form-select"
                                    id={`country-${index}`}
                                    name={`country-${index}`}
                                    value={address.country}
                                    onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                                >
                                    <option value="">Choose...</option>
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
        
            { person.contact.emails.map((email, index) => (
                <div key={index}>
                    <hr />
                    <div className="d-flex justify-content-between mb-3">
                        <h5>Email Address {index + 1}:</h5>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={removeEmail}>
                            <XCircleFill size={20} />
                        </button>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-4 mb-3">
                            <div className="input-group">
                                <span className="input-group-text">Type</span>
                                <select name={`email-type-${index}`} id={`email-type-${index}`}
                                    className="form-select"
                                    value={email.type}
                                    onChange={(e) => handleEmailChange(index, 'type', e.target.value)}>
                                    <option value="">Choose...</option>
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="School">School</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-8 mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <EnvelopeAt />
                                </span>
                                <input
                                    type={"text"} id={`address-${index}`}
                                    className="form-control"
                                    placeholder="Enter email address"
                                    name={`address-${index}`}
                                    value={email.address}
                                    onChange={(e) => handleEmailChange(index, 'address', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            { person.contact.phones.map((phone, index) => (
                <div key={index}>
                    <hr />
                    <div className="d-flex justify-content-between mb-3">
                        <h5>Phone {index + 1}:</h5>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={removePhone}>
                            <XCircleFill size={20} />
                        </button>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-4 mb-3">
                            <div className="input-group">
                                <span className="input-group-text">Type</span>
                                <select name={`phone-type-${index}`} id={`phone-type-${index}`}
                                    className="form-select"
                                    value={phone.type}
                                    onChange={(e) => handlePhoneChange(index, 'type', e.target.value)}>
                                    <option value="">Choose...</option>
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="School">School</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-3 mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <Globe />
                                </span>
                                <select 
                                    id={`country-code-${index}`}
                                    className="form-select"
                                    name={`country-code-${index}`}
                                    value={phone.countryCode}
                                    onChange={(e) => handlePhoneChange(index, 'countryCode', e.target.value)}
                                >
                                    <option value="">Choose...</option>
                                    {countriesData.map((country) => (
                                        <option key={country.cca2} value={`+${country.code}`}>
                                            {country.flag} +{country.code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-5 mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <Telephone />
                                </span>
                                <input
                                    type={"text"} id={`number-${index}`}
                                    className="form-control"
                                    placeholder="Phone number"
                                    name={`number-${index}`}
                                    value={phone.number}
                                    onChange={(e) => handlePhoneChange(index, 'number', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="text-center">
                <button type="button" className="btn btn-success mx-2 my-2" onClick={addAddress}>
                    <Plus className="mb-1" color="white" size={21} />Address
                </button>
                <button type="button" className="btn btn-success mx-2 my-2" onClick={addEmail}>
                    <Plus className="mb-1" color="white" size={21} />Email
                </button>
                <button type="button" className="btn btn-success mx-2 my-2" onClick={addPhone}>
                    <Plus className="mb-1" color="white" size={21} />Phone
                </button>
            </div>
        </>
    )

    const renderStep2 = () => (
        <div>
            <div className="form-group row">
                <h5 className="text-primary">Parent&apos;s Info:</h5>
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div>
            <div className="form-group row">
                <h5 className="text-primary">Family Info:</h5>
            </div>
        </div>
    )

    const renderStep4 = () => (
        <div>
            <div className="form-group row">
                <h5 className="text-primary">Siblings Info:</h5>
            </div>
        </div>
    )

    const renderStep5 = () => (
        <div>
            <div className="form-group row">
                <h5 className="text-primary">Reference Info:</h5>
            </div>
        </div>
    )

    const renderStep6 = () => (
        <div>
            <div className="form-group row">
                <h5 className="text-primary">Club Relatives:</h5>
            </div>
        </div>
    )

    const renderStep7 = () => (
        <div>
            <div className="form-group row">
                <h5 className="text-primary">Beneficiaries:</h5>
            </div>
        </div>
    )

    const renderCurrentStep = () => {
        switch(currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            case 5: return renderStep5();
            case 6: return renderStep6();
            case 7: return renderStep7();
            default: return renderStep1();
        }
    }

  return (
    <>
        <div className="container mt-5 pt-4">
            <div className='card my-3 border shadow'>
                <div className="card-header text-white bg-success">
                    <h3 className="card-title">Membership Application Form</h3>
                </div>
                <div className="card-body">
                    { renderCurrentStep() }
                </div>
                <div className="card-footer">
                    <div className="text-center my-2">
                        <button type="button" onClick={prevStep} className="btn btn-outline-primary mx-3" disabled={currentStep === 1}>
                            <ArrowLeftCircleFill size={20} className="m-0 me-md-1 mb-1" />
                            <span className="d-none d-md-inline-block">Prev</span>
                        </button>
                        <Link className="btn btn-outline-danger mx-3" to="/viewall">
                            <span className="d-none d-md-inline-block">Cancel</span>
                            <XCircleFill size={20} className="m-0 ms-md-1 mb-1" />
                        </Link>
                        {currentStep < 7 ? (
                            <button type="button" onClick={nextStep} className="btn btn-outline-primary mx-3">
                                <span className="d-none d-md-inline-block">Next</span>
                                <ArrowRightCircleFill size={20} className="m-0 ms-md-1 mb-1" />
                            </button>
                        ) : (
                            <button type="submit" onClick={handleSubmit} className="btn btn-outline-primary mx-3">
                                <span className="d-none d-md-inline-block">Submit</span>
                                <SendCheckFill size={20} className="m-0 ms-md-1 mb-1" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default ApplicationForm
