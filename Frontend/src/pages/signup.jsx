import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "../styles/dashboard.css";

function Signup() {


    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);



    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
     
     
       });
    };




    const handleSignup = async (e) => {


        e.preventDefault();

        setError("");
        setSuccess("");



        if (form.password !== form.confirmPassword) {


            setError("Passwords do not match");


            return;
        }


        try {

            setLoading(true);


            const response = await api.post(
                "/auth/signup",
                {
                    name: form.name,
                    email: form.email,
                    address: form.address,
                    password: form.password
                }
            );

            console.log("Signup response:", response.data);

            setSuccess("Account created successfully!");


         setTimeout(() => {

                navigate("/login");
            }, 1000);

        } catch (error) {
            console.error("Signup error:", error);

            setError(
                error.response?.data?.message ||
                "Signup failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1 className="auth-title">
                    Create Account
                </h1>

                <p className="auth-subtitle">
                    Create your Store Rating account
                </p>

                <form
                    className="auth-form"
                    onSubmit={handleSignup}
                >

                    <div className="auth-field">
                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Address</label>

                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Confirm Password</label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="auth-success">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }
                    </button>

                </form>

                <button
                    className="auth-secondary"
                    onClick={() => navigate("/login")}
                >
                    Already have an account? Login
                </button>

            </div>

        </div>
    );
}

export default Signup;