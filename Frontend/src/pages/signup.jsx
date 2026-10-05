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


        // Password match
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


            console.log(
                "Signup response:",
                response.data
            );


            setSuccess(
                "Account created successfully!"
            );


            // Login page par bhejo
            setTimeout(() => {

                navigate("/login");

            }, 1000);


        } catch (error) {

            console.error(
                "Signup error:",
                error
            );


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

            <h1>Create Account</h1>

               <p className="auth-subtitle">
                   Create your Store Rating account
               </p>
 
            <form onSubmit={handleSignup}>

                {/* Name */}

                <div className="auth-form-group">

                    <label>
                        Name
                    </label>



                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />

                </div>





                {/* Email */}

                <div className="auth-form-group">

                    <label>
                        Email
                    </label>

                    <br />

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />

                </div>


                <br />


                {/* Address */}

                <div className="auth-form-group">

                    <label>
                        Address
                    </label>

                    <br />

                    <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        required
                    />

                </div>





                {/* Password */}

                <div className="auth-form-group">

                    <label>
                        Password
                    </label>

                    <br />

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                    />

                </div>





                {/* Confirm Password */}

                <div className="auth-form-group">

                    <label>
                        Confirm Password
                    </label>

                    <br />

                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        required
                    />

                </div>





                {/* Error */}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}


                {/* Success */}

                {success && (
                    <p className="success-message">
                        {success}
                    </p>
                )}


                <button
                    className="auth-button"
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Creating Account..."
                        : "Create Account"
                    }

                </button>

            </form>

            <button
                className="secondary-button"
                onClick={() => navigate("/login")}
            >
                Already have an account? Login
            </button>

            </div>

        </div>
    );
}

export default Signup;