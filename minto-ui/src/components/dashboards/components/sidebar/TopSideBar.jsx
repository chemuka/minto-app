import { Link } from "react-router-dom"
import { CloseButton } from "react-bootstrap";
import PropTypes from 'prop-types';

const TopSideBar = (props) => {
    const { isOpen, handleCloseBtn } = props;

    return (
        <>
            <div className="top">
                <div className="logo">
                    <Link to={"/"}>
                        <img src="./images/dashboard/logo.png" alt="Logo"></img>
                        <h2>Minto<span className="text-danger">Club</span></h2>
                    </Link>
                </div>
                <div className="close" id="close-btn">
                    { isOpen && <CloseButton onClick={handleCloseBtn} />}
                    
                </div>
            </div>
        </>
    )
}

TopSideBar.propTypes = {
    isOpen: PropTypes.bool,
    handleCloseBtn: PropTypes.func
};

export default TopSideBar
