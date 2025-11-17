import DashboardSideBar from "./components/DashboardSideBar"
import DashboardMain from "./components/DashboardMain"
import DashboardRight from "./components/DashboardRight"
import "../dashboards/dashboard.css"
import { Suspense, useState } from "react"
import { useTheme } from "../hooks/Hooks"
import LoadingSpinner from "../loading/LoadingSpinner"

const AdminDashboard = () => {
    const { theme, toggleTheme } = useTheme()
    const [isSideBarOpen, setIsSideBarOpen] = useState(false)
    const [activePanel, setActivePanel] = useState('Dashboard')

    const handleThreeDotClick = () => {
        setIsSideBarOpen(!isSideBarOpen)
    }

    const handleCloseBtn = () => {
        setIsSideBarOpen(!isSideBarOpen)
    }

    const handleMenuClick = (panelName) => {
        setActivePanel(panelName)
    }

    return (
        <>
            <div className={`admin-dashboard ${theme === 'dark' ? 'dark-theme-variables' : ''}`}>
                <Suspense fallback={<LoadingSpinner caption={'Admin Dashboard'} />}>
                    <div className="dashboard-container">
                        <DashboardSideBar 
                            isOpen={isSideBarOpen} 
                            handleCloseBtn={handleCloseBtn}
                            handleMenuClick={handleMenuClick} 
                        />
                        <DashboardMain activePanel={activePanel} />
                        <DashboardRight 
                            isOpen={isSideBarOpen} 
                            handleThreeDotClick={handleThreeDotClick}
                            theme={theme}
                            toggleTheme={toggleTheme} 
                        />
                    </div>
                </Suspense>
            </div>
        </>
    )
}

export default AdminDashboard
