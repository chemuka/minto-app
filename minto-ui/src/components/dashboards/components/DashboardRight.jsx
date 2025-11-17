import TopRightPanel from "./right_panel/TopRightPanel"
import RecentUpdatesPanel from "./right_panel/RecentUpdatesPanel"
import AnalyticsPanel from "./right_panel/AnalyticsPanel"
import PropTypes from 'prop-types';

const DashboardRight = (props) => {
    const { isOpen, handleThreeDotClick, theme, toggleTheme } = props

    return (
        <>
            <div className="right">
                <TopRightPanel 
                    isOpen={isOpen} 
                    handleMenuClick={handleThreeDotClick} 
                    theme={theme} 
                    toggleTheme={toggleTheme} 
                />
                <RecentUpdatesPanel />
                <AnalyticsPanel />
            </div>
        </>
    )
}

DashboardRight.propTypes = {
    isOpen: PropTypes.bool,
    handleThreeDotClick: PropTypes.func,
    theme: PropTypes.string,
    toggleTheme: PropTypes.func
}

export default DashboardRight
