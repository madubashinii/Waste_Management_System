import { NavLink } from 'react-router-dom';

export default function ResidentSidebar() {
    return (
        <div style={{ width: '250px', background: '#333', color: '#fff', padding: '20px' }}>
            <h2>Resident Panel</h2>
            <nav>
                <ul>
                    <li><NavLink to="dashboard">Dashboard</NavLink></li>
                    <li><NavLink to="bins">Bins</NavLink></li>
                    <li><NavLink to="billing">Billing</NavLink></li>
                    <li><NavLink to="request-form">New Request</NavLink></li>
                    <li><NavLink to="profile">profile</NavLink></li>
                    <li><NavLink to="notifications">notifications</NavLink></li>
                    <li><NavLink to="wasteform">wasteform</NavLink></li>

                </ul>
            </nav>
        </div>
    );
}
