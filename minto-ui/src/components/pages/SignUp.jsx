import { useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { Eye, EyeSlashFill, Facebook, Github, Google } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { parseJwt } from "../misc/Util";
import ErrorPage from "./errors/ErrorPage";
import TextSeparator from "../misc/TextSeparator";
import { toast } from 'sonner'

const SignUp = () => {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreed, setAgreed] = useState(false);

    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [signUpError, setSignUpError] = useState({});

    const showPassHandler = () => {
        setShowPass((prev) => !prev);
    };

    const showConfirmPassHandler = () => {
        setShowConfirmPass((prev) => !prev);
    };

    const validateForm = () => {
        let isValid = true
        const newErrors = {}
        const emailRegex = /\S+@\S+\.\S+/;
        const oneUCaseRegex = /(?=.*?[A-Z])/;
        const oneLCaseRegex = /(?=.*?[a-z])/;
        const oneDigitRegex = /(?=.*?[0-9])/;
        const oneSpecialCharRegex = /(?=.*?[!@#$%^&*()_+=[\]{}|;':",./<>?])/;
        const minEightCharRegex = /.{8,}/;

        if (!firstname) {
            newErrors.firstname = 'Firstname cannot be empty!';
            isValid = false;
        } else if (firstname.length < 2) {
            newErrors.firstname = 'Firstname must be at least 2 characters';
            isValid = false;
        } else if (firstname.trim() !== firstname) {
            newErrors.firstname = 'Firstname cannot have leading or trailing spaces';
            isValid = false;
        }

        if (!lastname) {
            newErrors.lastname = 'Lastname cannot be empty!';
            isValid = false;
        } else if (lastname.length < 2) {
            newErrors.lastname = 'Lastname must be at least 2 characters';
            isValid = false;
        } else if (lastname.trim() !== lastname) {
            newErrors.lastname = 'Lastname cannot have leading or trailing spaces';
            isValid = false;
        }

        if (!username) {
            newErrors.username = 'Username / email cannot be empty!';
            isValid = false;
        } else if (username.trim() !== username) {
            newErrors.username = 'Username/email cannot have leading or trailing spaces';
            isValid = false;
        } else if (username.includes(' ')) {
            newErrors.username = 'Username/email cannot have spaces'
            isValid = false;
        } else if (!emailRegex.test(username)) {
            newErrors.username = 'Email is invalid';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password cannot be empty!';
            isValid = false;
        } else if (password.includes(' ')) {
            newErrors.password = 'Password cannot have spaces'
            isValid = false;
        } else if (!minEightCharRegex.test(password)) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        } else if (!oneUCaseRegex.test(password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
            isValid = false;
        } else if (!oneLCaseRegex.test(password)) {
            newErrors.password = 'Password must contain at least one lowercase letter, one number, and one special character.'
            isValid = false;
        } else if (!oneDigitRegex.test(password)) {
            newErrors.password = 'Password must contain at least one digit(number)'
            isValid = false;
        } else if (!oneSpecialCharRegex.test(password)) {
            newErrors.password = 'Password must contain at least one special character'
            isValid = false;
        } else if (password.includes(firstname)) {
            newErrors.password = 'Password should not include your first name'
            isValid = false;
        } else if (password.includes(lastname)) {
            newErrors.password = 'Password should not include your last name'
            isValid = false;
        } else if (password.includes(username)) {
            newErrors.password = 'Password should not include your username/email'
            isValid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        if (!agreed) {
            newErrors.agreed = 'You must accept the terms and conditions';
            isValid = false;
        }

        setSignUpError(newErrors);
        return isValid;
    }
    
    const handleSignUp = async (e) => {
        e.preventDefault(); 
        
        if (validateForm()) {
            toast.success('Valid sign-up form!')
            try {
                const response = await fetch('http://localhost:8080/api/v1/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        firstName: firstname,
                        lastName: lastname,
                        email: username,
                        password: password,
                    }),
                });

                if(!response.ok) {
                    console.log(`HTTP error! status: ${response.status}`)
                    toast.error('HTTP Error: Response NOT ok!')
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const jsonData = await response.json();
                const accessToken = jsonData['access_token'];
                const decoded = parseJwt(accessToken);
                //console.log(decoded)

                toast.success(`${decoded.firstName} ${decoded.lastName} registered successfully!`)

                setFirstname('')
                setLastname('')
                setUsername('')
                setPassword('')
                setConfirmPassword('')
                setAgreed(false)
                setSignUpError({})
                
                navigate('/login')
            } catch (error) {
                console.log(error)
                const newErrors = {}
                if(error.request) {
                    newErrors.request = `[ERROR]:- Request error: ${error.request}`
                    setSignUpError(newErrors)
                } else if(error.response) {
                    newErrors.response = `[ERROR]:- Response error: ${error.response}`
                    setSignUpError(newErrors)
                } else {
                    newErrors.error = `[ERROR]:- ${error.message}`
                    setSignUpError(newErrors)
                }
            }
        } else {
            console.log(signUpError)
            toast.error('Sign up form is NOT valid')
        } 
    }

    if (signUpError.error) {
        if (signUpError.error.includes('HTTP error')) {
            // Handle 500 errors here
            return <ErrorPage status={500} message={'Oops! Something went wrong on the server.'} />;
        } 
        console.log(signUpError.error)
        console.log("[SignUp] - Testing...line 263");
        return <ErrorPage status={401} message={signUpError.error} />;
    }

    return (
        <div className="container mt-4 pt-4">
            <div className="d-flex justify-content-center align-items-center h-100">
                <div className="col-12">
                    <div className="card bg-dark text-white my-5 mx-auto" style={{borderRadius: '1rem', maxWidth: '540px'}}>
                        <div className="card-body p-5 d-flex flex-column align-items-center mx-auto w-100">
                            <h2 className="fw-bold mb-2">SIGN UP</h2>
                            <p className="text-white-50 mb-5">Please enter your details and choose a password!</p>
                            <Form onSubmit={handleSignUp}>
                                <Row className="d-flex flex-wrap justify-content-center"> 
                                    <Col xs={11} md={6} className="mb-4 mx-0 px-1">
                                        <InputGroup className="mb-0" size="md">
                                            <Form.Control
                                                id="firstname"
                                                type="text"
                                                name="firstname"
                                                placeholder="First name"
                                                value={firstname}
                                                onChange={(e) => setFirstname(e.target.value)}
                                                aria-label="firstname"
                                                aria-describedby="firstname"
                                                isInvalid={signUpError.firstname}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {signUpError.firstname}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Col>
                                    <Col xs={11} md={6} className="mb-4 mx-0 px-1">
                                        <InputGroup className="mb-0" size="md">
                                            <Form.Control
                                                id="lastname"
                                                type="text"
                                                name="lastname"
                                                placeholder="Last name"
                                                value={lastname}
                                                onChange={(e) => setLastname(e.target.value)}
                                                aria-label="lastname"
                                                aria-describedby="lastname"
                                                isInvalid={signUpError.lastname}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {signUpError.lastname}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row className="d-flex flex-wrap justify-content-center">
                                    <Col xs={11} md={12} className="d-flex mb-4 mx-0 px-1">
                                        <InputGroup className="mb-0" size="md">
                                            <Form.Control
                                                id="username"
                                                type="text"
                                                name="username"
                                                placeholder="Username or Email"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                aria-label="username"
                                                aria-describedby="username-input"
                                                isInvalid={ signUpError.username }
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {signUpError.username}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row className="d-flex flex-wrap justify-content-center">
                                    <Col xs={11} md={6} className="mb-4 mx-0 px-1">
                                        <InputGroup className="mb-0" size="md">
                                            <Form.Control
                                                id="password"
                                                type={showPass ? "text" : "password"}
                                                name="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                aria-label="password"
                                                aria-describedby="password-input"
                                                isInvalid={signUpError.password}
                                                required
                                            />
                                            <InputGroup.Text onClick={showPassHandler}>
                                                { showPass ? <EyeSlashFill /> : <Eye /> }
                                            </InputGroup.Text>
                                            <Form.Control.Feedback type="invalid">
                                                {signUpError.password}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Col>
                                    <Col xs={11} md={6} className="mb-4 mx-0 px-1">
                                        <InputGroup className="mb-0" size="md">
                                            <Form.Control
                                                id="confirm-password"
                                                type={showConfirmPass ? "text" : "password"}
                                                name="confirm-password"
                                                placeholder="Confirm password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                aria-label="confirm-password"
                                                aria-describedby="confirm-password-input"
                                                isInvalid={signUpError.confirmPassword}
                                                required
                                            />
                                            <InputGroup.Text onClick={showConfirmPassHandler}>
                                                {showConfirmPass ? <EyeSlashFill /> : <Eye />}
                                            </InputGroup.Text>
                                            <Form.Control.Feedback type="invalid">
                                                {signUpError.confirmPassword}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <div className="text-center mb-4">
                                    <InputGroup>
                                        <Form.Check 
                                            id="agreed"
                                            type="checkbox"
                                            name="agreed"
                                            value={agreed}
                                            onChange={(e) => setAgreed(e.target.checked)}
                                            isInvalid={signUpError.agreed}
                                            label="I agree to the terms and conditions"
                                        />
                                    </InputGroup>
                                    {signUpError.agreed && <span className="text-warning mb-2">*{signUpError.agreed}</span>}
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-outline-success mx-2 px-5" >
                                    Sign Up
                                    </button>
                                </div>
                                <TextSeparator text="Or sign up with"  />
                                <div className="text-center mt-3 mb-5">
                                    <Link className="mx-2 text-white" to={"http://localhost:8080/oauth2/authorization/google"}>
                                        <Google className="my-social-icon" size={30} />
                                    </Link>
                                    <Link className="mx-2 text-white" to={"http://localhost:8080/oauth2/authorization/facebook"}>
                                        <Facebook className="my-social-icon" size={30} />
                                    </Link>
                                    <Link className="mx-2 text-white" to={"http://localhost:8080/oauth2/authorization/github"}>
                                        <Github className="my-social-icon" size={30} />
                                    </Link>
                                </div>
                                <div className="text-center">
                                    <p className="mb-0">Already have an account? &nbsp;
                                        <Link to="/login" className="fw-bold">Login</Link>
                                    </p>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;