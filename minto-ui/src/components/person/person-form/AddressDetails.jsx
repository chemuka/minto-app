import { GeoAlt, Plus, Trash } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import countriesData from '../../../assets/data/countries.json';

const AddressDetails = (props) => {
    const { index, title, arrayName, person, updateContactForPerson, removeContactForPerson, addContactForPerson } = props;

    return (
        <>
            <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg">
                <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                    <div className="d-flex items-center">
                        <GeoAlt size={20} className='mt-1 mx-1' />
                        <h5 className="font-semibold"><strong>{title} {index + 1} - Addresses</strong></h5>
                    </div>
                    <button 
                        type="button" 
                        className="d-flex btn text-center align-items-center" 
                        onClick={() => addContactForPerson(arrayName, index, 'addresses')}
                        style={{ backgroundColor: 'black' }}
                        title={`Add Address for ${title} ${index + 1}`}
                    >
                        <Plus className="mb-1" color="white" size={21} />
                        <span className='d-none d-sm-flex text-white'>Address</span>
                    </button>
                </div>
            
                {person.contact.addresses.map((address, addrIndex) => (
                    <div key={addrIndex} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                        <div className="d-flex justify-content-between items-center mb-3">
                            <span className="font-medium"><strong>Address {addrIndex + 1}</strong></span>
                            {person.contact.addresses.length >= 1 && (
                            <button
                                type="button"
                                onClick={() => removeContactForPerson(arrayName, index, 'addresses', addrIndex)}
                                className="bg-light text-danger p-2"
                                title={`Remove Address ${addrIndex + 1} for ${title} ${index + 1}`}
                            >
                                <Trash size={24} />
                            </button>
                            )}
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-5 mb-3">
                                <div className="form-floating">
                                    <select
                                        id={`${arrayName}-${index}-address-type`}
                                        value={address.addressType || ''}
                                        onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'addressType', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="School">School</option>
                                        <option value="Billing">Billing</option>
                                        <option value="Shipping">Shipping</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <label htmlFor={`${arrayName}-${index}-address-type`}>Type</label>
                                </div>
                            </div>
                            <div className="col-sm-7 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`${arrayName}-${index}-street`}
                                        type={"text"}
                                        placeholder="Street Address"
                                        value={address.street || ''}
                                        onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'street', e.target.value)}
                                        className="form-control"
                                    />
                                    <label htmlFor={`${arrayName}-${index}-street`}>Street Address</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-5 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`${arrayName}-${index}-city`}
                                        type={"text"}
                                        placeholder="City"
                                        value={address.city || ''}
                                        onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'city', e.target.value)}
                                        className="form-control"
                                    />
                                    <label htmlFor={`${arrayName}-${index}-city`}>City</label>
                                </div>
                            </div>
                            <div className="col-sm-7 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`${arrayName}-${index}-state`}
                                        type={"text"}
                                        placeholder="State"
                                        value={address.state || ''}
                                        onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'state', e.target.value)}
                                        className="form-control"
                                    />
                                    <label htmlFor={`${arrayName}-${index}-state`}>State</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-5 mb-3">
                                <div className="form-floating">
                                    <input
                                        id={`${arrayName}-${index}-zipcode`}
                                        type={"text"}
                                        placeholder="ZIP Code"
                                        value={address.zipcode || ''}
                                        onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'zipcode', e.target.value)}
                                        className="form-control"
                                    />
                                    <label htmlFor={`${arrayName}-${index}-zipcode`}>Zip Code</label>
                                </div>
                            </div>
                            <div className="col-sm-7 mb-3">
                                <div className="form-floating">
                                    <select 
                                        id={`${arrayName}-${index}-country`}
                                        name={`${arrayName}-${index}-country`}
                                        className="form-select"
                                        value={address.country || ''}
                                        onChange={(e) => updateContactForPerson(arrayName, index, 'addresses', addrIndex, 'country', e.target.value)}
                                    >
                                        <option key={'nil'} value="">-- Select --</option>
                                        {countriesData.map((country) => (
                                            <option key={country.cca2} value={country.name}>
                                                {country.flag} {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor={`${arrayName}-${index}-country`}>Country</label>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

AddressDetails.propTypes = {
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    arrayName: PropTypes.string.isRequired,
    person: PropTypes.object.isRequired,
    updateContactForPerson: PropTypes.func.isRequired,
    removeContactForPerson: PropTypes.func.isRequired,
    addContactForPerson: PropTypes.func.isRequired
}

export default AddressDetails