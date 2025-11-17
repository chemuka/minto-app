import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { EnvelopeAt, EnvelopeFill, GeoAlt, Telephone } from 'react-bootstrap-icons'

const DEFAULT_CONTACT = {
    id: 0,
    addresses: [{ id: 0, type: "", street: "", city: "", state: "", zipcode: "", country: "" }],
    emails: [{ id: 0, type: "", address: "" }],
    phones: [{ id: 0, type: "", countryCode: "", number: "" }]
}

const ViewContactCard = (props) => {
    const { contact } = props
    const [viewContactData, setViewContactData] = useState(DEFAULT_CONTACT)

    useEffect(() => {
        if(contact) {
            setViewContactData(contact)
        }
    }, [contact])

    return (
        <>
            {/* Contact Details Card */}
            <div className="card mb-3">
                <div className="card-header bg-light">
                    <div className="d-flex text-primary">
                        <EnvelopeFill size={28} className='me-2'/>
                        <h4 className='text-bold'>Contact Details</h4>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">
                    <div className="container px-1 px-sm-3">
                        <div className="d-flex items-center mb-3">
                            <GeoAlt size={22} className='mt-1 mx-1' />
                            <h4 className="text-lg font-semibold"><strong>Addresses</strong></h4>
                        </div>
                        { viewContactData.addresses.map((address, index) => (
                            <div key={index} className="px-1 px-md-3 pt-2 mb-3 border bg-light">
                                <div className="d-flex justify-content-between mb-3">
                                    <h5 className="text-primary">Address: {index + 1}</h5>
                                </div>
                                <div className="form-group row row-cols-auto">
                                    <div className="col-12 col-xxl-3 mb-3">
                                        <div className="form-floating">
                                            <input 
                                                name={`address-type-${index}`} id={`address-type-${index}`}
                                                type="text" 
                                                className="form-control"
                                                value={address.type}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor={`address-type-${index}`}>Type</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-xxl-5 mb-3">
                                        <div className="form-floating">
                                            <input
                                                type={"text"} id={`street-${index}`}
                                                className="form-control"
                                                placeholder="Enter street address"
                                                name={`street-${index}`}
                                                value={address.street}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor={`street-${index}`}>Street</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-xxl-4 mb-3">
                                        <div className="form-floating">
                                            <input
                                                type={"text"} id={`city-${index}`}
                                                className="form-control"
                                                placeholder="Enter city"
                                                name={`city-${index}`}
                                                value={address.city}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor={`city-${index}`}>City</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-xxl-4 mb-3">
                                        <div className="form-floating">
                                            <input
                                                type={"text"} id={`state-${index}`}
                                                className="form-control"
                                                placeholder="Enter state"
                                                name={`state-${index}`}
                                                value={address.state}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor={`state-${index}`}>State</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-xxl-3 mb-3">
                                        <div className="form-floating">
                                            <input
                                                type={"text"} id={`zipcode-${index}`}
                                                className="form-control"
                                                placeholder="Enter zip code"
                                                name={`zipcode-${index}`}
                                                value={address.zipcode}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor={`zipcode-${index}`}>Zip Code</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-xxl-5 mb-3">
                                        <div className="form-floating">
                                            <input 
                                                className="form-control"
                                                id={`country-${index}`}
                                                name={`country-${index}`}
                                                value={address.country}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor={`country-${index}`}>Country</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    
                        
                        <div className="d-flex items-center my-3 pt-2">
                            <EnvelopeAt size={22} className='mt-1 mx-1' />
                            <h4 className="text-lg font-semibold"><strong>Emails</strong></h4>
                        </div>
                        { viewContactData.emails.map((email, index) => (
                            <div key={index}  className="px-1 px-md-3 pt-2 mb-3 border bg-light">
                                <div className="d-flex justify-content-between mb-3">
                                    <h5 className="text-primary">Email: {index + 1}</h5>
                                </div>
                                <div className="form-group row row-cols-auto">
                                    <div className="col-12 col-sm-4 mb-3">
                                        <div className="form-floating">
                                            <input name={`email-type-${index}`} id={`email-type-${index}`}
                                                className="form-control"
                                                value={email.type}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor={`email-type-${index}`}>Type</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-8 mb-3">
                                        <div className="form-floating">
                                            <input
                                                type={"email"} id={`address-${index}`}
                                                className="form-control"
                                                placeholder="Email address"
                                                name={`address-${index}`}
                                                value={email.address}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor={`address-${index}`}>Email Address</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        
                        <div className="d-flex items-center my-3 pt-1">
                            <Telephone size={22} className='mt-1 mx-1' />
                            <h4 className="text-lg font-semibold"><strong>Phones</strong></h4>
                        </div>
                        { viewContactData.phones.map((phone, index) => (
                            <div key={index}  className="px-1 px-md-3 pt-2 mb-3 border bg-light">
                                <div className="d-flex justify-content-between mb-3">
                                    <h5 className="text-primary">Phone: {index + 1}</h5>
                                </div>
                                <div className="form-group row row-cols-auto">
                                    <div className="col-12 col-sm-6 col-xl-4 mb-3">
                                        <div className="form-floating">
                                            <input name={`phone-type-${index}`} id={`phone-type-${index}`}
                                                className="form-control"
                                                value={phone.type}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor={`phone-type-${index}`}>Type</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-xl-3 mb-3">
                                        <div className="form-floating">
                                            <input 
                                                id={`country-code-${index}`}
                                                className="form-control"
                                                name={`country-code-${index}`}
                                                value={phone.countryCode}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor={`country-code-${index}`}>Country Code</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-xl-5 mb-3">
                                        <div className="form-floating">
                                            <input
                                                type={"text"} id={`number-${index}`}
                                                className="form-control"
                                                placeholder="Phone number"
                                                name={`number-${index}`}
                                                value={phone.number}
                                                disabled
                                                readOnly
                                            />
                                            <label htmlFor={`number-${index}`}>Number</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

ViewContactCard.propTypes = {
    contact: PropTypes.object,
}

export default ViewContactCard
