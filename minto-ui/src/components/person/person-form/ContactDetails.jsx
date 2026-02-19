import { EnvelopeFill } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import AddressDetails from './AddressDetails';
import EmailDetails from './EmailDetails';
import PhoneDetails from './PhoneDetails';

const ContactDetails = (props) => {
    const { index, title, arrayName, person, updateContactForPerson, removeContactForPerson, addContactForPerson } = props;

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
                    <AddressDetails index={index} title={title} arrayName={arrayName} person={person} updateContactForPerson={updateContactForPerson} removeContactForPerson={removeContactForPerson} addContactForPerson={addContactForPerson} />  
                    
                    <EmailDetails index={index} title={title} arrayName={arrayName} person={person} updateContactForPerson={updateContactForPerson} removeContactForPerson={removeContactForPerson} addContactForPerson={addContactForPerson} />    
 
                    <PhoneDetails index={index} title={title} arrayName={arrayName} person={person} updateContactForPerson={updateContactForPerson} removeContactForPerson={removeContactForPerson} addContactForPerson={addContactForPerson} />    
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
    addContactForPerson: PropTypes.func.isRequired
}

export default ContactDetails