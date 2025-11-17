import { Link } from "react-router-dom"

const Hero = () => {
    return (
        <>
            <div className="mt-5 pt-2 position-relative w-100">
                <img src="./images/home/tree-grows-coin-glass-jar-with-copy-space.jpg" alt="Hero Image" className="object-fit-cover w-100 h-100" style={{ maxHeight: '560px'}} />
                <div className="row flex-lg-row-reverse align-items-center g-5 px-5 py-5 hero-text">
                    <div className="col-10 col-sm-8 col-lg-6">
                    </div>
                    <div className="col-sm-8 col-lg-6 col-xxl-5">
                        <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Minto Club Membership</h1>
                        <p className="lead">We stand together in times of financial needs. This is where community meets care in times of crisis. Let us support each other through life&apos;s emergencies.</p>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                            <Link className="btn btn-success btn-lg px-4 me-md-2" to="/signup">Join Now</Link>
                            <Link className="btn btn-outline-secondary btn-lg px-4" to="/#features">Explore</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hero
