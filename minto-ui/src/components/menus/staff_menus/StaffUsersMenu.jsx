import { Dropdown } from "react-bootstrap"
import { Link } from "react-router-dom"

const StaffUsersMenu = () => {
    return (
        <>
            <Dropdown className="nav-item">
                <Dropdown.Toggle variant='dark' id='collapsible-nav-dropdown' className="nav-link" title="Users">
                    Users
                </Dropdown.Toggle>
                
                <Dropdown.Menu id="collapsible-nav-dropdown">
                    <Dropdown.Item as={Link} to="/users" title="Main Users Page">
                        Main Users Page
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/add-user" title="Add User">
                        Add User
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/edit-user" title="Search / Edit User">
                        Search / Edit User
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/view-all-users" title="List All Users">
                        List All Users
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

export default StaffUsersMenu
