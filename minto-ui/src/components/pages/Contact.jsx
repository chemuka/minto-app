import GetInTouch from "../sections/GetInTouch"
import HomeFooter from "../sections/HomeFooter"

const Contact = () => {
    return (
        <>
            <div className="mt-5 py-4" style={{ height: '100vh', background: 'linear-gradient(to right, #198754 0%, #07cc33 100%)'}}>
                <GetInTouch />
            </div>
            <HomeFooter />
        </>
    )
}

export default Contact
