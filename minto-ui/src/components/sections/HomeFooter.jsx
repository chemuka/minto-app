 
import { Card, CardBody, CardHeader, Container, Row } from "react-bootstrap";
import { Facebook, Google, Instagram, TwitterX, Whatsapp, Youtube } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const HomeFooter = () => {
  return (
    <>
        <footer className="text-white bg-dark">
            <Container>
                <Row>
                    <div className="col-md-5 mt-5 mb-3">
                        <Card>
                            <CardHeader className="bg-success-subtle">
                                <h5>Subscribe to newsletter</h5>
                            </CardHeader>
                            <CardBody>
                                <form>
                                    <p>Subscribe now to receive information about club events and activities.</p>
                                    <div className="d-flex flex-column flex-row w-100 gap-2">
                                        <label htmlFor="newsletter1" className="visually-hidden">Email address</label>
                                        <input id="newsletter1" type="text" className="form-control" placeholder="Email address" />
                                        <button className="btn btn-success btn-block">Subscribe</button>
                                    </div>
                                </form>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-6 col-md-3 offset-md-1 mt-5 mb-3 ps-4">
                        <h5>Links</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-light">Home</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-light">Events</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-light">News</a></li>
                            <li className="nav-item mb-2"><a href="/contact" className="nav-link p-0 text-light">Contact Us</a></li>
                            <li className="nav-item mb-2"><a href="/about" className="nav-link p-0 text-light">About Us</a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md-3 mt-5 mb-3 ps-4">
                        <h5>Membership</h5>
                        <ul className="nav flex-column">
                        <li className="nav-item mb-2"><a href="/login" className="nav-link p-0 text-light">Login</a></li>
                        <li className="nav-item mb-2"><a href="/signup" className="nav-link p-0 text-light">Sign Up</a></li>
                        <li className="nav-item mb-2"><a href="/#faq" className="nav-link p-0 text-light">FAQs</a></li>
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-light">Our Mission</a></li>
                        </ul>
                    </div>
                </Row>
                <Row>
                    <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
                        <p>© 2025 Minto Club, Inc. All rights reserved.</p>
                        <h6>Powered by <a href="mailto:pjdereva@gmail.com?subject=Feedback From Minto Club Website">PJDereva</a></h6>
                        <div className="d-flex">
                            <Link className="mx-2 text-light" to={"#"}>
                                <Whatsapp className="my-social-icon" size={24} />
                            </Link>
                            <Link className="mx-2 text-light" to={"#"}>
                                <Google className="my-social-icon" size={24} />
                            </Link>
                            <Link className="mx-2 text-light" to={"#"}>
                                <Facebook className="my-social-icon" size={24} />
                            </Link>
                            <Link className="mx-2 text-light" to={"#"}>
                                <Instagram className="my-social-icon" size={24} />
                            </Link>
                            <Link className="mx-2 text-light" to={"#"}>
                                <TwitterX className="my-social-icon" size={24} />
                            </Link>
                            <Link className="mx-2 text-light" to={"#"}>
                                <Youtube className="my-social-icon" size={24} />
                            </Link>
                        </div>
                    </div>
                </Row>
            </Container>
        </footer>
    </>
  )
}

export default HomeFooter
