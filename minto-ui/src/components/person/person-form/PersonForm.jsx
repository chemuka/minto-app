import { Trash } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import ContactDetails from './ContactDetails';
import { validators } from '../../validate/validators';

const PersonForm = (props) => {
    const { entry, arrayName, index, title, removePersonFromArray, updatePersonInArray, addContactForPerson, 
        updateContactForPerson, removeContactForPerson, formErrors, setFormErrors } = props;
    let person = {};
    let extraFields = {};
    
    switch (arrayName) {
    case 'referees':
        person = entry.person;
        extraFields.membershipNumber = entry.membershipNumber;
        break;
    case 'parents':
        person = entry.person;
        extraFields.parentType = entry.parentType;
        break;
    case 'siblings':
        person = entry.person;
        extraFields.siblingType = entry.siblingType;
        break;
    case 'spouses':
        person = entry.person;
        extraFields.maritalStatus = entry.maritalStatus;
        break;
    case 'children':
        person = entry.person;
        extraFields.childType = entry.childType;
        break;
    case 'relatives':
        person = entry.person;
        extraFields.membershipNumber = entry.membershipNumber;
        extraFields.familyRelationship = entry.familyRelationship;
        break;
    case 'beneficiaries':
        person = entry.person;
        extraFields.percentage = entry.percentage;
        extraFields.relationship = entry.relationship;
        break;
    default:
        person = entry.person;
    }

    const handleValidate = (arrayName, index, field, value) => {
        let errorValue = ''
        if (field === 'firstName') { errorValue = validators.name(value) }
        if (field === 'middleName') { errorValue = validators.optionalString(2)(value) }
        if (field === 'lastName') { errorValue = validators.name(value) }
        if (field === 'dob') { errorValue = validators.required(value) || validators.dob(value) }
        if (field === 'lifeStatus') { errorValue = validators.required(value) }
        if (field === 'maritalStatus') { errorValue = validators.required(value) }
        if (field === 'childType') { errorValue = validators.required(value) }
        if (field === 'parentType') { errorValue = validators.required(value) }
        if (field === 'siblingType') { errorValue = validators.required(value) }
        if (field === 'familyRelationship') { errorValue = validators.required(value) }
        if (field === 'relationship') { errorValue = validators.name(value) }
        if (field === 'membershipNumber') { errorValue = validators.membershipNumber(value) }
        if (field === 'percentage') { errorValue = validators.percentage(value) }
        
        setFormErrors(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].map((entry, i) => {
                if (i === index) {
                    switch (arrayName) {
                        case 'parents':
                            if (field === 'parentType') {
                                return { ...entry, parentType: errorValue }
                            }
                            return { ...entry, person: { ...entry.person, [field]: errorValue } }
                        
                        case 'children':
                            if (field === 'childType') {
                                return { ...entry, childType: errorValue }
                            }
                            return { ...entry, person: { ...entry.person, [field]: errorValue } }
                        
                        case 'referees':
                            if (field === 'membershipNumber') {
                                return { ...entry, membershipNumber: errorValue }
                            }
                            return { ...entry, person: { ...entry.person, [field]: errorValue } }
                        
                        case 'siblings':
                            if (field === 'siblingType') {
                                return { ...entry, siblingType: errorValue }
                            }
                            return { ...entry, person: { ...entry.person, [field]: errorValue } }
                        
                        case 'spouses':
                            if (field === 'maritalStatus') {
                                return { ...entry, maritalStatus: errorValue }
                            }
                            return { ...entry, person: { ...entry.person, [field]: errorValue } }
                        
                        case 'relatives':
                            if (field === 'membershipNumber') {
                                return { ...entry, membershipNumber: errorValue }
                            }
                            if (field === 'familyRelationship') {
                                return { ...entry, familyRelationship: errorValue }
                            }
                            return { ...entry, person: { ...entry.person, [field]: errorValue } }
                        
                        case 'beneficiaries':
                            if (field === 'percentage') {
                                return { ...entry, percentage: errorValue }
                            }
                            if (field === 'relationship') {
                                return { ...entry, relationship: errorValue }
                            }
                            return { ...entry, person: { ...entry.person, [field]: errorValue } }
                        
                        default:
                            return entry
                    }
                }
                return entry
            })
        }))
    }

    return (
        <>
            <div key={index} className="card mb-2 shadow">
                <div className="card-header d-flex justify-content-between items-center mb-3 bg-light">
                    <h3 className="font-medium"><strong>{title} {index + 1}</strong></h3>
                    <button
                        type="button"
                        onClick={() => removePersonFromArray(arrayName, index)}
                        className="bg-light text-danger p-2"
                        title={`Remove ${title} ${index + 1}`}
                    >
                        <Trash size={24} />
                    </button>
                </div>
                <div className="card-body px-1 px-sm-3">
                    <div className="form-group row">
                        <div className="col-sm-6 mb-3">
                            <div className="form-floating">
                                <input
                                    id={`${arrayName}-${index}-firstName`}
                                    type={"text"}
                                    className="form-control"
                                    placeholder="First Name"
                                    value={person.firstName || ''}
                                    onBlur={(e) => handleValidate(arrayName, index, 'firstName', e.target.value)}
                                    onChange={(e) => updatePersonInArray(arrayName, index, 'firstName', e.target.value)}
                                />
                                <label htmlFor={`${arrayName}-${index}-firstName`}>First Name*</label>
                            </div>
                            { formErrors[arrayName].length > 0 && formErrors[arrayName][index].person.firstName && <div className="text-danger mt-1">{ formErrors[arrayName][index].person.firstName}</div>}
                        </div>
                        <div className="col-sm-6 mb-3">
                            <div className="form-floating">
                                <input
                                    id={`${arrayName}-${index}-middleName`}
                                    type={"text"}
                                    className="form-control"
                                    placeholder="Middle Name"
                                    value={person.middleName || ''}
                                    onBlur={(e) => handleValidate(arrayName, index, 'middleName', e.target.value)}
                                    onChange={(e) => updatePersonInArray(arrayName, index, 'middleName', e.target.value)}
                                />
                                <label htmlFor={`${arrayName}-${index}-middleName`}>Middle Name</label>
                            </div>
                            { formErrors[arrayName].length > 0 && formErrors[arrayName][index].person.middleName && <div className="text-danger mt-1">{ formErrors[arrayName][index].person.middleName}</div>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-6 mb-3">
                            <div className="form-floating">
                                <input
                                    id={`${arrayName}-${index}-lastName`}
                                    type={"text"}
                                    className="form-control"
                                    placeholder="Last Name"
                                    value={person.lastName || ''}
                                    onBlur={(e) => handleValidate(arrayName, index, 'lastName', e.target.value)}
                                    onChange={(e) => updatePersonInArray(arrayName, index, 'lastName', e.target.value)}
                                />
                                <label htmlFor={`${arrayName}-${index}-lastName`}>Last Name*</label>
                            </div>
                            { formErrors[arrayName].length > 0 && formErrors[arrayName][index].person.lastName && <div className="text-danger mt-1">{ formErrors[arrayName][index].person.lastName}</div>}
                        </div>
                        <div className="col-sm-6 mb-3">
                            <div className="form-floating">
                                <input
                                    id={`${arrayName}-${index}-dob`}
                                    type={"date"}
                                    className="form-control"
                                    value={person.dob || ''}
                                    onBlur={(e) => handleValidate(arrayName, index, 'dob', e.target.value)}
                                    onChange={(e) => updatePersonInArray(arrayName, index, 'dob', e.target.value)}
                                />
                                <label htmlFor={`${arrayName}-${index}-dob`}>Date Of Birth</label>
                            </div>
                            { formErrors[arrayName].length > 0 && formErrors[arrayName][index].person.dob && <div className="text-danger mt-1">{ formErrors[arrayName][index].person.dob}</div>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-6 mb-3">
                            <div className="form-floating">
                                <select 
                                    id={`${arrayName}-${index}-lifeStatus`}
                                    className="form-select" 
                                    value={person.lifeStatus || ''}
                                    onBlur={(e) => handleValidate(arrayName, index, 'lifeStatus', e.target.value)}
                                    onChange={(e) => updatePersonInArray(arrayName, index, 'lifeStatus', e.target.value)}
                                >
                                    <option value="">-- Select --</option>
                                    <option value="Living">Living</option>
                                    <option value="Deceased">Deceased</option>
                                </select>
                                <label htmlFor={`${arrayName}-${index}-lifeStatus`}>Life Status</label>
                            </div>
                            { formErrors[arrayName].length > 0 && formErrors[arrayName][index].person.lifeStatus && <div className="text-danger mt-1">{ formErrors[arrayName][index].person.lifeStatus}</div>}
                        </div>

                        {arrayName === 'spouses' && (
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <select
                                        id={`${arrayName}-${index}-maritalStatus`}
                                        value={extraFields.maritalStatus || ''}
                                        onBlur={(e) => handleValidate(arrayName, index, 'maritalStatus', e.target.value)}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'maritalStatus', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Single (Never Married)">Single (Never Married)</option>
                                        <option value="Married">Married</option>
                                        <option value="Living Common-Law">Living Common-Law</option>
                                        <option value="Separated">Separated</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                    <label htmlFor={`${arrayName}-${index}-maritalStatus`}>Marital Status</label>
                                </div>
                                { formErrors[arrayName].length > 0 && formErrors[arrayName][index].maritalStatus && <div className="text-danger mt-1">{ formErrors[arrayName][index].maritalStatus}</div>}
                            </div>
                        )}

                        {arrayName === 'children' && (
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <select
                                        id={`${arrayName}-${index}-childType`}
                                        value={extraFields.childType || ''}
                                    onBlur={(e) => handleValidate(arrayName, index, 'childType', e.target.value)}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'childType', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Biological">Biological</option>
                                        <option value="Adopted">Adopted</option>
                                        <option value="Step Child">Step Child</option>
                                        <option value="Foster Child">Foster Child</option>
                                    </select>
                                    <label htmlFor={`${arrayName}-${index}-childType`}>Child Type</label>
                                </div>
                                { formErrors[arrayName].length > 0 && formErrors[arrayName][index].childType && <div className="text-danger mt-1">{ formErrors[arrayName][index].childType}</div>}
                            </div>
                        )}
                        
                        {arrayName === 'parents' && (
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <select
                                        id={`${arrayName}-${index}-parentType`}
                                        value={extraFields.parentType || ''}
                                        onBlur={(e) => handleValidate(arrayName, index, 'parentType', e.target.value)}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'parentType', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Biological Mother">Biological Mother</option>
                                        <option value="Biological Father">Biological Father</option>
                                        <option value="Adoptive Mother">Adoptive Mother</option>
                                        <option value="Adoptive Father">Adoptive Father</option>
                                        <option value="Step Mother">Step Mother</option>
                                        <option value="Step Father">Step Father</option>
                                        <option value="Foster Mother">Foster Mother</option>
                                        <option value="Foster Father">Foster Father</option>
                                        <option value="Guardian">Guardian</option>
                                    </select>
                                    <label htmlFor={`${arrayName}-${index}-parentType`}>Parent Type</label>
                                </div>
                                { formErrors[arrayName].length > 0 && formErrors[arrayName][index].parentType && <div className="text-danger mt-1">{ formErrors[arrayName][index].parentType}</div>}
                            </div>
                        )}

                        {arrayName === 'siblings' && (
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <select
                                        id={`${arrayName}-${index}-siblingType`}
                                        value={extraFields.siblingType || ''}
                                        onBlur={(e) => handleValidate(arrayName, index, 'siblingType', e.target.value)}
                                        onChange={(e) => updatePersonInArray(arrayName, index, 'siblingType', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Brother">Brother</option>
                                        <option value="Sister">Sister</option>
                                        <option value="Step Brother">Step Brother</option>
                                        <option value="Step Sister">Step Sister</option>
                                        <option value="Adopted Brother">Adopted Brother</option>
                                        <option value="Adopted Sister">Adopted Sister</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <label htmlFor={`${arrayName}-${index}-siblingType`}>Sibling Type</label>
                                </div>
                                { formErrors[arrayName].length > 0 && formErrors[arrayName][index].siblingType && <div className="text-danger mt-1">{ formErrors[arrayName][index].siblingType}</div>}
                            </div>
                        )}

                        {arrayName === 'referees' && (
                            <div className="form-group row">
                                <div className="col-sm-6 mb-3">
                                    <div className="form-floating">
                                        <input
                                            id={`${arrayName}-${index}-membershipNumber`}
                                            type={"text"}
                                            className="form-control"
                                            placeholder="Membership Number"
                                            value={extraFields.membershipNumber || ''}
                                            onBlur={(e) => handleValidate(arrayName, index, 'membershipNumber', e.target.value)}
                                            onChange={(e) => updatePersonInArray(arrayName, index, 'membershipNumber', e.target.value)}
                                        />
                                        <label htmlFor={`${arrayName}-${index}-membershipNumber`}>Membership Number*</label>
                                    </div>
                                    { formErrors[arrayName].length > 0 && formErrors[arrayName][index].membershipNumber && <div className="text-danger mt-1">{ formErrors[arrayName][index].membershipNumber}</div>}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group row">
                        {arrayName === 'relatives' && (
                            <>
                                <div className="col-sm-6 mb-3">
                                    <div className="form-floating">
                                        <input
                                            id={`${arrayName}-${index}-membershipNumber`}
                                            type={"text"}
                                            className="form-control"
                                            placeholder="Membership Number"
                                            value={extraFields.membershipNumber || ''}
                                            onBlur={(e) => handleValidate(arrayName, index, 'membershipNumber', e.target.value)}
                                            onChange={(e) => updatePersonInArray(arrayName, index, 'membershipNumber', e.target.value)}
                                        />
                                        <label htmlFor={`${arrayName}-${index}-membershipNumber`}>Membership Number*</label>
                                    </div>
                                    { 
                                        formErrors[arrayName].length > 0 && 
                                        formErrors[arrayName][index].membershipNumber && 
                                        <div className="text-danger mt-1">
                                            { formErrors[arrayName][index].membershipNumber}
                                        </div>
                                    }
                                </div>
                                <div className="col-sm-6 mb-3">
                                    <div className="form-floating">
                                        <select
                                            id={`familyRelationship-${index}`}
                                            value={extraFields.familyRelationship || ''}
                                            onBlur={(e) => handleValidate(arrayName, index, 'familyRelationship', e.target.value)}
                                            onChange={(e) => updatePersonInArray(arrayName, index, 'familyRelationship', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">-- Select --</option>
                                            <option value="Spouse">Spouse</option>
                                            <option value="Father">Father</option>
                                            <option value="Mother">Mother</option>
                                            <option value="Son">Son</option>
                                            <option value="Daughter">Daughter</option>
                                            <option value="Brother">Brother</option>
                                            <option value="Sister">Sister</option>
                                            <option value="Grandfather">Grandfather</option>
                                            <option value="Grandmother">Grandmother</option>
                                            <option value="Grandson">Grandon</option>
                                            <option value="Granddaughter">Granddaughter</option>
                                            <option value="Uncle">Uncle</option>
                                            <option value="Aunt">Aunt</option>
                                            <option value="Nephew">Nephew</option>
                                            <option value="Niece">Niece</option>
                                            <option value="Cousin">Cousin</option>
                                            <option value="Great-Grandfather">Great-Grandfather</option>
                                            <option value="Great-Grandmother">Great-Grandmother</option>
                                            <option value="Great-Uncle">Great-Uncle</option>
                                            <option value="Great-Aunt">Great-Aunt</option>
                                            <option value="Step relative">Step relative</option>
                                            <option value="Other relative">Other relative</option>
                                        </select>
                                        <label htmlFor={`familyRelationship-${index}`}>Family Relationship</label>
                                    </div>
                                    { 
                                        formErrors[arrayName].length > 0 && 
                                        formErrors[arrayName][index].familyRelationship && 
                                        <div className="text-danger mt-1">
                                            { formErrors[arrayName][index].familyRelationship}
                                        </div>
                                    }
                                </div>
                            </>
                        )}

                        {arrayName === 'beneficiaries' && (
                            <>
                                <div className="col-sm-6 mb-3">
                                    <div className="form-floating">
                                        <input
                                            id={`${arrayName}-${index}-relationship`}
                                            type={"text"}
                                            className="form-control"
                                            placeholder="Relationship"
                                            value={extraFields.relationship || ''}
                                            onBlur={(e) => handleValidate(arrayName, index, 'relationship', e.target.value)}
                                            onChange={(e) => updatePersonInArray(arrayName, index, 'relationship', e.target.value)}
                                        />
                                        <label htmlFor={`${arrayName}-${index}-relationship`}>Relationship*</label>
                                    </div>
                                    { formErrors[arrayName].length > 0 && formErrors[arrayName][index].relationship && <div className="text-danger mt-1">{ formErrors[arrayName][index].relationship}</div>}
                                </div>
                                <div className="col-sm-6 mb-3">
                                    <div className="form-floating">
                                        <input
                                            id={`percentage-${index}`}
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            value={extraFields.percentage || ''}
                                            onBlur={(e) => handleValidate(arrayName, index, 'percentage', e.target.value)}
                                            onChange={(e) => updatePersonInArray(arrayName, index, 'percentage', parseFloat(e.target.value) || 0.0)}
                                            className="form-control"
                                        />
                                        <label htmlFor={`percentage-${index}`}>Percentage</label>
                                    </div>
                                    { formErrors[arrayName].length > 0 && formErrors[arrayName][index].percentage && <div className="text-danger mt-1">{ formErrors[arrayName][index].percentage}</div>}
                                </div>
                            </>
                        )}
                    </div>
                    
                    {/* Contact Details Card */}
                    <ContactDetails 
                        index={index} 
                        title={title} 
                        arrayName={arrayName} 
                        person={person} 
                        updateContactForPerson={updateContactForPerson} 
                        removeContactForPerson={removeContactForPerson} 
                        addContactForPerson={addContactForPerson} 
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />  
                </div>
            </div>
        </>
    )
}

PersonForm.propTypes = {
    entry: PropTypes.object,
    arrayName: PropTypes.string,
    index: PropTypes.number,
    title: PropTypes.string,
    removePersonFromArray: PropTypes.func,
    updatePersonInArray: PropTypes.func,
    addContactForPerson: PropTypes.func,
    updateContactForPerson: PropTypes.func,
    removeContactForPerson: PropTypes.func,
    formErrors: PropTypes.object,
    setFormErrors: PropTypes.func,
}

export default PersonForm