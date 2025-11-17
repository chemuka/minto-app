import { Moon, Sun, ThreeDots, ThreeDotsVertical } from "react-bootstrap-icons"
import PropTypes from 'prop-types';
import ProfilePanel from "./ProfilePanel";

const TopRightPanel = (props) => {
    const { isOpen, handleMenuClick, theme, toggleTheme } = props;

    return (
        <>
            <div className="top">
                <button id="menu-btn" onClick={handleMenuClick}>
                    { isOpen ? (
                        <ThreeDots size={30} />
                    ) : (
                        <ThreeDotsVertical size={30} />
                    )}
                    
                </button>
                <div className="theme-toggler" onClick={toggleTheme}>
                    <span className={`${theme === 'light' ? 'active' : ''}`}>
                        <Sun size={18} />
                    </span>
                    <span className={`${theme === 'light' ? '' : 'active'}`}>
                        <Moon size={18} />
                    </span>
                </div>
                <ProfilePanel />
            </div>
        </>
    )
};

TopRightPanel.propTypes = {
    isOpen: PropTypes.bool,
    handleMenuClick: PropTypes.func,
    theme: PropTypes.string,
    toggleTheme: PropTypes.func
};

export default TopRightPanel
