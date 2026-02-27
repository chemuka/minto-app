import { PersonHeart, Plus } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

const SpousesForm = (props) => {
    const { formData, addPersonToArray, renderPersonForm, formErrors } = props;

    console.log(`Spouses: `, formErrors)
    return (
        <>
            <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg border shadow">
                <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                    <div className="d-flex items-center">
                        <PersonHeart size={32} className='mt-1 mx-1' style={{ color: 'crimson' }} />
                        <h3 
                            className="text-lg font-semibold"
                            style={{ color: 'crimson' }}
                        >
                            <strong>Spouses</strong>
                        </h3>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => addPersonToArray('spouses')}
                        className="d-flex btn text-center"
                        style={{ backgroundColor: 'crimson' }}
                        title={`Add Spouse`}
                    >
                        <Plus className="mb-1 text-white" size={21} />
                        <span className='d-none d-sm-flex text-white'>Add Spouse</span>
                    </button>
                </div>
            
                {formData.spouses.length === 0 ? (
                    <p className="text-secondary text-center py-4">No spouses added yet</p>
                ) : (
                    formData.spouses.map((spouse, index) => 
                    renderPersonForm(spouse, 'spouses', index, 'Spouse', formErrors)
                    )
                )}
            </div>
        </>
    )
}

SpousesForm.propTypes = {
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
        spouses: PropTypes.arrayOf(
            PropTypes.shape({
                maritalStatus: PropTypes.string,
                person: PropTypes.object
            })
        ),
        children: PropTypes.arrayOf(
            PropTypes.shape({
                childType: PropTypes.string,
                person: PropTypes.object
            })
        ),
        parents: PropTypes.arrayOf(
            PropTypes.shape({
                parentType: PropTypes.string,
                person: PropTypes.object
            })
        ),
        siblings: PropTypes.arrayOf(
            PropTypes.shape({
                siblingType: PropTypes.string,
                person: PropTypes.object
            })
        ),
        referees: PropTypes.arrayOf(
            PropTypes.shape({
                membershipNumber: PropTypes.string,
                person: PropTypes.object
            })
        ),
        relatives: PropTypes.arrayOf(
            PropTypes.shape({
                membershipNumber: PropTypes.string,
                familyRelationship: PropTypes.string,
                person: PropTypes.object,
            })
        ),
        beneficialries: PropTypes.arrayOf(
            PropTypes.shape({
                percent: PropTypes.number,
                relationship: PropTypes.string,
                person: PropTypes.object,
            })
        ),
    }),
}

export default SpousesForm