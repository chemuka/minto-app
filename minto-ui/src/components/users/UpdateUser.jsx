import PropTypes from 'prop-types';
import PasswordGenerator from '../misc/PasswordGenerator';
import CustomSelect from '../misc/CustomSelect';
import { Upload } from 'react-bootstrap-icons';
import { useAuth } from '../hooks/useAuth';

const UpdateUser = (props) => {
    const { loading, formData, onInputChange, handleImageChange, handlePasswordChange, onSubmit } = props
    const { getUser, isAuthenticated } = useAuth()
    let user = getUser()

    return (
        <>
            <style>{` 
                .form-control::file-selector-button { 
                    background-color: #333;
                    color: #4af;
                    border: 1px solid #333;
                    padding: .375rem .75rem;
                    border-radius: .25rem;
                }  
                .form-control::file-selector-button::hover {
                    background-color: #777;
                    border: 1px solid #777;
                    color: #333;
                }
              `}
            </style>
            {
                isAuthenticated && (user.decoded.role === 'Admin' || user.decoded.role === 'Staff') ? (
                    <div className="card mt-4 mb-3 border">
                        <div className="card-header text-white bg-dark">
                            <h5 className="card-title">Edit User</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={(e) => onSubmit(e)} action="">
                                <div className="border rounded-lg p-1 p-sm-4 mb-3 bg-light">
                                    <div className="form-group row">
                                        <div className="col-sm-12 mb-3">
                                            <label htmlFor="email" className="form-label text-dark h5">
                                                Email:
                                            </label>
                                            <span 
                                                className="ms-3 h5 text-primary"
                                            >
                                                {formData.email}
                                            </span>
                                            
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3">
                                            <label htmlFor="firstName" className="form-label text-dark h6">
                                                First Name:
                                            </label>
                                            <input
                                                type={"text"}
                                                className="form-control"
                                                placeholder="First name"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => onInputChange(e)}
                                            />
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <label htmlFor="lastName" className="form-label text-dark h6">
                                                Last Name:
                                            </label>
                                            <input
                                                type={"text"}
                                                className="form-control"
                                                placeholder="Last name"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => onInputChange(e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3">
                                            <label htmlFor="password" className="form-label text-dark h6">
                                                Password:
                                            </label>
                                            <PasswordGenerator
                                                className={'text-dark'}
                                                id="password"
                                                name="password"
                                                placeholder="Type or generate password"
                                                onChange={handlePasswordChange}
                                            />
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <label htmlFor="role" className="form-label text-dark h6">
                                                Role:
                                            </label>
                                            <CustomSelect
                                                className="form-select mb-3"
                                                name="role"
                                                value={formData.role}
                                                placeholder=" -- Select a role -- "
                                                onChange={(e) => onInputChange(e)}
                                                url="http://localhost:8080/api/v1/auth/roles"
                                            />
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-sm-10 mb-3">
                                                <label htmlFor="picture" className="form-label text-dark h6">
                                                    Picture
                                                </label>
                                                <input
                                                    type={"file"}
                                                    className="form-control"
                                                    name="picture"
                                                    onChange={handleImageChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center my-3">
                                        <button type="submit" className="btn btn-outline-success mx-2 px-4" title="Update User" >
                                            <Upload size={20} className="m-0 me-sm-2 mb-1" />
                                            <span className="d-none d-sm-inline-block">
                                                {loading ? 'Updating...' : 'Update'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="container my-3 p-2">
                        <h3 className="text-primary text-center">Unauthorized</h3>
                    </div>
                )
            }
        </>
    )
}

UpdateUser.propTypes = {
    loading: PropTypes.bool, 
    formData: PropTypes.object, 
    onInputChange: PropTypes.func, 
    handleImageChange: PropTypes.func,
    handlePasswordChange: PropTypes.func, 
    onSubmit: PropTypes.func,
}

export default UpdateUser
