import { Dropdown } from "react-bootstrap"
import { Link } from "react-router-dom"

const AdminApplicationsMenu = () => {
    return (
        <>
            <Dropdown className="nav-item" >
                <Dropdown.Toggle variant='dark' id='collapsible-nav-dropdown' className="nav-link" title="Applications">
                    Applications
                </Dropdown.Toggle>
                
                <Dropdown.Menu id="collapsible-nav-dropdown">
                    <Dropdown.Item as={Link} to="/applications" title="Main Applications Page">
                        Main Applications Page
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/add-application" title="New Membership Application">
                        New Membership Application
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/edit-application" title="Search / Edit Application">
                        Search / Edit Application
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/process-application" title="Process Application">
                        Process Application
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/view-all-applications" title="List All Applications">
                        List All Applications
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

export default AdminApplicationsMenu
