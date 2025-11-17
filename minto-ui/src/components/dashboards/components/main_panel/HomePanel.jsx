import ApplicationsGrid from "../../../grid/ApplicationsGrid"
import MembersGrid from "../../../grid/MembersGrid"
import PeopleGrid from "../../../grid/PeopleGrid"
import UserGrid from "../../../grid/UserGrid"

const HomePanel = () => {
    return (
        <>
            <div className="activity-panel">
                <p className="h5 text-black"><strong>Users List</strong></p>
                <UserGrid />
            </div>
            <div className="activity-panel">
                <p className="h5 text-danger"><strong>Members List</strong></p>
                <MembersGrid />
            </div>
            <div className="activity-panel">
                <p className="h5 text-primary"><strong>Applications List</strong></p>
                <ApplicationsGrid url={"http://localhost:8080/api/v1/applications"} />
            </div>
            <div className="activity-panel">
                <p className="h5 text-info"><strong>People List</strong></p>
                <PeopleGrid />
            </div>
        </>
    )
}

export default HomePanel
