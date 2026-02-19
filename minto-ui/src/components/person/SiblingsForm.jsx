import { PersonArmsUp, Plus } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

const SiblingsForm = (props) => {
    const { formData, addPersonToArray, renderPersonForm } = props;

  return (
    <>
        <div className='card'>
            <div className="card-header text-white" style={{ backgroundColor: 'orange' }}>
                <div className="d-flex">
                    <PersonArmsUp size={28} className='me-2 text-white' />
                    <h3 className='text-bold text-white'>Siblings Information</h3>
                </div>
            </div>
            <div className="card-body px-1 px-sm-3">

                {/* Siblings Section */}
                <div className="container py-6 px-sm-6 mb-4 rounded-lg border">
                    <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                        <div className="d-flex items-center">
                            <PersonArmsUp size={32} className='mt-1 mx-1' style={{ color: 'orange' }} />
                            <h3 
                                className="text-lg font-semibold"
                                style={{ color: 'orange' }}
                            >
                                <strong>Siblings</strong>
                            </h3>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => addPersonToArray('siblings')}
                            className="d-flex btn text-center"
                            style={{ backgroundColor: 'orange' }}
                            title={`Add Sibling`}
                        >
                            <Plus className="mb-1 text-white" size={21} />
                            <span className='d-none d-sm-flex text-white'>Add Sibling</span>
                        </button>
                    </div>
                
                    {formData.siblings.length === 0 ? (
                        <p className="text-secondary text-center py-4">No siblings added yet</p>
                    ) : (
                        formData.siblings.map((sibling, index) => 
                        renderPersonForm(sibling, 'siblings', index, 'Sibling')
                        )
                    )}
                </div>
            </div>
        </div>
    </>
  )
}

SiblingsForm.propTypes = {
    formData: PropTypes.object.isRequired,
    addPersonToArray: PropTypes.func.isRequired,
    renderPersonForm: PropTypes.func.isRequired,
}

export default SiblingsForm