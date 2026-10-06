import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import api from "../services/api";
import { logout } from "../utils/auth";

import "../styles/dashboard.css";

function OwnerDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/owner/dashboard");

            setDashboard(response.data);

        } catch (error) {
            console.error("Owner dashboard error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <h2>Loading Dashboard...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error-page">
                <div className="error-card">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="owner-dashboard">

            {/* Header */}

            <header className="owner-header">

                <div>
                    <h1>Owner Dashboard</h1>
                    <p>Manage your store and view ratings</p>
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>


            <main className="owner-content">

                {/* Store */}

                <section className="owner-section">

                    <div className="section-heading">
                        <div>
                            <h2>My Store</h2>
                            <p>Store information</p>
                        </div>
                    </div>

                    <div className="store-info-card">

                        <div>
                            <span>Store Name</span>
                            <h3>
                                {dashboard?.store?.name}
                            </h3>
                        </div>

                        <div>
                            <span>Email</span>
                            <p>
                                {dashboard?.store?.email}
                            </p>
                        </div>

                        <div>
                            <span>Address</span>
                            <p>
                                {dashboard?.store?.address}
                            </p>
                        </div>

                    </div>

                </section>


                {/* Statistics */}

                <section className="owner-section">

                    <div className="section-heading">
                        <div>
                            <h2>Statistics</h2>
                            <p>Overview of your store ratings</p>
                        </div>
                    </div>

                    <div className="owner-stats">

                        <div className="owner-stat-card">

                            <span className="stat-label">
                                Average Rating
                            </span>

                            <h3>
                                ⭐{" "}
                                {dashboard?.statistics
                                    ?.average_rating ?? 0}
                            </h3>

                            <p>
                                Out of 5
                            </p>

                        </div>


                        <div className="owner-stat-card">

                            <span className="stat-label">
                                Total Ratings
                            </span>

                            <h3>
                                {dashboard?.statistics
                                    ?.total_ratings ?? 0}
                            </h3>

                            <p>
                                Customer ratings
                            </p>

                        </div>

                    </div>

                </section>


                {/* Ratings */}

                <section className="owner-section">

                    <div className="section-heading">
                        <div>
                            <h2>Customer Ratings</h2>
                            <p>
                                See what customers think about your store
                            </p>
                        </div>
                    </div>


                    {!dashboard?.ratings ||
                    dashboard.ratings.length === 0 ? (

                        <div className="empty-message">
                            No ratings yet.
                        </div>

                    ) : (

                        <div className="owner-table-container">

                            <table className="owner-table">

                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Rating</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {dashboard.ratings.map(
                                        (rating) => (

                                            <tr key={rating.id}>

                                                <td>
                                                    <strong>
                                                        {rating.user_name}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {rating.user_email}
                                                </td>

                                                <td>
                                                    <span className="owner-rating">
                                                        ⭐{" "}
                                                        {rating.rating}
                                                    </span>
                                                </td>

                                                <td>
                                                    {rating.created_at
                                                        ? new Date(
                                                            rating.created_at
                                                        ).toLocaleDateString()
                                                        : "-"
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default OwnerDashboard;