import { EnvelopeAt, Plus, Trash } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { validators } from '../../validate/validators';

const EmailDetails = (props) => {
    const { index, title, arrayName, person, updateContactForPerson, deleteContactForPerson, 
        addContactForPerson, formErrors, setFormErrors } = props;
    
    const handleValidate = (arrayName, personIndex, contactIndex, field, value) => {
        let contactType = 'emails'
        let errorValue = ''
        if(field === 'emailType') {
            errorValue = validators.required(value)
        }
        if(field === 'address') {
            errorValue = validators.email(value)
        }
        
        setFormErrors(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].map((entry, i) => {
                if (i === personIndex) {
                    let personObj = entry.person;
                    return {
                        ...entry,
                        person: {
                            ...personObj,
                            contact: {
                                ...personObj.contact,
                                [contactType]: personObj.contact[contactType].map((contact, j) =>
                                    j === contactIndex ? { ...contact, [field]: errorValue } : contact
                                )
                            }
                        }
                    }
                }
            })
        }))
    }

    return (
        <>
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
                        title={`Add Email for ${title} ${index + 1}`}
                    >
                        <Plus className="mb-1" color="white" size={21} />
                        <span className='d-none d-sm-flex text-white'>Email</span>
                    </button>
                </div>
    
                {person.contact.emails.map((email, emailIndex) => (
                    <div key={emailIndex} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                        <div className='mb-2'>
                            <span className="font-medium"><strong>Email {emailIndex + 1}</strong></span>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-5 mb-3">
                                <div className="form-floating">
                                    <select
                                        id={`${arrayName}-${index}-email-type`}
                                        value={email.emailType || ''}
                                        onBlur={(e) => handleValidate(arrayName, index, emailIndex, 'emailType', e.target.value)}
                                        onChange={(e) => updateContactForPerson(arrayName, index, 'emails', emailIndex, 'emailType', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Work">Work</option>
                                        <option value="School">School</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <label htmlFor={`${arrayName}-${index}-email-type`}>Type*</label>
                                </div>
                                { 
                                    formErrors[arrayName].length > 0 && 
                                    formErrors[arrayName][index].person.contact.emails.length > 0 && 
                                    formErrors[arrayName][index].person.contact.emails[emailIndex].emailType && 
                                    <div className="text-danger mt-1">
                                        { formErrors[arrayName][index].person.contact.emails[emailIndex].emailType }
                                    </div>
                                }
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`${arrayName}-${index}-email-address`}
                                        type={"email"}
                                        placeholder="Email Address"
                                        value={email.address || ''}
                                        onBlur={(e) => handleValidate(arrayName, index, emailIndex, 'address', e.target.value)}
                                        onChange={(e) => updateContactForPerson(arrayName, index, 'emails', emailIndex, 'address', e.target.value)}
                                        className="form-control"
                                    />
                                    <label htmlFor={`${arrayName}-${index}-email-address`}>Email Address*</label>
                                </div>
                                { 
                                    formErrors[arrayName].length > 0 &&
                                    formErrors[arrayName][index].person.contact.emails.length > 0 && 
                                    formErrors[arrayName][index].person.contact.emails[emailIndex].address && 
                                    <div className="text-danger mt-1">
                                        { formErrors[arrayName][index].person.contact.emails[emailIndex].address }
                                    </div>
                                }
                            </div>
                            {person.contact.emails.length >= 1 && (
                                <div className="col-sm-1 mb-3 mt-1">
                                    <button
                                        type="button"
                                        onClick={() => deleteContactForPerson(arrayName, index, 'emails', emailIndex)}
                                        className="bg-light text-danger"
                                        title={`Remove Email ${emailIndex + 1} for ${title} ${index + 1}`}
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

EmailDetails.propTypes = {
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    arrayName: PropTypes.string.isRequired,
    person: PropTypes.object.isRequired,
    updateContactForPerson: PropTypes.func.isRequired,
    deleteContactForPerson: PropTypes.func.isRequired,
    addContactForPerson: PropTypes.func.isRequired,
    formErrors: PropTypes.object,
    setFormErrors: PropTypes.func,
}

export default EmailDetails