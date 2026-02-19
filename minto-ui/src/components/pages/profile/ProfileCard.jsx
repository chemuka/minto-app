import PropTypes from 'prop-types'
import { CalendarCheck, CalendarPlus, EnvelopeAt, FolderSymlink, PersonBadge } from 'react-bootstrap-icons'

const ProfileCard = (props) => {
    const { profileData } = props

    return (
        <>
            <div className='card mb-3'>
                <div className="card-header" style={{ background: 'darkgreen'}}>
                    <div className="d-flex">
                        <h3 className='ms-1 text-white'>Profile</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">
                    <div className="form-group row mb-3">
                        <div className="col-lg-6 col-xl-4 mb-3">
                            <div className='d-flex flex-column align-items-center justify-content-center mb-3'>
                                {
                                    profileData.picture ? (
                                        <img src={profileData.picture} alt="Profile Picture" style={{ maxWidth: '150px', maxHeight: '150px' }} />
                                    ) : (
                                        <img src="./images/dashboard/Avatar.PNG" alt="Test Profile Picture" style={{ maxWidth: '150px', maxHeight: '150px' }} />
                                    )
                                }
                            </div>
                            <div className='d-flex flex-column align-items-center justify-content-center mb-3'>
                                <span className="h4 fw-bold" style={{ color: 'darkgreen'}}>
                                    {profileData.lastName},&nbsp;
                                    {profileData.firstName}
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-4 ps-3 mb-3">
                            <h5 className="my-2"><strong>About</strong></h5>
                            <div className="mb-3">
                                <EnvelopeAt className="text-secondary" />
                                <span className="text-secondary mx-2">Email:</span>
                                <span className="h6">{profileData.email}</span>
                            </div>
                            <div className="mb-3">
                                <PersonBadge className="text-secondary" />
                                <span className="text-secondary mx-2">Role:</span>
                                <span className="h6">{profileData.role}</span>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-4 ps-3 mb-3">
                            <h5 className="my-2"><strong>Account Details</strong></h5>
                            <div className="mb-3">
                                <FolderSymlink className="text-secondary" />
                                <span className="text-secondary mx-2">Registration Source:</span>
                                <span className="h6">{profileData.source}</span>
                            </div>
                            <div className="mb-3">
                                <CalendarCheck className="text-secondary" />
                                <span className="text-secondary mx-2">Created At:</span>
                                <span className="h6">{profileData.createdAt}</span>
                            </div>
                            <div className="mb-3">
                                <CalendarPlus className="text-secondary" />
                                <span className="text-secondary mx-2">Updated At:</span>
                                <span className="h6">{profileData.updatedAt}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

ProfileCard.propTypes = {
    profileData: PropTypes.object,
}

export default ProfileCard
