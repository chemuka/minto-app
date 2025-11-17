import PropTypes from 'prop-types'
import { Buildings, CalendarCheck, CalendarPlus, ClipboardCheck, EnvelopeAt, FolderSymlink, Geo, GlobeAmericas, Hash, Heart, HouseDoor, Map, People, PeopleFill, PersonArmsUp, PersonBadge, PersonCircle, PersonCheck, PersonCheckFill, PersonHeart, PersonHearts, PersonLinesFill, Telephone } from 'react-bootstrap-icons'
import MemberPersonInfoCard from "../../person/components/MemberPersonInfoCard"

const MemberProfileCard = (props) => {
    const { userData, memberData } = props

    return (
        <>
            <div className='card mb-3'>
                <div className="card-header" style={{ background: 'maroon'}}>
                    <div className="d-flex">
                        <h3 className='ms-1 text-white'>Member Profile</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">
                    <div className="form-group row mb-3">
                        {/* Side Panel */}
                        <div className="col-xl-4 mb-3 border-end border-light border-1">
                            <div className="row">
                                <div className="col-sm-6 col-xl-12 border-end border-light border-1">
                                    <div className="mb-1">
                                        {
                                            userData.picture ? (
                                                <img src={userData.picture} alt="Profile Picture" style={{ maxWidth: '120px', maxHeight: '120px' }} />
                                            ) : (
                                                <img src="./images/dashboard/Avatar.PNG" alt="Test Profile Picture" style={{ maxWidth: '120px', maxHeight: '120px' }} />
                                            )
                                        }
                                        <span className="h5 ms-2">
                                            {userData.lastName},&nbsp;
                                            {userData.firstName}&nbsp;
                                            {memberData.application.person.middleName}
                                        </span>
                                    </div>
                                    <div className="row">
                                        <span className="fw-bold" style={{ color: 'maroon'}}>{userData.email}</span>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-xl-12 border-bottom border-light border-1">
                                    {/* About */}
                                    <div className="pb-3">
                                        <h5 className="mt-4 mb-2"><strong>About</strong></h5>
                                        {memberData.application.person.contact.phones.map((phone, index) => (
                                            <div key={index} className="mb-3">
                                                <Telephone className="text-secondary" />
                                                <span className="fs-6 text-secondary mx-2">{phone.type} Phone:</span>
                                                <span className="fs-6">{phone.countryCode} {phone.number}</span>
                                            </div>
                                        ))}

                                        {memberData.application.person.contact.emails.map((email, index) => (
                                            <div key={index} className="mb-3">
                                                <EnvelopeAt className="text-secondary" />
                                                <span className="text-secondary mx-2">{email.type} Email:</span>
                                                <span className="">{email.address}</span>
                                            </div>
                                        ))}
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-xl-12 border-end border-light border-1">
                                    {/* User Details */}
                                    <div className="py-3 border-bottom border-light border-1">    
                                        <h5 className="mt-3 mb-2"><strong>User Details</strong></h5>
                                        <div className="mb-3">
                                            <Hash size={20} className="text-secondary" />
                                            <span className="text-secondary mx-2">User Id:</span>
                                            <span className="">{memberData.userId}</span>
                                        </div>
                                        <div className="mb-3">
                                            <EnvelopeAt className="text-secondary" />
                                            <span className="text-secondary mx-2">User Email:</span>
                                            <span className="">{userData.email}</span>
                                        </div>
                                        <div className="mb-3">
                                            <PersonBadge className="text-secondary" />
                                            <span className="text-secondary mx-2">Role:</span>
                                            <span className="">{userData.role}</span>
                                        </div>
                                        <div className="mb-3">
                                            <FolderSymlink className="text-secondary" />
                                            <span className="text-secondary mx-2">Registration Source:</span>
                                            <span className="">{userData.source}</span>
                                        </div>
                                        <div className="mb-3">
                                            <CalendarCheck className="text-secondary" />
                                            <span className="text-secondary mx-2">Created At:</span>
                                            <span className="">{userData.createdAt}</span>
                                        </div>
                                        <div className="mb-3">
                                            <CalendarPlus className="text-secondary" />
                                            <span className="text-secondary mx-2">Updated At:</span>
                                            <span className="">{userData.updatedAt}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-xl-12 border-end border-light border-1">
                                    {/* Member Details */}
                                    <div className="py-3 border-bottom border-light border-1">    
                                        <h5 className="mt-3 mb-2"><strong>Member Details</strong></h5>
                                        <div className="mb-3">
                                            <Hash className="text-secondary" />
                                            <span className="text-secondary mx-2">Member Id:</span>
                                            <span className="">{memberData.id}</span>
                                        </div>
                                        <div className="mb-3">
                                            <PersonHeart className="text-secondary" />
                                            <span className="text-secondary mx-2">Marital Status:</span>
                                            <span className="">{memberData.application.maritalStatus}</span>
                                        </div>
                                        <div className="mb-3">
                                            <CalendarCheck className="text-secondary" />
                                            <span className="text-secondary mx-2">Member Created At:</span>
                                            <span className="">{memberData.memberCreatedAt}</span>
                                        </div>
                                        <div className="mb-3">
                                            <CalendarPlus className="text-secondary" />
                                            <span className="text-secondary mx-2">Member Updated At:</span>
                                            <span className="">{memberData.memberUpdatedAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-xl-12 border-end border-light border-1">
                                    {/* Application Details */}
                                    <div className="py-3 border-bottom border-light border-1">
                                        <h5 className="mt-3 mb-2"><strong>Application Details</strong></h5>
                                        <div className="mb-3">
                                            <Hash className="text-secondary" />
                                            <span className="text-secondary mx-2">Application Id:</span>
                                            <span className="">{memberData.application.id}</span>
                                        </div>
                                        <div className="mb-3">
                                            <ClipboardCheck className="text-secondary" />
                                            <span className="text-secondary mx-2">Application Status:</span>
                                            <span className="">{memberData.application.applicationStatus}</span>
                                        </div>
                                        <div className="mb-3">
                                            <CalendarCheck className="text-secondary" />
                                            <span className="text-secondary mx-2">App Created At:</span>
                                            <span className="">{memberData.application.appCreatedAt}</span>
                                        </div>
                                        <div className="mb-3">
                                            <CalendarPlus className="text-secondary" />
                                            <span className="text-secondary mx-2">App Updated At:</span>
                                            <span className="">{memberData.application.appUpdatedAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Panel */}
                        <div className="col-xl-8 pt-3 mb-3 border-bottom border-light border-1">
                            {/* Address */}
                            <h5 className="my-2"><strong>Address</strong></h5>
                            <div className="row row-cols-auto mb-3">
                                {memberData.application.person.contact.addresses.map((address, index) => (
                                    <div key={index} className="col-md-6 mb-3">
                                        <h6 className="my-2"><strong>{address.type} Address</strong></h6>
                                        <div className="mb-3">
                                            <HouseDoor className="text-secondary" />
                                            <span className="text-secondary mx-2">Street:</span>
                                            <span className="">{address.street}</span>
                                        </div>
                                        <div className="mb-3">
                                            <Buildings className="text-secondary" />
                                            <span className="text-secondary mx-2">City:</span>
                                            <span className="">{address.city}</span>
                                        </div>
                                        <div className="mb-3">
                                            <Map className="text-secondary" />
                                            <span className="text-secondary mx-2">State:</span>
                                            <span className="">{address.state}</span>
                                        </div>
                                        <div className="mb-3">
                                            <Geo className="text-secondary" />
                                            <span className="text-secondary mx-2">Zip Code:</span>
                                            <span className="">{address.zipcode}</span>
                                        </div>
                                        <div className="mb-3">
                                            <GlobeAmericas className="text-secondary" />
                                            <span className="text-secondary mx-2">Country:</span>
                                            <span className="">{address.country}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <h5 className="my-2"><strong>Relatives, Referees & Beneficiaries</strong></h5>
                            <div className="row row-cols-auto mb-3">
                                <MemberPersonInfoCard
                                    peopleData={memberData.application.spouses}
                                    headerIcon={Heart}
                                    bodyIcon={PersonHeart}
                                    headerTitle={'Spouses Information'}
                                    personTypeMultiple={'Spouses'}
                                    personTypeSingle={'Spouse'}
                                    priColor={'crimson'}
                                />
                                <MemberPersonInfoCard
                                    peopleData={memberData.application.children}
                                    headerIcon={PersonCircle}
                                    bodyIcon={PersonCircle}
                                    headerTitle={'Children Information'}
                                    personTypeMultiple={'Children'}
                                    personTypeSingle={'Child'}
                                    priColor={'limegreen'}
                                />
                                <MemberPersonInfoCard
                                    peopleData={memberData.application.parents}
                                    headerIcon={People}
                                    bodyIcon={PeopleFill}
                                    headerTitle={'Parents Information'}
                                    personTypeMultiple={'Parents'}
                                    personTypeSingle={'Parent'}
                                    priColor={'purple'}
                                />
                                <MemberPersonInfoCard
                                    peopleData={memberData.application.siblings}
                                    headerIcon={PersonArmsUp}
                                    bodyIcon={PersonArmsUp}
                                    headerTitle={'Siblings Information'}
                                    personTypeMultiple={'Siblings'}
                                    personTypeSingle={'Sibling'}
                                    priColor={'orange'}
                                />
                                <MemberPersonInfoCard
                                    peopleData={memberData.application.referees}
                                    headerIcon={PersonCheck}
                                    bodyIcon={PersonCheckFill}
                                    headerTitle={'Reference Information'}
                                    personTypeMultiple={'Referees'}
                                    personTypeSingle={'Referee'}
                                    priColor={'coral'}
                                />
                                <MemberPersonInfoCard
                                    peopleData={memberData.application.relatives}
                                    headerIcon={PersonLinesFill}
                                    bodyIcon={PersonLinesFill}
                                    headerTitle={'Club Relatives Info'}
                                    personTypeMultiple={'Relatives'}
                                    personTypeSingle={'Relative'}
                                    priColor={'teal'}
                                />
                                <MemberPersonInfoCard
                                    peopleData={memberData.application.beneficiaries}
                                    headerIcon={PersonHearts}
                                    bodyIcon={PersonHearts}
                                    headerTitle={'Beneficiaries Info'}
                                    personTypeMultiple={'Beneficiaries'}
                                    personTypeSingle={'Beneficiary'}
                                    priColor={'saddlebrown'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

MemberProfileCard.propTypes = {
    userData: PropTypes.object,
    memberData: PropTypes.object,
}

export default MemberProfileCard
