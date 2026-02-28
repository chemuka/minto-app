import { GeoAlt, Plus, Trash } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import countriesData from '../../../assets/data/countries.json';
import { useState } from 'react';
import { validators } from '../../validate/validators';

const Addresses = (props) => {
    const { formData, updateContact, addContact, deleteContact, formErrors, setFormErrors } = props;

    const handleValidate = (index, field, value) => {
        let errorValue = ''
        if (field === 'addressType') { errorValue = validators.required(value) }
        if (field === 'street') { errorValue = validators.street(value) }
        if (field === 'city') { errorValue = validators.required(value) }
        if (field === 'state') { errorValue = validators.optionalString(2)(value) }
        if (field === 'zipcode') { errorValue = validators.optionalString(3)(value) }
        if (field === 'country') { errorValue = validators.required(value) }

        setFormErrors(prev => ({
            ...prev, 
            person: {
                ...prev.person, 
                contact: { 
                    ...prev.person.contact,
                    addresses: prev.person.contact.addresses.map((contact, i) =>
                        i === index ? { ...contact, [field]: errorValue } : contact
                    )
                }
            }
        }))
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
                                onClick={() => deleteContact('addresses', index)}
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
                                        onBlur={(e) => handleValidate(index, 'addressType', e.target.value)}
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
                                        onBlur={(e) => handleValidate(index, 'street', e.target.value)}
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
                                        onBlur={(e) => handleValidate(index, 'city', e.target.value)}
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
                                        onBlur={(e) => handleValidate(index, 'state', e.target.value)}
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
                                        onBlur={(e) => handleValidate(index, 'zipcode', e.target.value)}
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
                                        onBlur={(e) => handleValidate(index, 'country', e.target.value)}
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
    deleteContact: PropTypes.func,
    formErrors: PropTypes.object,
    setFormErrors: PropTypes.func,
}

export default Addresses