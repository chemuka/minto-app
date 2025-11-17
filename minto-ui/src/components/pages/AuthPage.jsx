import AdminDashboard from "../dashboards/AdminDashboard"
import { useAuth } from "../hooks/useAuth"
import LoadingSpinner from "../loading/LoadingSpinner"
import DashboardThemeProvider from "../provider/DashboardThemeProvider"
import Login from "./Login"
import MemberProfile from "./profile/MemberProfile"
import Profile from "./profile/Profile"

const AuthPage = () => {
    const { isAuthenticated, loading, getUser } = useAuth()
    let user = getUser()

    if(loading) {
        return <LoadingSpinner caption={'Minto Club App'} clsTextColor={"text-success"} />
    }

    if(!isAuthenticated) {
        return <Login />
    }

    if(user) {
        if(user.decoded.role === 'Admin') {
            return <DashboardThemeProvider><AdminDashboard /></DashboardThemeProvider>
        } else if(user.decoded.role === 'Staff') {
            return <MemberProfile />
        } else if(user.decoded.role === 'Member') {
            return <MemberProfile />
        }
    }

    return <Profile />
}

export default AuthPage
