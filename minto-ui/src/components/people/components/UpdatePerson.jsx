import { Calendar, EnvelopeAt, Globe, GlobeAmericas, Telephone, YinYang } from "react-bootstrap-icons";
import PropTypes from 'prop-types';

const UpdatePerson = (props) => {
    const { loading, formData, onInputChange, onSubmit } = props

    return (
        <>
            <div className="card my-3 border shadow">
                <div className="card-header bg-primary">
                    <h3 className="text-white">Update Person</h3>
                </div>
                <div className="card-body px-1 px-sm-3">
                    <div className="container px-1 px-sm-3">
                        <form onSubmit={(e) => onSubmit(e)} action="">
                            <div className="form-group row">
                                <div className="col-md-4">
                                    <div className="input-group mb-3">
                                        <span className="d-none d-sm-block input-group-text">First Name*</span>
                                        <input 
                                            type={"text"}
                                            className="form-control"
                                            placeholder="First Name"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-group mb-3">
                                        <span className="d-none d-sm-block input-group-text">Middle Name</span>
                                        <input 
                                            type={"text"}
                                            className="form-control"
                                            placeholder="Middle Name"
                                            name="middleName"
                                            value={formData.middleName}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-group mb-3">
                                        <span className="d-none d-sm-block input-group-text">Last Name*</span>
                                        <input 
                                            type="text" 
                                            placeholder="Last Name"
                                            className="form-control"
                                            value={formData.lastName}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">
                                            <Calendar />
                                        </span>
                                        <span className="d-none d-sm-block input-group-text">Date Of Birth</span>
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            value={formData.dob}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">
                                            <YinYang />
                                        </span>
                                        <span className="d-none d-sm-block input-group-text">Life Status</span>
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            value={formData.lifeStatus}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card mb-3">
                                <div className="card-header bg-black">
                                    <h6 className="text-white">Contacts</h6>
                                </div>
                                <div className="card-body px-1 px-sm-3">
                                    <div className="container px-1 px-sm-3">
                                        { formData.contact.addresses.map((address, index) => (
                                            <div key={index} className="px-1 px-md-3 pt-2 mb-3 border bg-light">
                                                <div className="d-flex justify-content-between mb-3">
                                                    <h5 className="text-primary">Address: {index + 1}</h5>
                                                </div>
                                                <div className="form-group row">
                                                    <div className="col-sm-3 mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text">Type</span>
                                                            <input 
                                                                name={`address-type-${index}`} id={`address-type-${index}`}
                                                                type="text" 
                                                                className="form-control"
                                                                value={address.type}
                                                                onChange={(e) => onInputChange(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-5 mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text">Street</span>
                                                            <input
                                                                type={"text"} id={`street-${index}`}
                                                                className="form-control"
                                                                placeholder="Enter street address"
                                                                name={`street-${index}`}
                                                                value={address.street}
                                                                onChange={(e) => onInputChange(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-4 mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text">City</span>
                                                            <input
                                                                type={"text"} id={`city-${index}`}
                                                                className="form-control"
                                                                placeholder="Enter city"
                                                                name={`city-${index}`}
                                                                value={address.city}
                                                                onChange={(e) => onInputChange(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <div className="col-sm-4 mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text">State</span>
                                                            <input
                                                                type={"text"} id={`state-${index}`}
                                                                className="form-control"
                                                                placeholder="Enter state"
                                                                name={`state-${index}`}
                                                                value={address.state}
                                                                onChange={(e) => onInputChange(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-4 mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text">Zip Code</span>
                                                            <input
                                                                type={"text"} id={`zipcode-${index}`}
                                                                className="form-control"
                                                                placeholder="Enter zip code"
                                                                name={`zipcode-${index}`}
                                                                value={address.zipcode}
                                                                onChange={(e) => onInputChange(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-4 mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text">
                                                                <GlobeAmericas />
                                                            </span>
                                                            <input 
                                                                className="form-control"
                                                                id={`country-${index}`}
                                                                name={`country-${index}`}
                                                                value={address.country}
                                                                onChange={(e) => onInputChange(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    
                                        { formData.contact.emails.map((email, index) => (
                                            <div key={index}  className="px-1 px-md-3 pt-2 mb-3 border bg-light">
                                                <div className="d-flex justify-content-between mb-3">
                                                    <h5 className="text-primary">Email: {index + 1}</h5>
                                                </div>
                                                <div className="form-group row">
                                                    <div className="col-sm-4 mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text">Type</span>
                                                            <input name={`email-type-${index}`} id={`email-type-${index}`}
                                                                className="form-control"
                                                                value={email.type}
                                                                onChange={(e) => onInputChange(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-8 mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text">
                                                                <EnvelopeAt />
                                                            </span>
                                                            <input
                                                                type={"text"} id={`address-${index}`}
                                                                className="form-control"
                                                                placeholder="Enter email address"
                                                                name={`address-${index}`}
                                                                value={email.address}
                                                                onChange={(e) => onInputChange(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                
                                        { formData.contact.phones.map((phone, index) => (
                                            <div key={index}  className="px-1 px-md-3 pt-2 mb-3 border bg-light">
                                                <div className="d-flex justify-content-between mb-3">
                                                    <h5 className="text-primary">Phone: {index + 1}</h5>
                                                </div>
                                                <div className="form-group row">
                                                    <div className="col-sm-4 mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text">Type</span>
                                                            <input name={`phone-type-${index}`} id={`phone-type-${index}`}
                                                                className="form-control"
                                                                value={phone.type}
                                                                onChange={(e) => onInputChange(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3 mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text">
                                                                <Globe />
                                                            </span>
                                                            <input 
                                                                id={`country-code-${index}`}
                                                                className="form-control"
                                                                name={`country-code-${index}`}
                                                                value={phone.countryCode}
                                                                onChange={(e) => onInputChange(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-5 mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text">
                                                                <Telephone />
                                                            </span>
                                                            <input
                                                                type={"text"} id={`number-${index}`}
                                                                className="form-control"
                                                                placeholder="Phone number"
                                                                name={`number-${index}`}
                                                                value={phone.number}
                                                                onChange={(e) => onInputChange(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="text-center my-3">
                                <button type="submit" className="btn btn-outline-success mx-2 px-5" >
                                    {loading ? 'Updating...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

UpdatePerson.propTypes = {
    loading: PropTypes.bool, 
    formData: PropTypes.object, 
    onInputChange: PropTypes.func, 
    onSubmit: PropTypes.func,
}

export default UpdatePerson
