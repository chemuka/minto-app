import HomeFooter from "../sections/HomeFooter";
import HowTo from "../sections/HowTo";
import Faq from "../sections/FAQ";
import Features from "../sections/Features";
import AboutUs from "../sections/AboutUs";
import GetInTouch from "../sections/GetInTouch";
import Hero from "../sections/Hero";

const Home = () => {
    return (
        <>
            <Hero />
            <Features />
            <AboutUs />
            <HowTo />
            <Faq />
            <GetInTouch />
            <HomeFooter />
        </>
    );
};

export default Home;