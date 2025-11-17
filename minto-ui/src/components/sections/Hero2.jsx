import { Link } from "react-router-dom"

const Hero2 = () => {
    return (
        <>
            <div className="container col-xxl-8 px-4 py-5">
                <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                    <div className="col-10 col-sm-8 col-lg-6">
                        <img src="./images/home/hero-img-2.png" className="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700px" height="500px" loading="lazy">
                        </img>
                    </div>
                    <div className="col-lg-6">
                        <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Minto Club Membership</h1>
                        <p className="lead">We stand together in times of financial needs. This is where community meets care in times of crisis. Let us support each other through life&apos;s emergencies.</p>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                            <Link className="btn btn-success btn-lg px-4 me-md-2" to="/signup">Join Now</Link>
                            <Link className="btn btn-outline-secondary btn-lg px-4" to="/#faq">Explore</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hero2
