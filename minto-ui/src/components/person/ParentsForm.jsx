import { People, PeopleFill, Plus } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

const ParentsForm = (props) => {
    const { formData, addPersonToArray, renderPersonForm, formErrors } = props;
    return (
        <>
            <div className='card'>
                <div className="card-header text-white" style={{ backgroundColor: 'purple' }}>
                    <div className="d-flex">
                        <People size={28} className='me-2 text-white' />
                        <h3 className='text-bold text-white'>Parents Information</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">

                    {/* Parents Section */}
                    <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg border">
                        <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                            <div className="d-flex items-center">
                                <PeopleFill size={32} className='mt-1 mx-1' style={{ color: 'purple' }} />
                                <h3 
                                    className="text-lg font-semibold"
                                    style={{ color: 'purple' }}
                                >
                                    <strong>Parents</strong>
                                </h3>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => addPersonToArray('parents')}
                                className="d-flex btn text-center"
                                style={{ backgroundColor: 'purple' }}
                                title={`Add Parent`}
                            >
                                <Plus className="mb-1 text-white" size={21} />
                                <span className='d-none d-sm-flex text-white'>Add Parent</span>
                            </button>
                        </div>
                    
                        {formData.parents.length === 0 ? (
                            <p className="text-secondary text-center py-4">No parents added yet</p>
                        ) : (
                            formData.parents.map((parent, index) => 
                            renderPersonForm(parent, 'parents', index, 'Parent', formErrors)
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

ParentsForm.propTypes = {
    formData: PropTypes.object.isRequired,
    addPersonToArray: PropTypes.func.isRequired,
    renderPersonForm: PropTypes.func.isRequired,
    formErrors: PropTypes.object,
}

export default ParentsForm