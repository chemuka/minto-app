import { PersonCircle, Plus } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

const ChildrenForm = (props) => {
    const { formData, addPersonToArray, renderPersonForm } = props;

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
                    renderPersonForm(child, 'children', index, 'Child')
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
}

export default ChildrenForm