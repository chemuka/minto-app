import { Dropdown } from "react-bootstrap"
import { Link } from "react-router-dom"

const MemberMembersMenu = () => {
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
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/member-profile" title="Member Profile">
                        Member Profile
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

export default MemberMembersMenu
