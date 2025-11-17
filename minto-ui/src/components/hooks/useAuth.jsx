import { useContext } from "react";
import AuthenticationContext from "../context/AuthenticationContext";

export const useAuth = () => useContext(AuthenticationContext)