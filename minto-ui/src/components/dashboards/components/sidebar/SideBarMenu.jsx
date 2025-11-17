import { CashCoin, CreditCard, Envelope, Gear, GraphUpArrow, Journals, People, PersonSlash, PersonVcard, UiChecksGrid } from "react-bootstrap-icons"
import { Link } from "react-router-dom"
import PropTypes from 'prop-types';
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

const SideBarMenu = (props) => {
    const { onMenuClick } = props
    const { logout } = useAuth()
    const [activeLink, setActiveLink] = useState('dashboard-home')

    const handleLinkClick = (path) => {
        setActiveLink(path)
    }

    return (
        <>
            <div className="sidebar">
                <Link 
                    onClick={() => {
                        onMenuClick('Dashboard')
                        handleLinkClick('dashboard-home')
                    }}
                    className={activeLink === 'dashboard-home' ? 'active' : ''}
                >
                    <span>
                        <UiChecksGrid size={20}/>
                        <h3>Dashboard</h3>
                    </span>
                </Link>
                <Link 
                    onClick={() => {
                        onMenuClick('Users')
                        handleLinkClick('users-panel')
                    }}
                    className={activeLink === 'users-panel' ? 'active' : ''}
                >
                    <span>
                        <People size={20} />
                        <h3>Users</h3>
                    </span>
                </Link>
                <Link 
                    onClick={() => {
                        onMenuClick('Members')
                        handleLinkClick('members-panel')
                    }}
                    className={activeLink === 'members-panel' ? 'active' : ''}
                >
                    <span>
                        <PersonVcard size={20} />
                        <h3>Membership</h3>
                    </span>
                </Link>
                <Link 
                    onClick={() => {
                        onMenuClick('Payments')
                        handleLinkClick('payments-panel')
                    }}
                    className={activeLink === 'payments-panel' ? 'active' : ''}
                >
                    <span>
                        <CashCoin size={20}/>
                        <h3>Payments</h3>
                    </span>
                </Link>
                <Link 
                    onClick={() => {
                        onMenuClick('Analytics')
                        handleLinkClick('analytics-panel')
                    }}
                    className={activeLink === 'analytics-panel' ? 'active' : ''}
                >
                    <span>
                        <GraphUpArrow size={20}/>
                        <h3>Analytics</h3>
                    </span>
                </Link>
                <Link 
                    onClick={() => {
                        onMenuClick('Messages')
                        handleLinkClick('messages-panel')
                    }}
                    className={activeLink === 'messages-panel' ? 'active' : ''}
                >
                    <span>
                        <Envelope size={20}/>
                        <h3>Messages</h3>
                        <div className="badge message-count">26</div>
                    </span>
                </Link>
                <Link 
                    onClick={() => {
                        onMenuClick('Reports')
                        handleLinkClick('reports-panel')
                    }}
                    className={activeLink === 'reports-panel' ? 'active' : ''}
                >
                    <span>
                        <Journals size={20}/>
                        <h3>Reports</h3>
                    </span>
                </Link>
                <Link 
                    onClick={() => {
                        onMenuClick('Settings')
                        handleLinkClick('settings-panel')
                    }}
                    className={activeLink === 'settings-panel' ? 'active' : ''}
                >
                    <span>
                        <Gear size={20}/>
                        <h3>Settings</h3>
                    </span>
                </Link>
                <Link 
                    onClick={() => {
                        onMenuClick('Add Payment')
                        handleLinkClick('add-payment-panel')
                    }}
                    className={activeLink === 'add-payment-panel' ? 'active' : ''}
                >
                    <span>
                        <CreditCard size={20}/>
                        <h3>Add Payment</h3>
                    </span>
                </Link>
                <Link onClick={logout} title="Logout">
                    <span>
                        <PersonSlash size={20}/>
                        <h3>Logout</h3>
                    </span>
                </Link>
            </div>
        </>
    )
}

SideBarMenu.propTypes = {
    onMenuClick: PropTypes.func
}

export default SideBarMenu
