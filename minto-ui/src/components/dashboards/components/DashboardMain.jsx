import ActivityPanel from "./main_panel/ActivityPanel"
import InsightPanel from "./main_panel/InsightPanel"
import PropTypes from 'prop-types';

const DashboardMain = (props) => {
    const { activePanel } = props

    return (
        <>
            <main>
                <h1>{activePanel}</h1>
                <div className="date">
                    <input type="date" />
                </div>
                <InsightPanel />
                <ActivityPanel activePanel={activePanel} />
                
            </main>
        </>
    )
}

DashboardMain.propTypes = {
    activePanel: PropTypes.string
}

export default DashboardMain
