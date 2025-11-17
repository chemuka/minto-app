import { useContext } from "react";
import DashboardThemeContext from "../context/DashboardThemeContext";

export const useTheme = () => useContext(DashboardThemeContext)