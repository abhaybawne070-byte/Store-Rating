import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { logout } from "../utils/auth";

function OwnerDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/owner/dashboard"
            );

            console.log(
                "Owner dashboard:",
                response.data
            );

            setDashboard(response.data);

        } catch (error) {

            console.error(
                "Owner dashboard error:",
                error
            );

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
            <h2>Loading Owner Dashboard...</h2>
        );

    }


    if (error) {

        return (
            <div>

                <h2>Error</h2>

                <p>{error}</p>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>
        );

    }


    return (

        <div>

            <h1>Owner Dashboard</h1>

            <button onClick={handleLogout}>
                Logout
            </button>


            <hr />


            {/* Store Information */}

            <h2>My Store</h2>

            <div>

                <h3>
                    {dashboard?.store?.name}
                </h3>

                <p>
                    Email: {dashboard?.store?.email}
                </p>

                <p>
                    Address: {dashboard?.store?.address}
                </p>

            </div>


            <hr />


            {/* Statistics */}

            <h2>Statistics</h2>

            <div>

                <div>

                    <h3>
                        Average Rating
                    </h3>

                    <p>
                        ⭐{" "}
                        {dashboard?.statistics?.average_rating ?? 0}
                    </p>

                </div>


                <div>

                    <h3>
                        Total Ratings
                    </h3>

                    <p>
                        {dashboard?.statistics?.total_ratings ?? 0}
                    </p>

                </div>

            </div>


            <hr />


            {/* Ratings */}

            <h2>User Ratings</h2>


            {!dashboard?.ratings ||
            dashboard.ratings.length === 0 ? (

                <p>
                    No ratings yet.
                </p>

            ) : (

                <table
                    border="1"
                    cellPadding="10"
                >

                    <thead>

                        <tr>

                            <th>
                                User
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Rating
                            </th>

                            <th>
                                Date
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {dashboard.ratings.map(
                            (rating) => (

                                <tr key={rating.id}>

                                    <td>
                                        {rating.user_name}
                                    </td>

                                    <td>
                                        {rating.user_email}
                                    </td>

                                    <td>
                                        ⭐ {rating.rating}
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

            )}

        </div>
    );
}

export default OwnerDashboard;