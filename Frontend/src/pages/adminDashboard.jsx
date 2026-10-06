import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { logout } from "../utils/auth";
import Navbar from "../components/Navbar";

import "../styles/dashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userAddress, setUserAddress] = useState("");

    const [storeName, setStoreName] = useState("");
    const [storeEmail, setStoreEmail] = useState("");
    const [storeAddress, setStoreAddress] = useState("");

    const [userRole, setUserRole] = useState("");
    const [userSortBy, setUserSortBy] = useState("created_at");
    const [userOrder, setUserOrder] = useState("DESC");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [storeForm, setStoreForm] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                statsResponse,
                usersResponse,
                storesResponse
            ] = await Promise.all([
                api.get("/admin/dashboard"),
                api.get("/admin/users"),
                api.get("/admin/stores")
            ]);

            setStats(statsResponse.data);
            setUsers(usersResponse.data);
            setStores(storesResponse.data);

        } catch (error) {
            console.error("Admin dashboard error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load admin dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const searchUsers = async () => {
        try {
            const response = await api.get("/admin/users", {
                params: {
                    name: userName || undefined,
                    email: userEmail || undefined,
                    address: userAddress || undefined,
                    role: userRole || undefined,
                    sortBy: userSortBy,
                    order: userOrder
                }
            });

            setUsers(response.data);

        } catch (error) {
            console.error("User search error:", error);
        }
    };

    const searchStores = async () => {
        try {
            const response = await api.get("/admin/stores", {
                params: {
                    name: storeSearch || undefined,
                    email: storeEmail || undefined,
                    address: storeAddress || undefined
                }
            });

            setStores(response.data);

        } catch (error) {
            console.error("Store search error:", error);
        }
    };

    const handleStoreChange = (e) => {
        const { name, value } = e.target;

        setStoreForm({
            ...storeForm,
            [name]: value
        });
    };

    const createStore = async (e) => {
        e.preventDefault();

        try {
            await api.post("/admin/stores", {
                name: storeForm.name,
                email: storeForm.email,
                address: storeForm.address,
                owner_id: storeForm.owner_id
                    ? Number(storeForm.owner_id)
                    : null
            });

            alert("Store created successfully");

            setStoreForm({
                name: "",
                email: "",
                address: "",
                owner_id: ""
            });

            fetchDashboard();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to create store"
            );
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <h2>Loading Admin Dashboard...</h2>
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
        <div className="admin-dashboard">

            {/* Header */}

          <Navbar
                tittle="Admin Dashboard"
                subtittle="Manage users, stores and platform data"
          />


            <main className="admin-content">

                {/* Statistics */}

                <section className="admin-section">

                    <div className="section-heading">
                        <h2>Overview</h2>
                        <p>Platform statistics</p>
                    </div>

                    <div className="admin-stats">

                        <div className="admin-stat-card">
                            <span>Users</span>
                            <h3>
                                {stats?.total_users ?? 0}
                            </h3>
                        </div>

                        <div className="admin-stat-card">
                            <span>Stores</span>
                            <h3>
                                {stats?.total_stores ?? 0}
                            </h3>
                        </div>

                        <div className="admin-stat-card">
                            <span>Ratings</span>
                            <h3>
                                {stats?.total_ratings ?? 0}
                            </h3>
                        </div>

                    </div>

                </section>


                {/* Create Store */}

                <section className="admin-section">

                    <div className="section-heading">
                        <h2>Create Store</h2>
                        <p>Add a new store to the platform</p>
                    </div>

                    <form
                        className="store-form"
                        onSubmit={createStore}
                    >

                        <input
                            type="text"
                            name="name"
                            value={storeForm.name}
                            onChange={handleStoreChange}
                            placeholder="Store name"
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            value={storeForm.email}
                            onChange={handleStoreChange}
                            placeholder="Store email"
                            required
                        />

                        <input
                            type="text"
                            name="address"
                            value={storeForm.address}
                            onChange={handleStoreChange}
                            placeholder="Store address"
                            required
                        />

                        <input
                            type="number"
                            name="owner_id"
                            value={storeForm.owner_id}
                            onChange={handleStoreChange}
                            placeholder="Owner ID (optional)"
                        />

                        <button
                            type="submit"
                            className="form-button"
                        >
                            Create Store
                        </button>

                    </form>

                </section>


                {/* Users */}

                <section className="admin-section">

                    <div className="section-heading">
                        <h2>Users</h2>
                        <p>Manage registered users</p>
                    </div>

                    <div className="admin-search">

                        <input
                            type="text"
                            value={userName}
                            onChange={(e) =>
                                setUserName(e.target.value)
                            }
                            placeholder="Search by store name"
                        />

                        <input
                            type="text"
                            value={userEmail}
                            onChange={(e) => 
                                setUserEmail(e.target.value)
                            }
                            placeholder="Search by email"
                        />

                        <input
                            type="text"
                            value={userAddress}
                            onChange={(e) =>
                                setUserAddress(e.target.value)
                            }
                            placeholder="Search by address"
                        />

                        <select 
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="USER">User</option>
                            <option value="OWNER">Owner</option>
                            <option value="ADMIN">Admin</option>
                        </select>

                        <select 
                            value={userSortBy}
                            onChange={(e)=> setUserSortBy(e.target.value)}
                        >
                            <option value="created_at">Created Date</option>
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                            <option value="role">Role</option>

                        </select>

                        <select 
                            value={userOrder}
                            onChange={(e)=> setUserOrder(e.target.value)}
                        >
                            <option value="DESC">Descending</option>
                            <option value="ASC">Ascending</option>
                        </select>

                        <button onClick={searchUsers}>
                            Search
                        </button>

                    </div>

                    <div className="admin-table-container">

                        <table className="admin-table">

                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Role</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.map((user) => (
                                    <tr key={user.id}>

                                        <td>
                                            <strong>
                                                {user.name}
                                            </strong>
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>
                                            {user.address}
                                        </td>

                                        <td>
                                            <span className="role-badge">
                                                {user.role}
                                            </span>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                </section>


                {/* Stores */}

                <section className="admin-section">

                    <div className="section-heading">
                        <h2>Stores</h2>
                        <p>Manage platform stores</p>
                    </div>

                    <div className="admin-search">

                        <input
                            type="text"
                            value={storeName}
                            onChange={(e) =>
                                setStoreName(e.target.value)
                            }
                            placeholder="Search by store name"
                        />

                        <input 
                            type="text"
                            value={storeEmail}
                            onChange={(e) =>
                                setStoreEmail(e.target.value)
                            }
                            placeholder="Search by email"
                        />

                        <input
                            type="text"
                            value={storeAddress}
                            onChange={(e)=>
                               setStoreAddress(e.target.value)
                            }
                            placeholder="Search by address"
                        />

                        <button onClick={searchStores}>
                            Search
                        </button>

                    </div>

                    <div className="admin-table-container">

                        <table className="admin-table">

                            <thead>
                                <tr>
                                    <th>Store</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>

                            <tbody>

                                {stores.map((store) => (
                                    <tr key={store.id}>

                                        <td>
                                            <strong>
                                                {store.name}
                                            </strong>
                                        </td>

                                        <td>
                                            {store.email}
                                        </td>

                                        <td>
                                            {store.address}
                                        </td>

                                        <td>
                                            ⭐{" "}
                                            {store.overall_rating ?? 0}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;
