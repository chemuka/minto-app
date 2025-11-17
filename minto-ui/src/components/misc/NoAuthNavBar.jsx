import { Container, Nav, Navbar } from "react-bootstrap"
import { PersonFillLock, PersonFillUp } from "react-bootstrap-icons"
import { Link } from "react-router-dom";

const NoAuthNavBar = () => {
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
                    </Nav>
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
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NoAuthNavBar