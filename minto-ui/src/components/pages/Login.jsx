import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Eye, EyeSlashFill, Facebook, Github, Google } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import TextSeparator from "../misc/TextSeparator";
import { toast } from 'sonner'
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const { isAuthenticated, login } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState(null)
    const [showPass, setShowPass] = useState(false)

    const eyeClickHandler = () => {
        setShowPass((prev) => !prev)
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoginError('')

        try {
            await login({ email: username, password: password, })

            toast.success('Login successful')   
            setUsername('')
            setPassword('')
            setLoginError(null)
        } catch (err) {
            console.log(err)
            setLoginError('Invalid username or password!')
        }
    }

    return (
        <>
            <div className="container mt-4 pt-4">
                <div className="d-flex justify-content-center align-items-center h-100">
                    { 
                        !isAuthenticated && (
                        <div className="col-12">
                            <div className="card bg-dark text-white my-5 mx-auto" style={{borderRadius: '1rem', maxWidth: '400px'}}>
                                <div className="card-body p-5 d-flex flex-column align-items-center mx-auto w-100">
                                    <h2 className="fw-bold mb-2">LOGIN</h2>
                                    <p className="text-white-50 mb-5">Please enter your login and password!</p>
                                    { loginError && <span className="text-warning mb-4">*{loginError}</span>}
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4 mx-0 px-0 w-90">
                                            <InputGroup className="mb-3" size="md">
                                                <Form.Control
                                                    id="username"
                                                    type="text"
                                                    name="username"
                                                    placeholder="Username or Email"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    aria-label="username"
                                                    aria-describedby="username-input"
                                                    required
                                                />
                                            </InputGroup>
                                        </div>
                                        <div className="mb-4 mx-0 px-0 w-90">
                                            <InputGroup className="mb-3" size="md">
                                                <Form.Control
                                                    id="password"
                                                    type={showPass ? "text" : "password"}
                                                    name="password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    aria-label="password"
                                                    aria-describedby="password-input"
                                                    required
                                                />
                                                <InputGroup.Text onClick={eyeClickHandler}>
                                                    { showPass ? <EyeSlashFill /> : <Eye /> }
                                                </InputGroup.Text>
                                            </InputGroup>
                                        </div>
                                        <div className="text-center">
                                            <p className="small mb-3 pb-lg-2">
                                                <Link to="#">
                                                    Forgot password?
                                                </Link>
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <button type="submit" className="btn btn-outline-success mx-2 px-5" >
                                                Login
                                            </button>
                                        </div>
                                        <TextSeparator text="Or login with"  />
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
                                            <p className="mb-0">Don&apos;t have an account? &nbsp;
                                                <Link to="/signup" className="fw-bold">
                                                    Sign Up
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Login