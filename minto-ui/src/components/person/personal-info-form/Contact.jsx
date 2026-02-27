import { EnvelopeFill } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import Addresses from './Addresses';
import Emails from './Emails';
import Phones from './Phones';

const Contact = (props) => {
    const { formData, updateContact, addContact, removeContact, formErrors, setFormErrors } = props;

    return (
        <>
            <div className='card'>
                <div className="card-header bg-light">
                    <div className="d-flex">
                        <EnvelopeFill size={28} className='me-2 text-primary' />
                        <h4 className='text-bold text-primary'>Contact Details</h4>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">
                    <Addresses 
                        formData={formData} 
                        updateContact={updateContact} 
                        addContact={addContact} 
                        removeContact={removeContact}
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />   
                    
                    <Emails 
                        formData={formData} 
                        updateContact={updateContact} 
                        addContact={addContact} 
                        removeContact={removeContact}
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />  

                    <Phones 
                        formData={formData} 
                        updateContact={updateContact} 
                        addContact={addContact} 
                        removeContact={removeContact}
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />  
                </div>
            </div>
        </>
    )
}

Contact.propTypes = {
    formData: PropTypes.object,
    updateContact: PropTypes.func,
    addContact: PropTypes.func,
    removeContact: PropTypes.func,
    setFormErrors: PropTypes.func,
    formErrors: PropTypes.shape({
        formData: PropTypes.shape({
            person: PropTypes.shape({
                firstName: PropTypes.string,
                middleName: PropTypes.string,
                lastName: PropTypes.string,
                dob: PropTypes.string,
                lifeStatus: PropTypes.string,
                maritalStatus: PropTypes.string,
                applicationStatus: PropTypes.string,
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
    }),
}

export default Contact