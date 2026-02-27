import { PersonCircle, Plus } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

const ChildrenForm = (props) => {
    const { formData, addPersonToArray, renderPersonForm, formErrors } = props;

    return (
        <>
            <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg border shadow">
                <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                    <div className="d-flex items-center">
                        <PersonCircle size={32} className='mt-1 mx-1' style={{ color: 'limegreen' }} />
                        <h3 
                            className="text-lg font-semibold"
                            style={{ color: 'limegreen' }}
                        >
                            <strong>Children</strong>
                        </h3>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => addPersonToArray('children')}
                        className="d-flex btn text-center"
                        style={{ backgroundColor: 'limegreen' }}
                        title={`Add Child`}
                    >
                        <Plus className="mb-1 text-white" size={21} />
                        <span className='d-none d-sm-flex text-white'>Add Child</span>
                    </button>
                </div>
            
                {formData.children.length === 0 ? (
                    <p className="text-secondary text-center py-4">No children added yet</p>
                ) : (
                    formData.children.map((child, index) => 
                    renderPersonForm(child, 'children', index, 'Child', formErrors)
                    )
                )}
            </div>
        </>
    )
}

ChildrenForm.propTypes = {
    formData: PropTypes.object.isRequired,
    addPersonToArray: PropTypes.func.isRequired,
    renderPersonForm: PropTypes.func.isRequired,
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
        children: PropTypes.arrayOf(
            PropTypes.shape({
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

export default ChildrenForm