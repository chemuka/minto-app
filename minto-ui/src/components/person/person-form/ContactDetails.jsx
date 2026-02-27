import { EnvelopeFill } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import AddressDetails from './AddressDetails';
import EmailDetails from './EmailDetails';
import PhoneDetails from './PhoneDetails';

const ContactDetails = (props) => {
    const { index, title, arrayName, person, updateContactForPerson, removeContactForPerson, 
        addContactForPerson, formErrors } = props;

    return (
        <>
            <div key={index} className='card mb-3'>
                <div className="card-header">
                    <div className="d-flex">
                        <EnvelopeFill size={24} className='me-2' />
                        <h5 className='text-bold'>{title} {index + 1} - Contacts</h5>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">
                    <AddressDetails 
                        index={index} 
                        title={title} 
                        arrayName={arrayName} 
                        person={person} 
                        updateContactForPerson={updateContactForPerson} 
                        removeContactForPerson={removeContactForPerson} 
                        addContactForPerson={addContactForPerson} 
                        formErrors={formErrors}
                    />  
                    
                    <EmailDetails 
                        index={index} 
                        title={title} 
                        arrayName={arrayName} 
                        person={person} 
                        updateContactForPerson={updateContactForPerson} 
                        removeContactForPerson={removeContactForPerson} 
                        addContactForPerson={addContactForPerson} 
                        formErrors={formErrors}
                    />    
 
                    <PhoneDetails 
                        index={index} 
                        title={title} 
                        arrayName={arrayName} 
                        person={person} 
                        updateContactForPerson={updateContactForPerson} 
                        removeContactForPerson={removeContactForPerson} 
                        addContactForPerson={addContactForPerson} 
                        formErrors={formErrors}
                    />    
                </div>
            </div>
        </>
    )
}

ContactDetails.propTypes = {
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    arrayName: PropTypes.string.isRequired,
    person: PropTypes.object.isRequired,
    updateContactForPerson: PropTypes.func.isRequired,
    removeContactForPerson: PropTypes.func.isRequired,
    addContactForPerson: PropTypes.func.isRequired,
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
        spouses: PropTypes.arrayOf(
            PropTypes.shape({
                maritalStatus: PropTypes.string,
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
            })
        ),
        children: PropTypes.arrayOf(
            PropTypes.shape({
                childType: PropTypes.string,
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
            })
        ),
    }),
}

export default ContactDetails