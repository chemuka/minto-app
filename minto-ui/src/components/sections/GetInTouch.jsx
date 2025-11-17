import { EnvelopeFill, GeoAltFill, TelephoneFill } from "react-bootstrap-icons"

const GetInTouch = () => {
    return (
        <>
            <div className="mt-3 py-2" style={{ background: 'linear-gradient(to right, #198754 0%, #07cc33 100%)'}}>
                <div id="contact" tabIndex="-1" className="my-4 py-3" style={{ outline: "none", color: "white"}}>
                    <div className="row container d-flex mx-auto px-3">
                        <div className="col-md-8">
                            <div className="row">
                                <div className="mb-5 pb-3">
                                    <h2 className="text-light">Get In Touch</h2>
                                    <p>Please fill out the form below to send us an email and we will get back to you as soon as possible.</p>
                                </div>
                                <form name="sentMessage">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <input type="text" id="name" name="name" className="form-control" placeholder="Name" required />
                                                <p className="help-block text-danger"></p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <input type="email" id="email" name="email" className="form-control" placeholder="Email" required />
                                                <p className="help-block text-danger"></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <textarea name="message" id="message" className="form-control" rows="4" placeholder="Message" required></textarea>
                                        <p className="help-block text-danger"></p>
                                    </div>
                                    <div id="success"></div>
                                    <button type="submit" className="btn btn-outline-light btn-lg mt-3 rounded-5">Send Message</button>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-3 col-md-offset-1 my-2 contact-info">
                            <div className="my-3 contact-item">
                                <h3 className="mt-3 mb-3 pt-3 pb-1">Contact Info</h3>
                                <GeoAltFill size={18} /><span className="h6 ms-2">Address</span>
                                <p className="mt-3 mb-0">4321 California St,</p>
                                <p className="mb-0"> San Francisco,</p> 
                                <p>CA 12345</p>
                            </div>
                            <div className="my-3 pt-2 contact-item">
                                <TelephoneFill size={18}  /><span className="h6 ms-2">Phone</span>
                                <p className="mt-2">+1 123 456 1234</p>
                            </div>
                            <div className="my-3 pt-2 contact-item">
                                <EnvelopeFill size={18} /><span className="h6 ms-2">Email</span> 
                                <p className="mt-2">info@company.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GetInTouch
