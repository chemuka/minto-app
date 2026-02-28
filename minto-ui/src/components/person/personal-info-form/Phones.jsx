import { Telephone, Plus, Trash } from "react-bootstrap-icons"
import PropTypes from 'prop-types'
import countriesData from '../../../assets/data/countries.json';
import { validators } from "../../validate/validators";

const Phones = (props) => {
    const { formData, updateContact, addContact, deleteContact, formErrors, setFormErrors } = props;
    
    const handleValidate = (index, field, value) => {
        let errorValue = ''
        if(field === 'phoneType') {
            errorValue = validators.required(value)
        }
        if(field === 'countryCode') {
            errorValue = validators.countryCode(value)
        }
        if(field === 'number') {
            errorValue = validators.phone(value)
        }

        setFormErrors(prev => ({
            ...prev, 
            person: {
                ...prev.person, 
                contact: { 
                    ...prev.person.contact,
                    phones: prev.person.contact.phones.map((contact, i) =>
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
                                        onBlur={(e) => handleValidate(index, 'phoneType', e.target.value)}
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
                                { formErrors.person.contact.phones[index]?.phoneType && (
                                    <div className="text-danger mt-1">{formErrors.person.contact.phones[index].phoneType}</div>
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
                                        onBlur={(e) => handleValidate(index, 'countryCode', e.target.value)}
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
                                { formErrors.person.contact.phones[index]?.countryCode && (
                                    <div className="text-danger mt-1">{formErrors.person.contact.phones[index].countryCode}</div>
                                )}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`phone-number-${index}`}
                                        type={"tel"}
                                        placeholder="Phone Number"
                                        value={phone.number || ''}
                                        onBlur={(e) => handleValidate(index, 'number', e.target.value)}
                                        onChange={(e) => updateContact('phones', index, 'number', e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                    <label htmlFor={`phone-number-${index}`}>Phone Number*</label>
                                </div>
                                { formErrors.person.contact.phones[index]?.number && (
                                    <div className="text-danger mt-1">{formErrors.person.contact.phones[index].number}</div>
                                )}
                            </div>
                            {formData.person.contact.phones.length >= 1 && (
                                <>
                                    <div className="col-sm-1 mb-3 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => deleteContact('phones', index)}
                                            className="bg-light text-danger"
                                            title={`Remove Phone ${index + 1}`}
                                        >
                                            <Trash size={24} />
                                        </button>
                                    </div>
                                </>
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
    deleteContact: PropTypes.func,
    formErrors: PropTypes.object,
    setFormErrors: PropTypes.func,
}

export default Phones