import { EnvelopeAt, Globe, GlobeAmericas, Plus, Telephone, XCircleFill } from 'react-bootstrap-icons';
import countriesData from '../../../assets/data/countries.json';
import { useState } from 'react';
import PropTypes from 'prop-types'

const AppFormStep1 = (props) => {
    const { formData, updateFormData } = props
    
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
    /*
    const onInputChange = (e) => {
        setPerson({ ...person, [e.target.name]: e.target.value });
        updateFormData(e);
    };
    */
    const handleAddressChange = (index, field, value) => {
        const updatedAddresses = [...contact.addresses];
        updatedAddresses[index][field] = value;
        setContact({ ...contact, addresses: updatedAddresses });
        setPerson({ ...person, contact: contact });
    };

    const handleEmailChange = (index, field, value) => {
        const updatedEmails = [...contact.emails];
        updatedEmails[index][field] = value;
        setContact({ ...contact, emails: updatedEmails });
        setPerson({ ...person, contact: contact });
    };

    const handlePhoneChange = (index, field, value) => {
        const updatedPhones = [...contact.phones];
        updatedPhones[index][field] = value;
        setContact({ ...contact, phones: updatedPhones });
        setPerson({ ...person, contact: contact });
    };

    const addAddress = () => {
        let newContacts = { ...contact };
 
        setContact((prevContacts) => {
          newContacts = { ...prevContacts, addresses: [...prevContacts.addresses, { type: '', street: '', city: '', state: '', zipcode: '', country: '' }] };
          return newContacts;
        });

        setPerson((prevPerson) => {
            const newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
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

        setPerson((prevPerson) => {
            const newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
    };

    const addEmail = () => {
        let newContacts = { ...contact };
        
        setContact((prevContacts) => {
          newContacts = { ...prevContacts, emails: [...prevContacts.emails, { type: '', address: '' }] };
          return newContacts;
        });

        setPerson((prevPerson) => {
            const newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
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

        setPerson((prevPerson) => {
            const newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
    }

    const addPhone = () => {
        let newContacts = { ...contact };
        
        setContact((prevContacts) => {
          newContacts = { ...prevContacts, phones: [...prevContacts.phones, { type: '', countryCode: '',  number: '' }] };

          return newContacts;
        });

        setPerson((prevPerson) => {
            const newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
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

        setPerson((prevPerson) => {
            const newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
    }

  return (
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
                            value={formData.person.firstName}
                            onChange={(e) => updateFormData(e)}
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
                            value={formData.person.middleName}
                            onChange={(e) => updateFormData(e)}
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
                            value={formData.person.lastName}
                            onChange={(e) => updateFormData(e)}
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
                            value={formData.person.dob}
                            onChange={(e) => updateFormData(e)}
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
                            onChange={(e) => updateFormData(e)}
                        >
                            <option value="">Choose...</option>
                            <option value="Living">Living</option>
                            <option value="Deceased">Deceased</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        
        { formData.person.contact.addresses.map((address, index) => (
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
                                    <option key={country.cca2} value={`${country.flag} +${country.code}`}>
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
}

AppFormStep1.propTypes = {
    formData: PropTypes.object,
    updateFormData: PropTypes.func,
}

export default AppFormStep1
