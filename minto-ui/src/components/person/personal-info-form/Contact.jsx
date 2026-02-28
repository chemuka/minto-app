import { EnvelopeFill } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import Addresses from './Addresses';
import Emails from './Emails';
import Phones from './Phones';
import ConfirmationModal from '../../misc/modals/ConfirmationModal';
import useConfirmation from '../../hooks/useConfirmation';
import { toast } from 'sonner';

const Contact = (props) => {
    const { formData, updateContact, addContact, removeContact, formErrors, setFormErrors } = props;
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()

    const deleteContact = async (contactType, index) => {
        const typeStr = contactType === 'addresses' ? 'address' 
            : contactType === 'emails' ? 'email' 
            : 'phone';
        const confirmation = await showConfirmation(`Are you sure you want to delete this ${typeStr} record?`)
        if(confirmation) {
            removeContact(contactType, index);
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
                        deleteContact={deleteContact}
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />
                    
                    <Emails 
                        formData={formData} 
                        updateContact={updateContact} 
                        addContact={addContact} 
                        deleteContact={deleteContact}
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />

                    <Phones 
                        formData={formData} 
                        updateContact={updateContact} 
                        addContact={addContact} 
                        deleteContact={deleteContact}
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

Contact.propTypes = {
    formData: PropTypes.object,
    updateContact: PropTypes.func,
    addContact: PropTypes.func,
    removeContact: PropTypes.func,
    setFormErrors: PropTypes.func,
    formErrors: PropTypes.object,
}

export default Contact