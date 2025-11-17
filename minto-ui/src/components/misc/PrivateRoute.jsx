import { Navigate, Outlet } from "react-router-dom";
import PropTypes from 'prop-types';
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = () => {
    const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;

}

PrivateRoute.propTypes = {
    children: PropTypes.node
};

export default PrivateRoute