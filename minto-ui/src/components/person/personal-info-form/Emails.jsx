import { EnvelopeAt, Plus, Trash } from "react-bootstrap-icons"
import PropTypes from 'prop-types'
import { validators } from "../../validate/validators";

const Emails = (props) => {
    const { formData, updateContact, addContact, deleteContact, formErrors, setFormErrors } = props;
    
    const handleValidate = (index, field, value) => {
        let errorValue = ''
        if(field === 'emailType') {
            errorValue = validators.required(value)
        }
        if(field === 'address') {
            errorValue = validators.email(value)
        }
        
        setFormErrors(prev => ({
            ...prev, 
            person: {
                ...prev.person, 
                contact: { 
                    ...prev.person.contact,
                    emails: prev.person.contact.emails.map((contact, i) =>
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
                                        onBlur={(e) => handleValidate(index, 'emailType', e.target.value)}
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
                                { formErrors.person.contact.emails[index]?.emailType && (
                                    <div className="text-danger mt-1">{formErrors.person.contact.emails[index].emailType}</div>
                                )}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`email-address-${index}`}
                                        type={"email"}
                                        placeholder="Email Address"
                                        value={email.address || ''}
                                        onBlur={(e) => handleValidate(index, 'address', e.target.value)}
                                        onChange={(e) => updateContact('emails', index, 'address', e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                    <label htmlFor={`email-address-${index}`}>Email Address*</label>
                                </div>
                                { formErrors.person.contact.emails[index]?.address && (
                                    <div className="text-danger mt-1">{formErrors.person.contact.emails[index].address}</div>
                                )}
                            </div>
                            {formData.person.contact.emails.length >= 1 && (
                                <div className="col-sm-1 mb-3 mt-1">
                                    <button
                                        type="button"
                                        onClick={() => deleteContact('emails', index)}
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
    deleteContact: PropTypes.func,
    formErrors: PropTypes.object,
    setFormErrors: PropTypes.func,
}

export default Emails