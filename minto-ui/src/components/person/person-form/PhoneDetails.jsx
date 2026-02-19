import { Plus, Telephone, Trash } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import countriesData from '../../../assets/data/countries.json';

const PhoneDetails = (props) => {
    const { index, title, arrayName, person, updateContactForPerson, removeContactForPerson, addContactForPerson } = props;
    
    return (
        <>
            <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg">
                <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                    <div className="d-flex items-center">
                        <Telephone size={20} className='mt-1 mx-1' />
                        <h5 className="text-lg font-semibold"><strong>{title} {index + 1} - Phones</strong></h5>
                    </div>
                    <button 
                        type="button" 
                        className="d-flex btn text-center align-items-center" 
                        onClick={() => addContactForPerson(arrayName, index, 'phones')}
                        style={{ backgroundColor: 'black' }}
                        title={`Add Phone for ${title} ${index + 1}`}
                    >
                        <Plus className="mb-1" color="white" size={21} />
                        <span className='d-none d-sm-flex text-white'>Phone No.</span>
                    </button>
                </div>
                
                {person.contact.phones.map((phone, phoneIndex) => (
                    <div key={phoneIndex} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                        <div className='mb-2'>
                            <span className="font-medium"><strong>Phone {phoneIndex + 1}</strong></span>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <select
                                        id={`${arrayName}-${index}-phone-type`}
                                        value={phone.phoneType || ''}
                                        onChange={(e) => updateContactForPerson(arrayName, index, 'phones', phoneIndex, 'phoneType', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <label htmlFor={`${arrayName}-${index}-phone-type`}>Type</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-5 mb-3">
                                <div className="form-floating">
                                    <select 
                                        id={`${arrayName}-${index}-phone-country-code`}
                                        className="form-select"
                                        name={`country-code-${index}`}
                                        value={phone.countryCode || ''}
                                        onChange={(e) => updateContactForPerson(arrayName, index, 'phones', phoneIndex, 'countryCode', e.target.value)}
                                    >
                                        <option value="">-- Select --</option>
                                        {countriesData.map((country) => (
                                            <option key={country.cca2} value={`${country.flag} +${country.code}`}>
                                                {country.flag} +{country.code}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor={`${arrayName}-${index}-phone-country-code`}>Country Code</label>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`${arrayName}-${index}-phone-number`}
                                        type={"tel"}
                                        placeholder="Phone Number"
                                        value={phone.number || ''}
                                        onChange={(e) => updateContactForPerson(arrayName, index, 'phones', phoneIndex, 'number', e.target.value)}
                                        className="form-control"
                                    />
                                    <label htmlFor={`${arrayName}-${index}-phone-number`}>Phone Number</label>
                                </div>
                            </div>
                            {person.contact.phones.length >= 1 && (
                                <div className="col-sm-1 mb-3 mt-1">
                                    <button
                                        type="button"
                                        onClick={() => removeContactForPerson(arrayName, index, 'phones', phoneIndex)}
                                        className="bg-light text-danger"
                                        title={`Remove Phone ${phoneIndex + 1} for ${title} ${index + 1}`}
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

PhoneDetails.propTypes = {
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    arrayName: PropTypes.string.isRequired,
    person: PropTypes.object.isRequired,
    updateContactForPerson: PropTypes.func.isRequired,
    removeContactForPerson: PropTypes.func.isRequired,
    addContactForPerson: PropTypes.func.isRequired
}

export default PhoneDetails