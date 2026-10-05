import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AdminDashboard from "./pages/adminDashboard";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";



function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Public routes */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />


                {/* Admin */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* User */}

                <Route
                    path="/user"
                    element={
                        <ProtectedRoute allowedRole="USER">
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* Owner */}

                <Route
                    path="/owner"
                    element={
                        <ProtectedRoute allowedRole="OWNER">
                            <OwnerDashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;