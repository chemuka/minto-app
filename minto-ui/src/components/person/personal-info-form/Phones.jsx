import { Telephone, Plus, Trash } from "react-bootstrap-icons"
import PropTypes from 'prop-types'
import countriesData from '../../../assets/data/countries.json';
import { useEffect, useState } from "react";

const Phones = (props) => {
    const { formData, updateContact, addContact, removeContact, formErrors, setFormErrors } = props;
    const [errors, setErrors] = useState([])

    useEffect(() => {
        if (formErrors && formErrors?.formData?.person?.contact?.phones) {
            setErrors(formErrors.formData.person.contact.phones)
        }
    }, [formErrors])

    const validatePhoneField = (index, field) => {
        let isValid = true
        let newErrors = [ ...errors ]
        let phoneError = { ...(newErrors[index] || {}) }
        const phone = formData.person.contact.phones[index]
        const CountryCodeRegex = /\p{Regional_Indicator}{2}\s?\+\d{1,4}/u;

        if (field === 'phoneType') {
            if (phone.phoneType.trim() === '') {
                phoneError.phoneType = 'Phone type cannot be empty!'; 
                isValid = false
            } else if (phone.phoneType.trim() !== phone.phoneType) {
                phoneError.phoneType = 'Phone type cannot have leading or trailing spaces!';
                isValid = false
            }
        } else if (field === 'number') {
            if (!phone.number) {
                phoneError.number = 'Phone number is required!';
                isValid = false
            } else if (phone.number.trim() !== phone.number) {
                phoneError.number = 'Phone number cannot have leading or trailing spaces!';
                isValid = false
            } else if (!/^\d+$/.test(phone.number)) {
                phoneError.number = 'Phone number must contain only digits!';
                isValid = false
            } else if (phone.number.length < 7 || phone.number.length > 15) {
                phoneError.number = 'Phone number must be between 7 and 15 digits!';
                isValid = false
            }
        } else if (field === 'countryCode') {
            //if (!/^\+\d{1,4}$/.test(phone.countryCode)) { 
            if (!CountryCodeRegex.test(phone.countryCode)) {
                phoneError.countryCode = 'Country code must be in format +123!';
                isValid = false
            } else if (phone.countryCode.trim() !== phone.countryCode) {
                phoneError.countryCode = 'Country code cannot have leading or trailing spaces!';
                isValid = false
            }
        }
        newErrors[index] = phoneError
        
        return { isValid, newErrors }
    }

    const handleValidate = (index, field) => {
        const {isValid, newErrors} = validatePhoneField(index, field)
        if (!isValid) {
            // Update form errors in parent component
            setFormErrors(prevErrors => ({
                ...prevErrors,
                formData: {
                    ...prevErrors?.formData,
                    person: {
                        ...prevErrors?.formData?.person,
                        contact: {
                            ...prevErrors?.formData?.person?.contact,
                            phones: newErrors
                        }
                    }
                }
            }))
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
                
                {formData.person.contact.phones.map((phone, index) => (
                    <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                        <div className='mb-2'>
                            <span className="font-medium"><strong>Phone {index + 1}</strong></span>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <select
                                        id={`phone-type-${index}`}
                                        value={phone.phoneType || ''}
                                        onBlur={() => handleValidate(index, 'phoneType')}
                                        onChange={(e) => updateContact('phones', index, 'phoneType', e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <label htmlFor={`phone-type-${index}`}>Type*</label>
                                </div>
                                { errors[index]?.phoneType && (
                                    <div className="text-danger mt-1">{errors[index].phoneType}</div>
                                )}
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-5 mb-3">
                                <div className="form-floating">
                                    <select 
                                        id={`phone-country-code-${index}`}
                                        className="form-select"
                                        name={`phone-country-code-${index}`}
                                        value={phone.countryCode || ''}
                                        onBlur={() => handleValidate(index, 'countryCode')}
                                        onChange={(e) => updateContact('phones', index, 'countryCode', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Select --</option>
                                        {countriesData.map((country) => (
                                            <option key={country.cca2} value={`${country.flag} +${country.code}`}>
                                                {country.flag} +{country.code}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor={`phone-country-code-${index}`}>Country Code*</label>
                                </div>
                                { errors[index]?.countryCode && (
                                    <div className="text-danger mt-1">{errors[index].countryCode}</div>
                                )}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`phone-number-${index}`}
                                        type={"tel"}
                                        placeholder="Phone Number"
                                        value={phone.number || ''}
                                        onBlur={() => handleValidate(index, 'number')}
                                        onChange={(e) => updateContact('phones', index, 'number', e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                    <label htmlFor={`phone-number-${index}`}>Phone Number*</label>
                                </div>
                                { errors[index]?.number && (
                                    <div className="text-danger mt-1">{errors[index].number}</div>
                                )}
                            </div>
                            {formData.person.contact.phones.length >= 1 && (
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
        </>
    )
}

Phones.propTypes = {
    formData: PropTypes.object,
    updateContact: PropTypes.func,
    addContact: PropTypes.func,
    removeContact: PropTypes.func,
    setFormErrors: PropTypes.func,
    formErrors: PropTypes.shape({
        formData: PropTypes.shape({
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
    }),
}

export default Phones