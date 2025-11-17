import { Dropdown } from "react-bootstrap"
import { Link } from "react-router-dom"

const StaffMembersMenu = () => {
    return (
        <>
            <Dropdown className="nav-item">
                <Dropdown.Toggle variant='dark' id='collapsible-nav-dropdown' className="nav-link" title="Membership">
                    Membership
                </Dropdown.Toggle>
                
                <Dropdown.Menu id="collapsible-nav-dropdown">
                    <Dropdown.Item as={Link} to="/members" title="Main Members Page">
                        Main Members Page
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/membership-form" title="Membership Application">
                        Membership Application
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/create-member" title="Create Member">
                        Create Member
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/edit-member" title="Search / Edit Member">
                        Search / Edit Member
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/member-profile" title="Member Profile">
                        Member Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/view-all-members" title="List All Members">
                        List All Members
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

export default StaffMembersMenu
