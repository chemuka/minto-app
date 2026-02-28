import { PersonFill } from "react-bootstrap-icons"
import PropTypes from 'prop-types'
import Contact from "./Contact"
import { useState } from "react";
import { validators } from "../../validate/validators";

const PersonalInfoForm = (props) => {
    const { formData, updateFormData, updateMainPerson, updateContact, addContact, 
        removeContact, formErrors, setFormErrors } = props;
    
    const handleValidate = (field, value) => {
        let errorValue = ''
        if (field === 'firstName') { errorValue = validators.name(value) }
        if (field === 'middleName') { errorValue = validators.optionalString(2)(value) }
        if (field === 'lastName') { errorValue = validators.name(value) }
        if (field === 'dob') { errorValue = validators.required(value) || validators.dob(value) }
        if (field === 'lifeStatus') { errorValue = validators.required(value) }
        
        if (field === 'maritalStatus') { 
            errorValue = validators.required(value) 
            setFormErrors(prev => ({ ...prev, maritalStatus: errorValue }))
        } else {
            setFormErrors(prev => ({
                ...prev, 
                person: {
                    ...prev.person, 
                    [field]: errorValue
                }
            }))
        }
    }

    return (
        <>
            <div className='card mb-4'>
                <div className="card-header bg-light">
                    <div className="d-flex">
                        <PersonFill size={30} className='text-primary me-2' />
                        <h3 className="text-primary">Personal Information</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">
                    <div className="form-group row">
                        <div className="col-sm-4 mb-3">
                            <div className="form-floating">
                                <input
                                    id="firstName"
                                    type={"text"}
                                    className="form-control"
                                    placeholder="First Name"
                                    name="firstName"
                                    value={formData.person.firstName || ''}
                                    onBlur={(e) => handleValidate('firstName', e.target.value)}
                                    onChange={(e) => updateMainPerson('firstName', e.target.value)}
                                    required
                                />
                                <label htmlFor={"firstName"}>First Name*</label>
                            </div>
                            { formErrors.person.firstName && <div className="text-danger mt-1">{ formErrors.person.firstName}</div>}
                        </div>
                        <div className="col-sm-4 mb-3">
                            <div className="form-floating">
                                <input
                                    id={"middleName"}
                                    type={"text"}
                                    className="form-control"
                                    placeholder="Middle name"
                                    name="middleName"
                                    value={formData.person.middleName || ''}
                                    onBlur={(e) => handleValidate('middleName', e.target.value)}
                                    onChange={(e) => updateMainPerson('middleName', e.target.value)}
                                />
                                <label htmlFor={"middleName"}>Middle Name</label>
                            </div>
                            { formErrors.person.middleName && <div className="text-danger mt-1">{formErrors.person.middleName}</div>}
                        </div>
                        <div className="col-sm-4 mb-3">
                            <div className="form-floating">
                                <input
                                    id={"lastName"}
                                    type={"text"}
                                    className="form-control"
                                    placeholder="Last name"
                                    name="lastName"
                                    value={formData.person.lastName || ''}
                                    onBlur={(e) => handleValidate('lastName', e.target.value)}
                                    onChange={(e) => updateMainPerson('lastName', e.target.value)}
                                    required
                                />
                                <label htmlFor={"lastName"}>Last Name*</label>
                            </div>
                            { formErrors.person.lastName && <div className="text-danger mt-1">{formErrors.person.lastName}</div>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-6 mb-3">
                            <div className="form-floating">
                                <input
                                    id={"dob"}
                                    type={"date"}
                                    className="form-control"
                                    name="dob"
                                    value={formData.person.dob || ''}
                                    onBlur={(e) => handleValidate('dob', e.target.value)}
                                    onChange={(e) => updateMainPerson('dob', e.target.value)}
                                    required
                                />
                                <label htmlFor={"dob"}>Date Of Birth*</label>
                            </div>
                            { formErrors.person.dob && <div className="text-danger mt-1">{formErrors.person.dob}</div>}
                        </div>
                        <div className="col-sm-6 mb-3">
                            <div className="form-floating">
                                <select 
                                    className="form-select" 
                                    name="lifeStatus" 
                                    id="lifeStatus"
                                    value={formData.person.lifeStatus || ''}
                                    onBlur={(e) => handleValidate('lifeStatus', e.target.value)}
                                    onChange={(e) => updateMainPerson('lifeStatus', e.target.value)}
                                    required
                                >
                                    <option value="">-- Select --</option>
                                    <option value="Living">Living</option>
                                    <option value="Deceased">Deceased</option>
                                </select>
                                <label htmlFor={"lifeStatus"}>Life Status*</label>
                            </div>
                            { formErrors.person.lifeStatus && <div className="text-danger mt-1">{formErrors.person.lifeStatus}</div>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-6 mb-3">
                            <div className="form-floating">
                                <select 
                                    className="form-select" 
                                    name="maritalStatus" 
                                    id="maritalStatus"
                                    value={formData.maritalStatus || ''}
                                    onBlur={(e) => handleValidate('maritalStatus', e.target.value)}
                                    onChange={(e) => updateFormData('maritalStatus', e.target.value)}
                                    required
                                >
                                    <option value="">-- Select --</option>
                                    <option value="Single (Never Married)">Single (Never Married)</option>
                                    <option value="Married">Married</option>
                                    <option value="Living Common-Law">Living Common-Law</option>
                                    <option value="Separated">Separated</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                                <label htmlFor={"maritalStatus"}>Marital Status*</label>
                            </div>
                            { formErrors.maritalStatus && <div className="text-danger mt-1">{formErrors.maritalStatus}</div>}
                        </div>
                        <div className="col-sm-6 mb-3">
                            <div className="form-floating">
                                <select
                                    className="form-select" 
                                    name="applicationStatus"
                                    id="applicationStatus"
                                    value={formData.applicationStatus || ''}
                                    disabled={true}
                                    onChange={(e) => updateFormData('applicationStatus', e.target.value)}
                                >
                                    <option value="">-- Select --</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Submitted">Submitted</option>
                                    <option value="Under review">Under review</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Withdrawn">Withdrawn</option>
                                </select>
                                <label htmlFor={"applicationStatus"}>Application Status</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Contact 
                formData={formData} 
                updateContact={updateContact} 
                addContact={addContact} 
                removeContact={removeContact}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
            /> 
            
        </>
    )
}

PersonalInfoForm.propTypes = {
    formData: PropTypes.object,
    updateFormData: PropTypes.func,
    updateMainPerson: PropTypes.func,
    updateContact: PropTypes.func,
    addContact: PropTypes.func,
    removeContact: PropTypes.func,
    setFormErrors: PropTypes.func,
    formErrors: PropTypes.object,
}

export default PersonalInfoForm