import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/pages/Home";
import SignUp from "./components/pages/SignUp";
import UserProfile from "./components/pages/profile/UserProfile";
import PrivateRoute from "./components/misc/PrivateRoute";
import NavBar from "./components/misc/NavBar";
import NoAuthNavBar from "./components/misc/NoAuthNavBar";
import Error_404 from "./components/pages/errors/Error_404";
import OAuth2Redirect from "./components/auth/OAuth2Redirect";
import ViewAllUsersPage from "./components/pages/user_pages/ViewAllUsersPage";
import EditUserPage from "./components/pages/user_pages/EditUserPage";
import AddUserPage from "./components/pages/user_pages/AddUserPage";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import DashboardThemeProvider from "./components/provider/DashboardThemeProvider";
import { Toaster } from 'sonner'
import ViewMember from "./components/members/ViewMember";
import ScrollToAnchor from "./components/misc/ScrollToAnchor";
import Profile from "./components/pages/profile/Profile";
import MembersPage from "./components/pages/member_pages/MembersPage";
import ApplicationsPage from "./components/pages/application_pages/ApplicationsPage";
import AddApplicationPage from "./components/pages/application_pages/AddApplicationPage";
import UsersPage from "./components/pages/user_pages/UsersPage";
import MemberProfile from "./components/pages/profile/MemberProfile";
import EditPersonPage from "./components/pages/person_pages/EditPersonPage";
import ViewAllPeoplePage from "./components/pages/person_pages/ViewAllPeoplePage";
import AddPersonPage from "./components/pages/person_pages/AddPersonPage";
import EditApplicationPage from "./components/pages/application_pages/EditApplicationPage";
import ViewAllApplicationsPage from "./components/pages/application_pages/ViewAllApplicationsPage";
import EditMemberPage from "./components/pages/member_pages/EditMemberPage";
import ViewAllMembersPage from "./components/pages/member_pages/ViewAllMembersPage";
import MembershipFormPage from "./components/pages/member_pages/MembershipFormPage";
import CreateMemberPage from "./components/pages/member_pages/CreateMemberPage";
import ProcessApplicationPage from "./components/pages/application_pages/ProcessApplicationPage";
import PeoplePage from "./components/pages/person_pages/PeoplePage";
import { useAuth } from "./components/hooks/useAuth";
import AuthPage from "./components/pages/AuthPage";
import DraftApplicationPage from "./components/pages/draft_app_pages/DraftApplicationPages";
import StaffProfile from "./components/pages/profile/StaffProfile";

const App = () => {
  const { isAuthenticated } = useAuth()
  
  return (
    <>
      <Router>
        { isAuthenticated ? <NavBar /> : <NoAuthNavBar /> }
        <ScrollToAnchor />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/oauth2/redirect' element={<OAuth2Redirect />} />
          <Route path="/error-404" element={<Error_404 />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />} >
            <Route path="/admin-dashboard" element={<DashboardThemeProvider><AdminDashboard /></DashboardThemeProvider>} />
            
            <Route path="/profile" element={<Profile />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/member-profile" element={<MemberProfile />} />
            <Route path="/staff-profile" element={<StaffProfile />} />

            <Route path="/view-all-users" element={<ViewAllUsersPage />} />
            <Route path="/view-user" element={<EditUserPage />} />
            <Route path="/add-user" element={<AddUserPage />} />
            <Route path="/edit-user" element={<EditUserPage />} />
            <Route path="/users" element={<UsersPage />} />

            <Route path="/view-all-people" element={<ViewAllPeoplePage />} />
            <Route path="/create-person" element={<AddPersonPage />} />
            <Route path="/edit-person" element={<EditPersonPage />} />
            <Route path="/people" element={<PeoplePage />} />
            
            <Route path="/view-all-applications" element={<ViewAllApplicationsPage />} />
            <Route path="/process-application" element={<ProcessApplicationPage />} />
            <Route path="/edit-application" element={<EditApplicationPage />} />
            <Route path="/add-application" element={<AddApplicationPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />

            <Route path="/draft-application" element={<DraftApplicationPage />} />

            <Route path="/view-all-members" element={<ViewAllMembersPage />} />
            <Route path="/view-member" element={<ViewMember />} />
            <Route path="/edit-member" element={<EditMemberPage />} />
            <Route path="/create-member" element={<CreateMemberPage />} />
            <Route path="/membership-form" element={<MembershipFormPage />} />
            <Route path="/members" element={<MembersPage />} />
          </Route>
            
          <Route path="*" element={<Navigate to="/error-404" />} />
        </Routes>
      </Router>
      
      <Toaster 
        richColors 
        theme='dark'
        duration='6000'
      />
    </>
  );
};

export default App;