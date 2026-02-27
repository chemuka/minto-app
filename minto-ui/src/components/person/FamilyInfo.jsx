import { Heart } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import ChildrenForm from './ChildrenForm';
import SpousesForm from './SpousesForm';

const FamilyInfo = (props) => {
    const { formData, addPersonToArray, renderPersonForm, formErrors } = props;

    console.log('family: ', formErrors)
    return (
        <>
            <div className='card'>
                <div className="card-header text-white" style={{ backgroundColor: 'crimson'}}>
                    <div className="d-flex">
                        <Heart size={28} className='me-2 text-white' />
                        <h3 className='text-bold text-white'>Family Information</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">

                    {/* Spouses Section */}
                    <SpousesForm
                        formData={formData}
                        addPersonToArray={addPersonToArray}
                        renderPersonForm={renderPersonForm}
                        formErrors={formErrors}
                    />

                    {/* Children Section */}
                    <ChildrenForm 
                        formData={formData} 
                        addPersonToArray={addPersonToArray} 
                        renderPersonForm={renderPersonForm} 
                        formErrors={formErrors}
                    />
                </div>
            </div>
        </>
    )
}

FamilyInfo.propTypes = {
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

export default FamilyInfo