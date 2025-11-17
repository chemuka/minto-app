import { useEffect, useState } from "react"
import { toast } from "sonner"
import { EnvelopeAt, EnvelopeFill, Floppy, GeoAlt, PersonFill, Plus, Telephone, Trash, XCircleFill } from "react-bootstrap-icons"
import countriesData from '../../../assets/data/countries.json';
import useConfirmation from "../../hooks/useConfirmation";
import ConfirmationModal from "../../misc/modals/ConfirmationModal";
import { useAuth } from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const DEFAULT_PERSON = {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    lifeStatus: "",
    contact: {
        addresses: [{ type: "", street: "", city: "", state: "", zipcode: "", country: "" }],
        emails: [{ type: "", address: "" }],
        phones: [{ type: "", countryCode: "", number: "" }]
    }
}

const CreatePerson = () => {
    const navigate = useNavigate()
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    const { isAuthenticated } = useAuth()
    const { fetchWithAuth } = useFetch()
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(DEFAULT_PERSON)

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
            }, 3000) 

            return () => clearTimeout(timerId)
        }
    }, [message])

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('Creating a new person...')
        
        try {
            if(isAuthenticated) {
                const response = await fetchWithAuth('http://localhost:8080/api/v1/people', {
                    method: 'POST',
                    credentials: "include",
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData), 
                })

                if(!response.ok) {
                    console.log(`HTTP error! status: ${response.status}`)
                    toast.error('HTTP error!')
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const jsonData = await response.json();
                //console.log(jsonData)
                setFormData(DEFAULT_PERSON)
                setMessage(`Person: ${jsonData.firstName} ${jsonData.lastName} created successfully!`)
                toast.success(`Person: ${jsonData.firstName} ${jsonData.lastName} created successfully!`)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const addContact = (type) => {
        const newContact = type === 'addresses' 
        ? { type: "", street: "", city: "", state: "", zipcode: "", country: "" }
        : type === 'emails'
        ? { type: "", address: "" }
        : { type: "", countryCode: "", number: "" };

        setFormData(prev => ({
        ...prev,
            contact: {
            ...prev.contact,
            [type]: [...prev.contact[type], newContact]
            }
        }));
    };

    const removeContact = (type, index) => {
        setFormData(prev => ({
        ...prev,
            contact: {
            ...prev.contact,
            [type]: prev.contact[type].filter((_, i) => i !== index)
            }
        }));
    };

    const updateContact = (type, index, field, value) => {
        setFormData(prev => ({
        ...prev,
            contact: {
            ...prev.contact,
            [type]: prev.contact[type].map((contact, i) => 
                i === index ? { ...contact, [field]: value } : contact
            )
            }
        }))
    }

    const cancel = async () => {
        const confirmation = await showConfirmation('Are you sure you want to cancel "Create New Person"?')
        if(confirmation) {
            setFormData(DEFAULT_PERSON)
            console.log("Create New Person Cancelled! The form is reset.")
            toast.info('"Create New Person" -> Cancelled!', {
                description: "The form has been reset."
            })
            navigate('/login')
        } else {
            console.log("Cancel Aborted! Continue with 'Create New Person'.")
            toast.info("Cancel -> Aborted!", {
                description: 'Continue with "Create New Person" form.'
            })
        }
    }

    return (
        <>
            {
                isAuthenticated ? (
                    <div className="container my-3 py-2 px-0">
                        <form onSubmit={(e) => onSubmit(e)} action="" method="post">
                            <div className='card mb-4 border border-info shadow'>
                                <div className="card-header bg-info">
                                    <div className="d-flex">
                                        <PersonFill size={30} className='me-2' />
                                        <h3>Create Person</h3>
                                    </div>
                                </div>
                                <div className="card-body px-1 px-sm-3">
                                    <div className="form-group row">
                                        <div className="col-sm-4 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type={"text"}
                                                    className="form-control"
                                                    placeholder="First Name"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={(e) => onInputChange(e)}
                                                />
                                                <label htmlFor={"firstName"}>First Name*</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type={"text"}
                                                    className="form-control"
                                                    placeholder="Middle name"
                                                    name="middleName"
                                                    value={formData.middleName}
                                                    onChange={(e) => onInputChange(e)}
                                                />
                                                <label htmlFor={"middleName"}>Middle Name</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type={"text"}
                                                    className="form-control"
                                                    placeholder="Last name"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={(e) => onInputChange(e)}
                                                />
                                                <label htmlFor={"lastName"}>Last Name*</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type={"date"}
                                                    className="form-control"
                                                    name="dob"
                                                    value={formData.dob}
                                                    onChange={(e) => onInputChange(e)}
                                                />
                                                <label htmlFor={"dob"}>Date Of Birth*</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <div className="form-floating">
                                                <select 
                                                    className="form-select" 
                                                    name="lifeStatus" 
                                                    id="lifeStatus"
                                                    value={formData.lifeStatus}
                                                    onChange={(e) => onInputChange(e)}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="Living">Living</option>
                                                    <option value="Deceased">Deceased</option>
                                                </select>
                                                <label htmlFor={"lifeStatus"}>Life Status</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='card mt-3'>
                                    <div className="card-header bg-light">
                                        <div className="d-flex">
                                            <EnvelopeFill size={28} className='me-2 text-primary' />
                                            <h4 className='text-bold text-primary'>Contact Details</h4>
                                        </div>
                                    </div>
                                    <div className="card-body px-1 px-sm-3">
                                        {/* Addresses */}
                                        <div className="container p-6 mb-4 rounded-lg border">
                                            <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                                                <div className="d-flex items-center">
                                                    <GeoAlt size={22} className='mt-1 mx-1' />
                                                    <h4 className="text-lg font-semibold"><strong>Addresses</strong></h4>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    className="d-flex btn text-center" 
                                                    onClick={() => addContact('addresses')}
                                                    style={{ backgroundColor: 'black' }}
                                                    title="Add Address"
                                                >
                                                    <Plus className="mb-1" color="white" size={21} />
                                                    <span className='d-none d-sm-flex text-white'>Address</span>
                                                </button>
                                            </div>
                                        
                                            {formData.contact.addresses.map((address, index) => (
                                                <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                                    <div className="d-flex justify-content-between items-center mb-3">
                                                        <span className="font-medium"><strong>Address {index + 1}</strong></span>
                                                        {formData.contact.addresses.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeContact('addresses', index)}
                                                            className="bg-light text-danger p-2"
                                                            title="Remove Address"
                                                        >
                                                            <Trash size={24} />
                                                        </button>
                                                        )}
                                                    </div>

                                                    <div className="form-group row">
                                                        <div className="col-sm-5 mb-3">
                                                            <div className="form-floating">
                                                                <select
                                                                    id={`address-type-${index}`}
                                                                    value={address.type}
                                                                    onChange={(e) => updateContact('addresses', index, 'type', e.target.value)}
                                                                    className="form-select"
                                                                >
                                                                    <option value="">Select...</option>
                                                                    <option value="Home">Home</option>
                                                                    <option value="Work">Work</option>
                                                                    <option value="School">School</option>
                                                                    <option value="Mailing">Mailing</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                                <label htmlFor={`address-type-${index}`}>Type</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-7 mb-3">
                                                            <div className="form-floating">
                                                                <input
                                                                    id={`address-street-${index}`}
                                                                    type={"text"}
                                                                    placeholder="Street Address"
                                                                    value={address.street}
                                                                    onChange={(e) => updateContact('addresses', index, 'street', e.target.value)}
                                                                    className="form-control"
                                                                />
                                                                <label htmlFor={`address-street-${index}`}>Street</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <div className="col-sm-5 mb-3">
                                                            <div className="form-floating">
                                                                <input
                                                                    id={`address-city-${index}`}
                                                                    type={"text"}
                                                                    placeholder="City"
                                                                    value={address.city}
                                                                    onChange={(e) => updateContact('addresses', index, 'city', e.target.value)}
                                                                    className="form-control"
                                                                />
                                                                <label htmlFor={`address-city-${index}`}>City</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-7 mb-3">
                                                            <div className="form-floating">
                                                                <input
                                                                    id={`address-state-${index}`}
                                                                    type={"text"}
                                                                    placeholder="State"
                                                                    value={address.state}
                                                                    onChange={(e) => updateContact('addresses', index, 'state', e.target.value)}
                                                                    className="form-control"
                                                                />
                                                                <label htmlFor={`address-state-${index}`}>State</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <div className="col-sm-5 mb-3">
                                                            <div className="form-floating">
                                                                <input
                                                                    id={`address-zipcode-${index}`}
                                                                    type={"text"}
                                                                    placeholder="ZIP Code"
                                                                    value={address.zipcode}
                                                                    onChange={(e) => updateContact('addresses', index, 'zipcode', e.target.value)}
                                                                    className="form-control"
                                                                />
                                                                <label htmlFor={`address-zipcode-${index}`}>Zip Code</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-7 mb-3">
                                                            <div className="form-floating">
                                                                <select 
                                                                    id={`country-${index}`}
                                                                    name={`country-${index}`}
                                                                    className="form-select"
                                                                    value={address.country}
                                                                    onChange={(e) => updateContact('addresses', index, 'country', e.target.value)}
                                                                >
                                                                    <option key={'nil'} value="">Select...</option>
                                                                    {countriesData.map((country) => (
                                                                        <option key={country.cca2} value={country.name}>
                                                                            {country.flag} {country.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <label htmlFor={`country-${index}`}>Country</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Emails */}
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
                                                    title="Add Email"
                                                >
                                                    <Plus className="mb-1" color="white" size={21} />
                                                    <span className='d-none d-sm-flex text-white'>Email</span>
                                                </button>
                                            </div>
                                
                                            {formData.contact.emails.map((email, index) => (
                                                <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                                    <div className="mb-2">
                                                        <span className="font-medium"><strong>Email {index + 1}</strong></span>
                                                    </div>
                                                    <div className="form-group row">
                                                        <div className="col-sm-4 mb-3">
                                                            <div className="form-floating">
                                                                <select
                                                                    id={`email-type-${index}`}
                                                                    value={email.type}
                                                                    onChange={(e) => updateContact('emails', index, 'type', e.target.value)}
                                                                    className="form-select"
                                                                >
                                                                    <option value="">Select...</option>
                                                                    <option value="Personal">Personal</option>
                                                                    <option value="Work">Work</option>
                                                                    <option value="School">School</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                                <label htmlFor={`email-type-${index}`}>Type</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-7 mb-3">
                                                            <div className="form-floating">
                                                                <input
                                                                    id={`email-address-${index}`}
                                                                    type={"email"}
                                                                    placeholder="Email Address"
                                                                    value={email.address}
                                                                    onChange={(e) => updateContact('emails', index, 'address', e.target.value)}
                                                                    className="form-control"
                                                                />
                                                                <label htmlFor={`email-address-${index}`}>Address</label>
                                                            </div>
                                                        </div>
                                                        {formData.contact.emails.length > 1 && (
                                                            <div className="col-sm-1 mb-3 mt-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeContact('emails', index)}
                                                                    className="bg-light text-danger"
                                                                    title="Remove Email"
                                                                >
                                                                    <Trash size={24} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Phones */}
                                        <div className="container p-6 mb-4 rounded-lg border">
                                            <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                                                <div className="d-flex items-center">
                                                    <Telephone size={22} className='mt-1 mx-1' />
                                                    <h4 className="text-lg font-semibold"><strong>Phones</strong></h4>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    className="d-flex btn text-center" 
                                                    onClick={() => addContact('phones')}
                                                    style={{ backgroundColor: 'black' }}
                                                    title="Add Phone"
                                                >
                                                    <Plus className="mb-1" color="white" size={21} />
                                                    <span className='d-none d-sm-flex text-white'>Phone No.</span>
                                                </button>
                                            </div>
                                            
                                            {formData.contact.phones.map((phone, index) => (
                                                <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                                                    <div className="mb-2">
                                                        <span className="font-medium"><strong>Phone {index + 1}</strong></span>
                                                    </div>
                                                    <div className="form-group row">
                                                        <div className="col-sm-5 mb-3">
                                                            <div className="form-floating">
                                                                <select
                                                                    id={`phone-type-${index}`}
                                                                    value={phone.type}
                                                                    onChange={(e) => updateContact('phones', index, 'type', e.target.value)}
                                                                    className="form-select"
                                                                >
                                                                    <option value="">Select...</option>
                                                                    <option value="Mobile">Mobile</option>
                                                                    <option value="Home">Home</option>
                                                                    <option value="Work">Work</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                                <label htmlFor={`phone-type-${index}`}>Type</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <div className="col-sm-4 mb-3">
                                                            <div className="form-floating">
                                                                <select 
                                                                    id={`country-code-${index}`}
                                                                    className="form-select"
                                                                    name={`country-code-${index}`}
                                                                    value={phone.countryCode}
                                                                    onChange={(e) => updateContact('phones', index, 'countryCode', e.target.value)}
                                                                >
                                                                    <option value="">Select...</option>
                                                                    {countriesData.map((country) => (
                                                                        <option key={country.cca2} value={`${country.flag} +${country.code}`}>
                                                                            {country.flag} +{country.code}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <label htmlFor={`country-code-${index}`}>Country Code</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-7 mb-3">
                                                            <div className="form-floating">
                                                                <input
                                                                    id={`phone-number-${index}`}
                                                                    type={"tel"}
                                                                    placeholder="Phone Number"
                                                                    value={phone.number}
                                                                    onChange={(e) => updateContact('phones', index, 'number', e.target.value)}
                                                                    className="form-control"
                                                                />
                                                                <label htmlFor={`phone-number-${index}`}>Phone Number</label>
                                                            </div>
                                                        </div>
                                                        {formData.contact.phones.length > 1 && (
                                                            <div className="col-sm-1 mb-3 mt-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeContact('phones', index)}
                                                                    className="bg-light text-danger"
                                                                    title="Remove Phone"
                                                                >
                                                                    <Trash size={24} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center my-3">
                                    <button type='button' onClick={cancel} className="btn btn-outline-danger mx-3" title="Cancel Create Person">
                                        <XCircleFill size={20} className="m-0 me-sm-2 mb-1" />
                                        <span className="d-none d-sm-inline-block">Cancel</span>
                                    </button>
                                    <ConfirmationModal
                                        show={show}
                                        message={confirmMsg}
                                        onConfirm={handleConfirm}
                                        onCancel={handleCancel}
                                    />
                                    <button type="submit" className="btn btn-outline-success mx-3 px-4" title="Save Create Person">
                                        <Floppy size={20} className="m-0 me-sm-2 mb-1" />
                                        <span className="d-none d-sm-inline-block">
                                            {loading ? 'Saving...' : 'Save'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            
                        </form>
                    </div>
                ) : (
                    <div className="container my-3 p-2">
                        <h3 className="text-primary text-center">Unauthorized</h3>
                    </div>
                )
            }
        </>
    )
}

export default CreatePerson
