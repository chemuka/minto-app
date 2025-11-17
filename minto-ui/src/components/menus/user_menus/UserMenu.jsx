import { Dropdown } from "react-bootstrap"
import { Link } from "react-router-dom"

const UserMenu = () => {
    return (
        <>
            <Dropdown className="nav-item">
                <Dropdown.Toggle variant='dark' id='collapsible-nav-dropdown' className="nav-link" title="Membership">
                    Membership
                </Dropdown.Toggle>
                
                <Dropdown.Menu id="collapsible-nav-dropdown">
                    <Dropdown.Item as={Link} to="/membership-form" title="Membership Application">
                        Membership Application
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

export default UserMenu
