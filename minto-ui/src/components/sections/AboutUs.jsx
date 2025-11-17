import { Check } from "react-bootstrap-icons";

const AboutUs = () => {
    return (
        <>
            <div className="row mt-3 pt-3">
                <div className="col-xs-12 col-md-6"> 
                    <img src="./images/about/about.PNG" className="img-responsive" alt="" /> 
                </div>
                <div className="col-xs-12 col-md-6">
                    <div className="about-text">
                        <h1 className="display-4 fw-bold text-body-emphasis lh-1 mb-3">About Us</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex 
                                ea commodo consequat. Lorem ipsum dolor sit amet, consectetur 
                                adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore 
                                magna aliqua.
                        </p>
                        <h3 className="display-6">Why Choose Us?</h3>
                        <div className="d-flex list-style mb-3">
                            <div className="col-lg-6 col-sm-6 col-xs-12">
                                <ul>
                                    <li className="d-flex"><Check className="text-success" size={24} />Lorem ipsum dolor</li>
                                    <li className="d-flex"><Check className="text-success" size={24} />Tempor incididunt</li>
                                    <li className="d-flex"><Check className="text-success" size={24} />Lorem ipsum dolor</li>
                                    <li className="d-flex"><Check className="text-success" size={24} />Incididunt ut labore</li>
                                </ul>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12">
                                <ul>
                                    <li className="d-flex"><Check className="text-success" size={24} />Aliquip ex ea commodo</li>
                                    <li className="d-flex"><Check className="text-success" size={24} />Lorem ipsum dolor</li>
                                    <li className="d-flex"><Check className="text-success" size={24} />Exercitation ullamco</li>
                                    <li className="d-flex"><Check className="text-success" size={24} />Lorem ipsum dolor</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AboutUs
