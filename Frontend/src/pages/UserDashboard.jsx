import { useEffect, useState } from "react";

import api from "../services/api";
import Navbar from "../components/Navbar";

import "../styles/dashboard.css";


function UserDashboard() {

    const [stores, setStores] = useState([]);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [ratings, setRatings] = useState({});
    const [currentPassword , setCurrentPassword] =useState("");
    const [newPassword , setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

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


    useEffect(() => {
        fetchStores();
    }, []);


    const handleRatingChange = (storeId, value) => {
        setRatings({
            ...ratings,
            [storeId]: value
        });
    };

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

    const updatePassword = async (e) => {
        e.preventDefault();

        if(newPassword !== confirmNewPassword){
            alert("New password do not match");
        }

        try{
            await api.put("/user/password",{
                currentPassword,
                newPassword
            })
            alert("password update successfully");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        }catch (error){
            alert(
                error.response?.data?.message ||
                "Faild to update password"
            )
        }
    }


    return (
        <div className="user-dashboard">

            {/* Header */}

            <Navbar
                title="Store Rating app"
                subtitle="Discover and rate stores"
            />

            {/* password update */}

            <section className="password-section" >

                 <h2>Update Password</h2>
                
                <form 
                   className="password-form"
                   onSubmit={updatePassword}
                >
                    <input 
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword} 
                        onChange={(e) =>
                            setCurrentPassword(e.target.value)
                        }
                        required
                    />

                    <input 
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                        required
                    />

                    <input 
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmNewPassword}
                        onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                        } 
                        required
                    />

                    <button type="submit">
                        Update Password
                    </button>

                </form>

            </section>


            {/* Search */}

            <section className="search-box">

                <h2>Find Stores</h2>

                <div className="search-controls">

                    <input
                        type="text"
                        placeholder="Search by store name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />

                    <input
                        type="text"
                        placeholder="Search by address"
                        value={address}
                        onChange={(e) =>
                            setAddress(e.target.value)
                        }
                    />

                    <button onClick={fetchStores}>
                        Search
                    </button>

                </div>

            </section>


            {/* Error */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* Loading */}

            {loading && (
                <div className="loading-message">
                    Loading stores...
                </div>
            )}


            {/* Empty */}

            {!loading && stores.length === 0 && (
                <div className="empty-message">
                    No stores found.
                </div>
            )}


            {/* Stores */}

            {!loading && stores.length > 0 && (

                <section className="stores-section">

                    <h2>Available Stores</h2>

                    <div className="store-grid">

                        {stores.map((store) => (

                            <div
                                className="store-card"
                                key={store.id}
                            >

                                <div className="store-card-header">

                                    <h3>
                                        {store.name}
                                    </h3>

                                    <span className="rating-badge">
                                        ⭐ {store.overall_rating}
                                    </span>

                                </div>


                                <div className="store-details">

                                    <p>
                                        <strong>Email:</strong>{" "}
                                        {store.email}
                                    </p>

                                    <p>
                                        <strong>Address:</strong>{" "}
                                        {store.address}
                                    </p>

                                </div>


                                <div className="my-rating">

                                    <span>
                                        <strong>My Rating:</strong>
                                    </span>

                                    <span>
                                        {store.my_rating === null
                                            ? "Not rated yet"
                                            : `⭐ ${store.my_rating}`
                                        }
                                    </span>

                                </div>


                                <div className="rating-action">

                                    <select
                                        value={
                                            ratings[store.id] || ""
                                        }
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


                                    {store.my_rating === null ? (

                                        <button
                                            className="rating-btn"
                                            onClick={() =>
                                                submitRating(
                                                    store.id
                                                )
                                            }
                                        >
                                            Submit Rating
                                        </button>

                                    ) : (

                                        <button
                                            className="rating-btn"
                                            onClick={() =>
                                                updateRating(
                                                    store.id
                                                )
                                            }
                                        >
                                            Update Rating
                                        </button>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                </section>

            )}

        </div>
    );
}

export default UserDashboard;