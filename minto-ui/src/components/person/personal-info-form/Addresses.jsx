import { GeoAlt, Plus, Trash } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import countriesData from '../../../assets/data/countries.json';
import { useState } from 'react';

const Addresses = (props) => {
    const { formData, updateContact, addContact, removeContact, formErrors } = props;
    const [errors, setErrors] = useState([])

    const validateAddressField = (index, field) => {    
        let isValid = true
        let newErrors = [ ...errors ]
        let addressError = { ...(newErrors[index] || {}) }
        const address = formData.person.contact.addresses[index]
        if (field === 'addressType') {
            if (!address.addressType) {
                addressError.addressType = 'Address type is required!';
                isValid = false
            } else if (address.addressType.trim() === '') {
                addressError.addressType = 'Address type cannot be empty!';
                isValid = false
            } else if (address.addressType.trim() !== address.addressType) {
                addressError.addressType = 'Address type cannot have leading or trailing spaces!';
                isValid = false
            }
        } else if (field === 'street') {
            if (!address.street) {
                addressError.street = 'Street is required!';
                isValid = false
            } else if (address.street.trim() !== address.street) {
                addressError.street = 'Street cannot have leading or trailing spaces!';
                isValid = false
            } else if (address.street.length < 5) {
                addressError.street = 'Street address must be at least 5 characters!';
                isValid = false
            }
        } else if (field === 'city') {
            if (!address.city) {
                addressError.city = 'City is required!';
                isValid = false
            } else if (address.city.trim() !== address.city) {
                addressError.city = 'City cannot have leading or trailing spaces!';
                isValid = false
            } else if (address.city.length < 2) {
                addressError.city = 'City must be at least 2 characters!';
                isValid = false
            }
        } else if (field === 'state') {
            if (address.state && address.state.trim() !== address.state) {
                addressError.state = 'State cannot have leading or trailing spaces!';
                isValid = false
            } else if (address.state && address.state.length < 2) {
                addressError.state = 'State must be at least 2 characters!';
                isValid = false
            }
        } else if (field === 'zipcode') {
            if (address.zipcode && address.zipcode.trim() !== address.zipcode) {
                addressError.zipcode = 'Zipcode cannot have leading or trailing spaces!';
                isValid = false
            }
        } else if (field === 'country') {
            if (!address.country) {
                addressError.country = 'Country is required!';
                isValid = false
            } else if (address.country.trim() !== address.country) {
                addressError.country = 'Country cannot have leading or trailing spaces!';
                isValid = false
            } else if (!countriesData.some(country => country.name === address.country)) {
                addressError.country = 'Please select a valid country!';
                isValid = false
            }
        } else {
            console.warn(`Unknown field "${field}" for address validation`)
        }

        newErrors[index] = addressError
        return { isValid, newErrors }
    }

    const handleValidate = (index, field) => {
        const {isValid, newErrors} = validateAddressField(index, field)
        console.log('newErrors after validation:', newErrors)
        if (!isValid) {
            setErrors(newErrors)
        } else {
            // Clear error for this field if validation passes
            if (newErrors[index]) {
                delete newErrors[index][field]
                setErrors(newErrors)
            }
        }
    }

    return (
        <>
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
            
                {formData.person.contact.addresses.map((address, index) => (
                    <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                        <div className="d-flex justify-content-between items-center mb-3">
                            <span className="font-medium"><strong>Address {index + 1}</strong></span>
                            {formData.person.contact.addresses.length >= 1 && (
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
                                        value={address.addressType || ''}
                                        onBlur={() => handleValidate(index, 'addressType')}
                                        onChange={(e) => updateContact('addresses', index, 'addressType', e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="School">School</option>
                                        <option value="Billing">Billing</option>
                                        <option value="Shipping">Shipping</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <label htmlFor={`address-type-${index}`}>Type*</label>
                                </div>
                                { formErrors.person.contact.addresses[index]?.addressType && (
                                    <div className="text-danger mt-1">{formErrors.person.contact.addresses[index].addressType}</div>
                                )}
                            </div>
                            <div className="col-sm-7 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`address-street-${index}`}
                                        type={"text"}
                                        placeholder="Street Address"
                                        value={address.street || ''}
                                        onBlur={() => handleValidate(index, 'street')}
                                        onChange={(e) => updateContact('addresses', index, 'street', e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                    <label htmlFor={`address-street-${index}`}>Street Address*</label>
                                </div>
                                { formErrors.person.contact.addresses[index]?.street && (
                                    <div className="text-danger mt-1">{formErrors.person.contact.addresses[index].street}</div>
                                )}
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-5 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`address-city-${index}`}
                                        type={"text"}
                                        placeholder="City"
                                        value={address.city || ''}
                                        onBlur={() => handleValidate(index, 'city')}
                                        onChange={(e) => updateContact('addresses', index, 'city', e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                    <label htmlFor={`address-city-${index}`}>City*</label>
                                </div>
                                { formErrors.person.contact.addresses[index]?.city && (
                                    <div className="text-danger mt-1">{formErrors.person.contact.addresses[index].city}</div>
                                )}
                            </div>
                            <div className="col-sm-7 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`address-state-${index}`}
                                        type={"text"}
                                        placeholder="State"
                                        value={address.state || ''}
                                        onBlur={() => handleValidate(index, 'state')}
                                        onChange={(e) => updateContact('addresses', index, 'state', e.target.value)}
                                        className="form-control"
                                    />
                                    <label htmlFor={`address-state-${index}`}>State</label>
                                </div>
                                { formErrors.person.contact.addresses[index]?.state && (
                                    <div className="text-danger mt-1">{formErrors.person.contact.addresses[index].state}</div>
                                )}
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-5 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`address-zipcode-${index}`}
                                        type={"text"}
                                        placeholder="ZIP Code"
                                        value={address.zipcode || ''}
                                        onBlur={() => handleValidate(index, 'zipcode')}
                                        onChange={(e) => updateContact('addresses', index, 'zipcode', e.target.value)}
                                        className="form-control"
                                    />
                                    <label htmlFor={`address-zipcode-${index}`}>Zip Code</label>
                                </div>
                                { formErrors.person.contact.addresses[index]?.zipcode && (
                                    <div className="text-danger mt-1">{formErrors.person.contact.addresses[index].zipcode}</div>
                                )}
                            </div>
                            <div className="col-sm-7 mb-3">
                                <div className="form-floating">
                                    <select 
                                        id={`country-${index}`}
                                        name={`country-${index}`}
                                        className="form-select"
                                        value={address.country || ''}
                                        onBlur={() => handleValidate(index, 'country')}
                                        onChange={(e) => updateContact('addresses', index, 'country', e.target.value)}
                                        required
                                    >
                                        <option key={'nil'} value="">-- Select --</option>
                                        {countriesData.map((country) => (
                                            <option key={country.cca2} value={country.name}>
                                                {country.flag} {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor={`country-${index}`}>Country*</label>
                                </div>
                                { formErrors.person.contact.addresses[index]?.country && (
                                    <div className="text-danger mt-1">{formErrors.person.contact.addresses[index].country}</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

Addresses.propTypes = {
    formData: PropTypes.object,
    updateContact: PropTypes.func,
    addContact: PropTypes.func,
    removeContact: PropTypes.func,
    formErrors: PropTypes.shape({
        person: PropTypes.shape({
            firstName: PropTypes.string,
            middleName: PropTypes.string,
            lastName: PropTypes.string,
            dob: PropTypes.string,
            lifeStatus: PropTypes.string,
            maritalStatus: PropTypes.string,
            applicationStatus: PropTypes.string,
            contact: PropTypes.shape({
                addresses: PropTypes.arrayOf(
                    PropTypes.shape({
                        addressType: PropTypes.string,
                        street: PropTypes.string,
                        city: PropTypes.string,
                        state: PropTypes.string,
                        zipcode: PropTypes.string,
                        country: PropTypes.string,
                    })
                ),
                emails: PropTypes.arrayOf(
                    PropTypes.shape({
                        emailType: PropTypes.string,
                        address: PropTypes.string,
                    })
                ),
                phones: PropTypes.arrayOf(
                    PropTypes.shape({
                        phoneType: PropTypes.string,
                        countryCode: PropTypes.string,
                        number: PropTypes.string,
                    })
                ),
            }),
        }),
    }),
}

export default Addresses