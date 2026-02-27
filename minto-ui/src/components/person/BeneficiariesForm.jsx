import { PersonHearts, Plus } from 'react-bootstrap-icons'
import PropTypes from 'prop-types';

const BeneficiariesForm = (props) => {
    const { formData, addPersonToArray, renderPersonForm, formErrors } = props;

    return (
        <>
            <div className='card'>
                <div className="card-header text-white" style={{ backgroundColor: 'saddlebrown' }}>
                    <div className="d-flex">
                        <PersonHearts size={28} className='me-2 text-white' />
                        <h3 className='text-bold text-white'>Beneficiaries</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">

                    {/* Beneficiaries Section */}
                    <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg border">
                        <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                            <div className="d-flex items-center">
                                <PersonHearts size={32} className='mt-1 mx-1' style={{ color: 'saddlebrown' }} />
                                <h3 
                                    className="text-lg font-semibold"
                                    style={{ color: 'saddlebrown' }}
                                >
                                    <strong>Beneficiaries</strong>
                                </h3>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => addPersonToArray('beneficiaries')}
                                className="d-flex btn text-center"
                                style={{ backgroundColor: 'saddlebrown'}}
                                title={`Add Beneficiary`}
                            >
                                <Plus className="mb-1 text-white" size={21} />
                                <span className='d-none d-sm-flex text-white'>Add Beneficiary</span>
                            </button>
                        </div>
                    
                        {formData.beneficiaries.length === 0 ? (
                            <p className="text-secondary text-center py-4">No beneficiaries added yet</p>
                        ) : (
                            formData.beneficiaries.map((beneficiary, index) => 
                            renderPersonForm(beneficiary, 'beneficiaries', index, 'Beneficiary', formErrors)
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

BeneficiariesForm.propTypes = {
    formData: PropTypes.object.isRequired,
    addPersonToArray: PropTypes.func.isRequired,
    renderPersonForm: PropTypes.func.isRequired,
    formErrors: PropTypes.object,
}

export default BeneficiariesForm;