import { EnvelopeAt, Plus, Trash } from "react-bootstrap-icons"
import PropTypes from 'prop-types'
import { useState } from "react";

const Emails = (props) => {
    const { formData, updateContact, addContact, removeContact } = props;
    const [errors, setErrors] = useState([])

    const validateEmailField = (index, field) => {
        let isValid = true
        let newErrors = [ ...errors ]
        let emailError = { ...(newErrors[index] || {}) }
        const email = formData.person.contact.emails[index]
        if (field === 'emailType') {
            if (!email.emailType) {
                emailError.emailType = 'Email type is required!';
                isValid = false
            } else if (email.emailType.trim() !== email.emailType) {
                emailError.emailType = 'Email type cannot have leading or trailing spaces!';
                isValid = false
            }   
        } else if (field === 'address') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;    
            if (!email.address) {
                emailError.address = 'Email address is required!';
                isValid = false
            } else if (email.address.trim() !== email.address) {
                emailError.address = 'Email address cannot have leading or trailing spaces!';
                isValid = false
            } else if (email.address.length < 5) {
                emailError.address = 'Email address must be at least 5 characters long!';
                isValid = false
            } else if (email.address.length > 254) {
                emailError.address = 'Email address cannot exceed 254 characters!';
                isValid = false
            } else if (!emailRegex.test(email.address)) {
                emailError.address = 'Invalid email address format!';
                isValid = false
            }
        }
        newErrors[index] = emailError
        return { isValid, newErrors }
    }

    const handleValidate = (index, field) => {
        const {isValid, newErrors} = validateEmailField(index, field)
        if (!isValid) {
            setErrors(newErrors)
        } else {
            // Clear error for this field if validation passes
            if (newErrors[index]) {
                delete newErrors[index][field]
            }
            setErrors(newErrors)
        }
    }

    return (
        <>
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
                        title={`Add Email`}
                    >
                        <Plus className="mb-1" color="white" size={21} />
                        <span className='d-none d-sm-flex text-white'>Email</span>
                    </button>
                </div>
    
                {formData.person.contact.emails.map((email, index) => (
                    <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                        <div className='mb-2'>
                            <span className="font-medium"><strong>Email {index + 1}</strong></span>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-5 mb-3">
                                <div className="form-floating">
                                    <select
                                        id={`email-type-${index}`}
                                        value={email.emailType || ''}
                                        onBlur={() => handleValidate(index, 'emailType')}
                                        onChange={(e) => updateContact('emails', index, 'emailType', e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Work">Work</option>
                                        <option value="School">School</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <label htmlFor={`email-type-${index}`}>Type*</label>
                                </div>
                                { errors[index]?.emailType && (
                                    <div className="text-danger mt-1">{errors[index].emailType}</div>
                                )}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`email-address-${index}`}
                                        type={"email"}
                                        placeholder="Email Address"
                                        value={email.address || ''}
                                        onBlur={() => handleValidate(index, 'address')}
                                        onChange={(e) => updateContact('emails', index, 'address', e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                    <label htmlFor={`email-address-${index}`}>Email Address*</label>
                                </div>
                                { errors[index]?.address && (
                                    <div className="text-danger mt-1">{errors[index].address}</div>
                                )}
                            </div>
                            {formData.person.contact.emails.length >= 1 && (
                                <div className="col-sm-1 mb-3 mt-1">
                                    <button
                                        type="button"
                                        onClick={() => removeContact('emails', index)}
                                        className="bg-light text-danger"
                                        title={`Remove Email ${index + 1}`}
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

Emails.propTypes = {
    formData: PropTypes.object,
    updateContact: PropTypes.func,
    addContact: PropTypes.func,
    removeContact: PropTypes.func,
}

export default Emails