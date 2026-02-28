import { EnvelopeFill } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import AddressDetails from './AddressDetails';
import EmailDetails from './EmailDetails';
import PhoneDetails from './PhoneDetails';
import ConfirmationModal from '../../misc/modals/ConfirmationModal';
import useConfirmation from '../../hooks/useConfirmation';
import { toast } from 'sonner';

const ContactDetails = (props) => {
    const { index, title, arrayName, person, updateContactForPerson, removeContactForPerson, 
        addContactForPerson, formErrors, setFormErrors } = props;
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    
    const deleteContactForPerson = async (arrayName, index, contactType, contactIndex) => {
        const typeStr = contactType === 'addresses' ? 'address' 
            : contactType === 'emails' ? 'email' 
            : 'phone';
        const confirmation = await showConfirmation(`Are you sure you want to delete this ${typeStr} record?`)
        if(confirmation) {
            removeContactForPerson(arrayName, index, contactType, contactIndex);
            console.log(`${typeStr} record deleted!.`)
            toast.info("Delete successful!", {
                description: `${typeStr} record deleted.`,
            })
        } else {
            console.log(`Delete Aborted! Continue working on the ${typeStr} record.`)
            toast.info(`Delete -> Aborted!`, {
                description: `Continue working on the ${typeStr} record.`,
            })
        }
    }

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
                        deleteContactForPerson={deleteContactForPerson} 
                        addContactForPerson={addContactForPerson} 
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />  
                    
                    <EmailDetails 
                        index={index} 
                        title={title} 
                        arrayName={arrayName} 
                        person={person} 
                        updateContactForPerson={updateContactForPerson} 
                        deleteContactForPerson={deleteContactForPerson} 
                        addContactForPerson={addContactForPerson} 
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />    
 
                    <PhoneDetails 
                        index={index} 
                        title={title} 
                        arrayName={arrayName} 
                        person={person} 
                        updateContactForPerson={updateContactForPerson} 
                        deleteContactForPerson={deleteContactForPerson} 
                        addContactForPerson={addContactForPerson} 
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />

                    <ConfirmationModal
                        show={show}
                        message={confirmMsg}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
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
    formErrors: PropTypes.object,
    setFormErrors: PropTypes.func,
}

export default ContactDetails