import { useAuth } from "../../../hooks/useAuth"


const ProfilePanel = () => {
    const { getUser } = useAuth()
    let user  = getUser()

    return (
        <div className="profile">
            { user ? (
                <>
                    <div className="info">
                        <p>Hey, <b>{user.decoded.firstName}</b></p>
                        <small className="text-muted">{user.decoded.role}</small>
                    </div>
                    <div className="profile-photo">
                        <img src="../images/dashboard/Avatar.PNG" alt="Profile" />
                    </div>
                </>
            ) : (
                <>
                    <div className="info">
                        <p>Hey, <b>TestUser</b></p>
                        <small className="text-muted">Admin</small>
                    </div>
                    <div className="profile-photo">
                        <img src="../images/dashboard/Avatar.PNG" alt="Profile" />
                    </div>
                </>
            )}
        </div>
    )
}

export default ProfilePanel
