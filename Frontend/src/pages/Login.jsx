import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });

            console.log("Login response:", response.data);

            // Token save
            localStorage.setItem(
                "token",
                response.data.token
            );

            // User data save
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            // Role ke according redirect
            const role = response.data.user.role;

            if (role === "ADMIN") {
                navigate("/admin");
            }
            else if (role === "USER") {
                navigate("/user");
            }
            else if (role === "OWNER") {
                navigate("/owner");
            }
            else {
                setError("Invalid user role");
            }

        } catch (error) {

            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div>

            <h1>Store Rating App</h1>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter email"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter password"
                        required
                    />
                </div>

                <br />

                {error && (
                    <p>{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

            <br />

            <button
                onClick={() => navigate("/signup")}
            >
                Create Account
            </button>

        </div>
    );
}

export default Login;