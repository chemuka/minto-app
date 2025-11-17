import { useState } from "react"
import PropTypes from 'prop-types';
import DashboardThemeContext from "../context/DashboardThemeContext";

const DashboardThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light')

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
    }

    return (
        <DashboardThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </DashboardThemeContext.Provider>
    )
}

DashboardThemeProvider.propTypes = {
    children: PropTypes.node
};

export default DashboardThemeProvider
