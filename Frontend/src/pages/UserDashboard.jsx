import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function UserDashboard() {

    const navigate = useNavigate();

    const [stores, setStores] = useState([]);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [ratings, setRatings] = useState({});


    // Get stores
    const fetchStores = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/user/stores", {
                params: {
                    name: name || undefined,
                    address: address || undefined
                }
            });

            setStores(response.data);

        } catch (error) {

            console.error("Store fetch error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load stores"
            );

        } finally {

            setLoading(false);

        }
    };


    // Page load
    useEffect(() => {
        fetchStores();
    }, []);


    // Rating input change
    const handleRatingChange = (storeId, value) => {

        setRatings({
            ...ratings,
            [storeId]: value
        });

    };


    // Submit new rating
    const submitRating = async (storeId) => {

        const rating = ratings[storeId];

        if (!rating) {
            alert("Please select a rating");
            return;
        }

        try {

            await api.post("/user/ratings", {
                store_id: storeId,
                rating: Number(rating)
            });

            alert("Rating submitted successfully");

            fetchStores();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to submit rating"
            );

        }
    };


    // Update existing rating
    const updateRating = async (storeId) => {

        const rating = ratings[storeId];

        if (!rating) {
            alert("Please select a rating");
            return;
        }

        try {

            await api.put(
                `/user/ratings/${storeId}`,
                {
                    rating: Number(rating)
                }
            );

            alert("Rating updated successfully");

            fetchStores();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to update rating"
            );

        }
    };


    // Logout
    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    return (
        <div>

            <h1>Store Rating App</h1>

            <button onClick={handleLogout}>
                Logout
            </button>


            <hr />


            <h2>Stores</h2>


            {/* Search */}

            <div>

                <input
                    type="text"
                    placeholder="Search store name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

                <input
                    type="text"
                    placeholder="Search address"
                    value={address}
                    onChange={(e) =>
                        setAddress(e.target.value)
                    }
                />

                <button onClick={fetchStores}>
                    Search
                </button>

            </div>


            <hr />


            {/* Error */}

            {error && (
                <p>{error}</p>
            )}


            {/* Loading */}

            {loading && (
                <p>Loading stores...</p>
            )}


            {/* Store list */}

            {!loading && stores.length === 0 && (
                <p>No stores found.</p>
            )}


            {!loading && stores.length > 0 && (

                <div>

                    {stores.map((store) => (

                        <div
                            key={store.id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "20px",
                                marginBottom: "15px"
                            }}
                        >

                            <h3>
                                {store.name}
                            </h3>

                            <p>
                                Email: {store.email}
                            </p>

                            <p>
                                Address: {store.address}
                            </p>

                            <p>
                                Overall Rating:
                                {" "}
                                ⭐ {store.overall_rating}
                            </p>

                            <p>
                                My Rating:
                                {" "}
                                {store.my_rating === null
                                    ? "Not rated yet"
                                    : `⭐ ${store.my_rating}`
                                }
                            </p>


                            {/* Rating */}

                            <select
                                value={ratings[store.id] || ""}
                                onChange={(e) =>
                                    handleRatingChange(
                                        store.id,
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Rating
                                </option>

                                <option value="1">
                                    ⭐ 1
                                </option>

                                <option value="2">
                                    ⭐ 2
                                </option>

                                <option value="3">
                                    ⭐ 3
                                </option>

                                <option value="4">
                                    ⭐ 4
                                </option>

                                <option value="5">
                                    ⭐ 5
                                </option>

                            </select>


                            {" "}


                            {store.my_rating === null ? (

                                <button
                                    onClick={() =>
                                        submitRating(store.id)
                                    }
                                >
                                    Submit Rating
                                </button>

                            ) : (

                                <button
                                    onClick={() =>
                                        updateRating(store.id)
                                    }
                                >
                                    Update Rating
                                </button>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default UserDashboard;