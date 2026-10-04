import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

        <div>

            <h1>Create Account</h1>


            <form onSubmit={handleSignup}>

                {/* Name */}

                <div>

                    <label>
                        Name
                    </label>

                    <br />

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />

                </div>


                <br />


                {/* Email */}

                <div>

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

                <div>

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


                <br />


                {/* Password */}

                <div>

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


                <br />


                {/* Confirm Password */}

                <div>

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


                <br />


                {/* Error */}

                {error && (
                    <p>
                        {error}
                    </p>
                )}


                {/* Success */}

                {success && (
                    <p>
                        {success}
                    </p>
                )}


                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Creating Account..."
                        : "Create Account"
                    }

                </button>

            </form>


            <br />


            <button
                onClick={() => navigate("/login")}
            >
                Already have an account? Login
            </button>

        </div>
    );
}

export default Signup;