import TopSideBar from "./sidebar/TopSideBar"
import SideBarMenu from "./sidebar/SideBarMenu"
import PropTypes from 'prop-types';

const DashboardSideBar = (props) => {
    const { isOpen, handleCloseBtn, handleMenuClick } = props

    return (
        <>
            <aside className={`${isOpen ? 'mobile-sidebar':'desktop-sidebar'}`}>
                <TopSideBar isOpen={isOpen} handleCloseBtn={handleCloseBtn} />
                <SideBarMenu onMenuClick={handleMenuClick} />
            </aside>
        </>
    )
}

DashboardSideBar.propTypes = {
    isOpen: PropTypes.bool,
    handleCloseBtn: PropTypes.func,
    handleMenuClick: PropTypes.func,
};

export default DashboardSideBar
