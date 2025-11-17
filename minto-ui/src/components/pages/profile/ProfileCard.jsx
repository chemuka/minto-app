import PropTypes from 'prop-types'
import { CalendarCheck, CalendarPlus, EnvelopeAt, FolderSymlink, PersonBadge } from 'react-bootstrap-icons'

const ProfileCard = (props) => {
    const { profileData } = props

    return (
        <>
            <div className='card mb-3'>
                <div className="card-header" style={{ background: 'darkgreen'}}>
                    <div className="d-flex">
                        <h3 className='ms-1 text-white'>User Profile</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">
                    <div className="form-group row mb-3">
                        <div className="col-lg-6 col-xl-4 mb-3">
                            {
                                profileData.picture ? (
                                    <img src={profileData.picture} alt="Profile Picture" style={{ maxWidth: '150px', maxHeight: '150px' }} />
                                ) : (
                                    <img src="./images/dashboard/Avatar.PNG" alt="Test Profile Picture" style={{ maxWidth: '150px', maxHeight: '150px' }} />
                                )
                            }
                            <span className="h5 ms-2">
                                {profileData.lastName},&nbsp;
                                {profileData.firstName}
                            </span>
                        </div>
                        <div className="col-lg-6 col-xl-4 mb-3">
                            <h5 className="my-2"><strong>About</strong></h5>
                            <div className="mb-3">
                                <EnvelopeAt className="text-secondary" />
                                <span className="text-secondary mx-2">Email:</span>
                                <span className="">{profileData.email}</span>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-4 mb-3">
                            <h5 className="my-2"><strong>User Details</strong></h5>
                            <div className="mb-3">
                                <PersonBadge className="text-secondary" />
                                <span className="text-secondary mx-2">Role:</span>
                                <span className="">{profileData.role}</span>
                            </div>
                            <div className="mb-3">
                                <FolderSymlink className="text-secondary" />
                                <span className="text-secondary mx-2">Registration Source:</span>
                                <span className="">{profileData.source}</span>
                            </div>
                            <div className="mb-3">
                                <CalendarCheck className="text-secondary" />
                                <span className="text-secondary mx-2">Created At:</span>
                                <span className="">{profileData.createdAt}</span>
                            </div>
                            <div className="mb-3">
                                <CalendarPlus className="text-secondary" />
                                <span className="text-secondary mx-2">Updated At:</span>
                                <span className="">{profileData.updatedAt}</span>
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
