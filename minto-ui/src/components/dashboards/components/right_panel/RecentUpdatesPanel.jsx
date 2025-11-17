const RecentUpdatesPanel = () => {
    return (
        <>
            <div className="recent-updates">
                <h2>Recent Updates</h2>
                <div className="updates">
                    <div className="update">
                        <div className="profile-photo">
                            <img src="../images/dashboard/Avatar.PNG" alt="Profile" />
                        </div>
                        <div className="message">
                            <p><b>Marie Curie</b> was approved for membership on Aug 14th, 2024.</p>
                            <small className="text-muted">2 Minutes Ago</small>
                        </div>
                    </div>
                    <div className="update">
                        <div className="profile-photo">
                            <img src="../images/dashboard/Avatar.PNG" alt="Profile" />
                        </div>
                        <div className="message">
                            <p><b>Ahsoka Tano</b> received her claim from her father&apos;s account.</p>
                            <small className="text-muted">46 Minutes Ago</small>
                        </div>
                    </div>
                    <div className="update">
                        <div className="profile-photo">
                            <img src="../images/dashboard/Avatar.PNG" alt="Profile" />
                        </div>
                        <div className="message">
                            <p><b>Din Djarin</b> received recognition for being the longest serving member.</p>
                            <small className="text-muted">3 Hours Ago</small>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RecentUpdatesPanel
