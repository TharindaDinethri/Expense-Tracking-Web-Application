import {
    NavLink,
    useNavigate
} from 'react-router-dom';

import {
    LayoutDashboard,
    Receipt,
    Wallet,
    UserCircle,
    LogOut
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {

    const { user, logout } = useAuth();

    const nav = useNavigate();

    const initials = user?.name
        ? user.name
            .split(' ')
            .map(name => name[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        : 'U';

    return (
        <div className="app">

            {/* Sidebar */}

            <aside>

                <div className="brand">
                    <span>EF</span>

                    <div>
                        <b>ExpenseFlow</b>
                        <small>Personal finance</small>
                    </div>
                </div>

                <nav>

                    {[
                        ['/','Dashboard',LayoutDashboard],
                        ['/expenses','Expenses',Receipt],
                        ['/income','Income',Wallet],
                        ['/profile','Profile',UserCircle]
                    ].map(([to, label, I]) => (

                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                isActive ? 'active' : ''
                            }
                        >
                            <I size={18} />
                            {label}
                        </NavLink>

                    ))}

                </nav>

                <button
                    className="logout"
                    onClick={() => {
                        logout();
                        nav('/login');
                    }}
                >
                    <LogOut size={18} />
                    Sign out
                </button>

            </aside>

            {/* Main Content */}

            <main>

                <header>

                    <div>

                        <p className="eyebrow">
                            Welcome back
                        </p>

                        <h2>
                            {user?.name || 'User'}
                        </h2>

                    </div>

                    {/* Profile Picture */}

                    <div className="header-profile">

                        {user?.profilePicture ? (

                            <img
                                src={user.profilePicture}
                                alt="Profile"
                                className="header-profile-image"
                            />

                        ) : (

                            <div className="avatar">
                                {initials}
                            </div>

                        )}

                    </div>

                </header>

                {children}

            </main>

        </div>
    );
}