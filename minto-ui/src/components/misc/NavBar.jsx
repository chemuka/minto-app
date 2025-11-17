import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap"
import { PersonFillLock, PersonFillSlash, PersonFillUp } from "react-bootstrap-icons";
import AdminUsersMenu from "../menus/admin_menus/AdminUsersMenu";
import AdminMembersMenu from "../menus/admin_menus/AdminMembersMenu";
import StaffUsersMenu from "../menus/staff_menus/StaffUsersMenu";
import StaffMembersMenu from "../menus/staff_menus/StaffMembersMenu";
import MemberMembersMenu from "../menus/member_menus/MemberMembersMenu";
import AdminPeopleMenu from "../menus/admin_menus/AdminPeopleMenu";
import AdminApplicationsMenu from "../menus/admin_menus/AdminApplicationsMenu";
import UserMenu from "../menus/user_menus/UserMenu";
import StaffPeopleMenu from "../menus/staff_menus/StaffPeopleMenu";
import StaffApplicationsMenu from "../menus/staff_menus/StaffApplicationsMenu";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NavBar = () => {
    const { isAuthenticated, getUser, logout } = useAuth()
    const [isAdmin, setIsAdmin] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    let user = getUser()

    useEffect(() => {
        //console.log('Navbar rerendering.')
        const isUserAdmin = () => {
            if (isAuthenticated) {
                if (user.decoded.role === 'Admin')
                    return true;
                else
                    return false;
            }
        }
        const isUserStaff = () => {
            if (isAuthenticated) {
                if (user.decoded.role === 'Staff')
                    return true;
                else
                    return false;
            }
        }
        const isUserMember = () => {
            if (isAuthenticated) {
                if (user.decoded.role === 'Member')
                    return true;
                else
                    return false;
            }
        }
        const isUserGuest = () => {
            if (isAuthenticated) {
                if (user.decoded.role === 'User')
                    return true;
                else
                    return false;
            }
        }
        
        setIsAdmin(isUserAdmin());
        setIsStaff(isUserStaff());
        setIsMember(isUserMember());
        setIsGuest(isUserGuest());
    }, [isAuthenticated, user])

    return (
        <Navbar collapseOnSelect expand="lg" bg='dark' data-bs-theme="dark" className='fixed-top'> 
            <Container>
                <Navbar.Brand href="/">Minto Club</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Link className="nav-link" to="/">Home</Link>
                        <Link className="nav-link" to="/about">About</Link>
                        <Link className="nav-link" to="/contact">Contact</Link>
                        { isAuthenticated && isAdmin && <AdminUsersMenu /> }
                        { isAuthenticated && isAdmin && <AdminPeopleMenu /> }
                        { isAuthenticated && isAdmin && <AdminApplicationsMenu /> }
                        { isAuthenticated && isAdmin && <AdminMembersMenu /> }
                        { isAuthenticated && isStaff && <StaffUsersMenu /> }
                        { isAuthenticated && isStaff && <StaffPeopleMenu /> }
                        { isAuthenticated && isStaff && <StaffApplicationsMenu /> }
                        { isAuthenticated && isStaff && <StaffMembersMenu /> }
                        { isAuthenticated && isMember && <MemberMembersMenu /> }
                        { isAuthenticated && isGuest && <UserMenu /> }
                        {
                            isAuthenticated && isGuest && (
                                <Link className="nav-link" to="/profile">Profile</Link>
                            )
                        }
                        {
                            isAuthenticated && (isAdmin || isStaff || isMember) && (
                                <Link className="nav-link" to="/member-profile">Profile</Link>
                            )
                        }
                        {
                            isAuthenticated && isAdmin && (
                                <Link className="nav-link" to="/admin-dashboard">Dashboard</Link>
                            )
                        }
                    </Nav>
                    { 
                        isAuthenticated ? (
                            <Nav>
                                <Link to="/login" onClick={logout} className="btn btn-outline-success me-1 nav-link">
                                    <PersonFillSlash className="me-1" style={{ fontSize: '20px', color: 'white' }} />
                                    Logout
                                </Link>
                            </Nav>
                        ) : (
                            <Nav>
                                <Link to="/login" className="btn btn-outline-success me-1 nav-link">
                                    <PersonFillLock className="me-1" style={{ fontSize: '20px', color: 'white' }} />
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-success ms-1 nav-link">
                                    <PersonFillUp className="me-1" style={{ fontSize: '20px', color: 'white' }} />
                                    Sign Up
                                </Link>
                            </Nav>
                        )
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar