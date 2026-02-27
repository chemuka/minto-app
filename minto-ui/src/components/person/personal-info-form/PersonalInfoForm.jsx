import { PersonFill } from "react-bootstrap-icons"
import PropTypes from 'prop-types'
import Contact from "./Contact"
import { useState } from "react";

const PersonalInfoForm = (props) => {
    const { formData, updateFormData, updateMainPerson, updateContact, addContact, 
        removeContact, formErrors, setFormErrors } = props;
    const [errors, setErrors] = useState({})

    const validateMainPerson = (field) => {
        let isValid = true
        let newErrors = { ...errors }

        if (field === 'firstName') {
            if (!formData.person.firstName || formData.person.firstName.trim() === '') {
                newErrors.firstName = 'First name is required!'
                isValid = false
            } else if (formData.person.firstName.length < 2) {
                newErrors.firstName = 'First name must be at least 2 characters long!'
                isValid = false
            } else if (formData.person.firstName.trim() !== formData.person.firstName) {
                newErrors.firstName = 'First name cannot have leading or trailing spaces!'
                isValid = false
            }
        } else if (field === 'lastName') {
            if (!formData.person.lastName || formData.person.lastName.trim() === '') {
                newErrors.lastName = 'Last name is required!'
                isValid = false
            } else if (formData.person.lastName.length < 2) {
                newErrors.lastName = 'Last name must be at least 2 characters long!'
                isValid = false
            } else if (formData.person.lastName.trim() !== formData.person.lastName) {
                newErrors.lastName = 'Last name cannot have leading or trailing spaces!'
                isValid = false
            }
        } else if (field === 'dob') {
            if (!formData.person.dob) {
                newErrors.dob = 'Date of Birth is required!'
                isValid = false
            } else {
                const dobDate = new Date(formData.person.dob)
                const today = new Date()
                if (dobDate > today) {
                    newErrors.dob = 'Date of Birth cannot be in the future!'
                    isValid = false
                }
            }
        } else if (field === 'lifeStatus') {
            if (!formData.person.lifeStatus) {
                newErrors.lifeStatus = 'Life Status is required!'
                isValid = false
            }
        } else if (field === 'maritalStatus') {
            if (!formData.maritalStatus) {
                newErrors.maritalStatus = 'Marital Status is required!'
                isValid = false
            }
        } else if (field === 'applicationStatus') {
            if (!formData.applicationStatus) {
                newErrors.applicationStatus = 'Application Status is required!'
                isValid = false
            }
        }

        return { isValid, newErrors }
    }

    const handleValidate = (field) => {   
        const {isValid, newErrors} = validateMainPerson(field)
        if (!isValid) {
            setErrors(newErrors)
        } else {
            // Clear error for this field if validation passes
            if (newErrors[field]) {
                const updatedErrors = { ...newErrors }
                delete updatedErrors[field]
                setErrors(updatedErrors)
            }
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
                                    onBlur={() => handleValidate('firstName')}
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
                                    onBlur={() => handleValidate('middleName')}
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
                                    onBlur={() => handleValidate('lastName')}
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
                                    onBlur={() => handleValidate('dob')}
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
                                    onBlur={() => handleValidate('lifeStatus')}
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
                                    onBlur={() => handleValidate('maritalStatus')}
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
    formErrors: PropTypes.shape({
        maritalStatus: PropTypes.string,
        applicationStatus: PropTypes.string,
        person: PropTypes.shape({
            firstName: PropTypes.string,
            middleName: PropTypes.string,
            lastName: PropTypes.string,
            dob: PropTypes.string,
            lifeStatus: PropTypes.string,
            contact: PropTypes.shape({
                addresses: PropTypes.arrayOf(
                    PropTypes.shape({
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

export default PersonalInfoForm