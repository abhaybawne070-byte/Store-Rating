import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // Login nahi hai
    if (!token || !userData) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(userData);

    // Role allowed nahi hai
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;