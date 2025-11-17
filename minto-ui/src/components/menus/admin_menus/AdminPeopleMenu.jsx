import { Dropdown } from "react-bootstrap"
import { Link } from "react-router-dom"

const AdminPeopleMenu = () => {
    return (
        <>
            <Dropdown className="nav-item" title="People">
                <Dropdown.Toggle variant='dark' id='collapsible-nav-dropdown' className="nav-link" title="People">
                    People
                </Dropdown.Toggle>
                
                <Dropdown.Menu id="collapsible-nav-dropdown">
                    <Dropdown.Item as={Link} to="/people" title="Main People Page">
                        Main People Page
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/create-person" title="Create New Person">
                        Create New Person
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/edit-person" title="Search / Edit Person">
                        Search / Edit Person
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/view-all-people" title="List All People">
                        List All People
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

export default AdminPeopleMenu
