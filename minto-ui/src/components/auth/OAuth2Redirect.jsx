import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { parseJwt } from "../misc/Util"

const OAuth2Redirect = () => {
    const { userLogin } = useContext(AuthContext)
    const [redirectTo, setRedirectTo] = useState('/login')
  
    const location = useLocation()
    const navigate = useNavigate()
  
    useEffect(() => {
      const accessToken = extractUrlParameter('accessToken')
      if (accessToken) {
        const redirect = handleLogin(accessToken)
        setRedirectTo(redirect)
        navigate(redirect)
      }
    }, [])
  
    const extractUrlParameter = (key) => {
      return new URLSearchParams(location.search).get(key)
    }
  
    const handleLogin = (accessToken) => {
      const decoded = parseJwt(accessToken)
      const user = { decoded, accessToken }
  
      userLogin(user)
      if(decoded.role === 'ADMIN')
        return '/admin-profile';
      else if(decoded.role === 'STAFF')
        return '/staff-profile';
      else
        return '/user-profile';
    };
  
    return <Navigate to={redirectTo} />
}

export default OAuth2Redirect
