import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function OwnerDashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>

            <h1>Owner Dashboard</h1>

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default OwnerDashboard;