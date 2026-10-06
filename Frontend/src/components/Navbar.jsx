import { useNavigate } from "react-router-dom";

import { logout } from "../utils/auth";

function Navbar({ title, subtitle }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="app-navbar">

            <div className="navbar-content">

                <div>
                    <h1>{title}</h1>

                    {subtitle && (
                        <p>{subtitle}</p>
                    )}
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </header>
    );
}

export default Navbar;