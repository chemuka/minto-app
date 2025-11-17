import AboutUs from "../sections/AboutUs";
import HomeFooter from "../sections/HomeFooter";

const About = () => {

    return (
        <>
            <div className="container mt-5 mb-3 pt-4" style={{ height: '100vh'}}>
                <AboutUs />
            </div>
            <HomeFooter />
        </>
    );
};

export default About;