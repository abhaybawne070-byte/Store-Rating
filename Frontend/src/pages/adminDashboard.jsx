import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import "../styles/dashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();
 
    // STATES

    const [creatingStore, setCreatingStore] = useState(false);

    const [deletingStore, setDeletingStore] = useState(null);

    const [editingStore, setEditingStore] = useState(null);

    const [editStoreForm, setEditStoreForm] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    const [dashboard, setDashboard] = useState(null);

    const [users, setUsers] = useState([]);

    const [stores, setStores] = useState([]);

    const [owners, setOwners] = useState([]);

    const [userSearch, setUserSearch] = useState("");

    const [storeSearch, setStoreSearch] = useState("");

    const [storeForm, setStoreForm] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    const [storeMessage, setStoreMessage] = useState("");

    const [storeError, setStoreError] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // FETCH ADMIN DASHBOARD

    const fetchDashboard = async () => {

        try {

            setLoading(true);

            setError("");

            const [
                dashboardResponse,
                usersResponse,
                storesResponse
            ] = await Promise.all([

                api.get("/admin/dashboard"),

                api.get("/admin/users"),

                api.get("/admin/stores")

            ]);


            // Dashboard statistics
            setDashboard(
                dashboardResponse.data
            );


            // Users
            const usersData =
                usersResponse.data;

            setUsers(usersData);


            // Only OWNER users
            const ownerUsers =
                usersData.filter(
                    (user) =>
                        user.role === "OWNER"
                );

            setOwners(ownerUsers);


            // Stores
            setStores(
                storesResponse.data
            );


        } catch (error) {

            console.error(
                "Admin dashboard error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load admin dashboard"
            );

        } finally {

            setLoading(false);

        }

    };



    // LOAD DATA


    useEffect(() => {

        fetchDashboard();

    }, []);



    // STORE FORM CHANGE


    const handleStoreChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setStoreForm({
            ...storeForm,
            [name]: value
        });

    };



    // CREATE STORE


    const handleCreateStore = async (e) => {

        e.preventDefault();

        setStoreMessage("");

        setStoreError("");

        setCreatingStore(true);


        try {

            const response =
                await api.post(
                    "/admin/stores",
                    {
                        name: storeForm.name,
                        email: storeForm.email,
                        address: storeForm.address,
                        owner_id:
                            Number(
                                storeForm.owner_id
                            )
                    }
                );


            console.log(
                "Store created:",
                response.data
            );


            setStoreMessage(
                "Store created successfully!"
            );


            // Clear form
            setStoreForm({
                name: "",
                email: "",
                address: "",
                owner_id: ""
            });


            // Refresh dashboard
            await fetchDashboard();


        } catch (error) {

            console.error(
                "Create store error:",
                error
            );


            setStoreError(
                error.response?.data?.message ||
                "Failed to create store"
            );

        } finally {

            setCreatingStore(false);

        }

    };

    const handleDeleteStore = async (storeId) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this store?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        setDeletingStore(storeId);

        await api.delete(
            `/admin/stores/${storeId}`
        );

        alert("Store deleted successfully");

        await fetchDashboard();

    } catch (error) {

        console.error(
            "Delete store error:",
            error
        );

        alert(
            error.response?.data?.message ||
            "Failed to delete store"
        );

    } finally {

        setDeletingStore(null);

    }

    };

    const handleEditStore = (store) => {

        setEditingStore(store);

        setEditStoreForm({
            name: store.name || "",
            email: store.email || "",
            address: store.address || "",
            owner_id: store.owner_id || ""
        });

    };

    const handleUpdateStore = async (e) => {

    e.preventDefault();

    try {

        await api.put(
            `/admin/stores/${editingStore.id}`,
            {
                name: editStoreForm.name,
                email: editStoreForm.email,
                address: editStoreForm.address,
                owner_id:
                    editStoreForm.owner_id
                        ? Number(editStoreForm.owner_id)
                        : null
            }
        );

        alert("Store updated successfully");

        setEditingStore(null);

        await fetchDashboard();

        } catch (error) {

        console.error(
            "Update store error:",
            error
        );

        alert(
            error.response?.data?.message ||
            "Failed to update store"
        );

    }

    };

    // LOGOUT

    const handleLogout = () => {

        logout();

        navigate("/login");

    };



    // SEARCH USERS


    const filteredUsers =
        users.filter((user) => {

            const search =
                userSearch
                    .toLowerCase()
                    .trim();


            return (

                user.name
                    ?.toLowerCase()
                    .includes(search)

                ||

                user.email
                    ?.toLowerCase()
                    .includes(search)

                ||

                user.role
                    ?.toLowerCase()
                    .includes(search)

            );

        });



    // SEARCH STORES


    const filteredStores =
        stores.filter((store) => {

            const search =
                storeSearch
                    .toLowerCase()
                    .trim();


            return (

                store.name
                    ?.toLowerCase()
                    .includes(search)

                ||

                store.email
                    ?.toLowerCase()
                    .includes(search)

                ||

                store.address
                    ?.toLowerCase()
                    .includes(search)

            );

        });



    // LOADING


    if (loading) {

        return (
            <div className="dashboard-loading">
                <h2>
                    Loading Admin Dashboard...
                </h2>
            </div>
        );

    }


    
    // MAIN UI


    return (

        <div className="dashboard">


            {/* 
                HEADER
            */}

            <header className="dashboard-header">

                <div>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Manage users, stores and ratings
                    </p>

                </div>


                <button
                    onClick={handleLogout}
                    className="logout-button"
                >
                    Logout
                </button>

            </header>



            <main className="dashboard-content">


                {/* 
                    ERROR
                */}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}



                {/*
                    STATISTICS
                */}

                <section className="stats-grid">


                    <div className="stat-card">

                        <h3>
                            Total Users
                        </h3>

                        <p className="stat-number">

                            {
                                dashboard?.total_users ??
                                0
                            }

                        </p>

                    </div>



                    <div className="stat-card">

                        <h3>
                            Total Stores
                        </h3>

                        <p className="stat-number">

                            {
                                dashboard?.total_stores ??
                                0
                            }

                        </p>

                    </div>



                    <div className="stat-card">

                        <h3>
                            Total Ratings
                        </h3>

                        <p className="stat-number">

                            {
                                dashboard?.total_ratings ??
                                0
                            }

                        </p>

                    </div>


                </section>



                {/*
                    CREATE STORE
                */}

                <section className="dashboard-section">


                    <h2>
                        Create New Store
                    </h2>


                    <form
                        className="store-form"
                        onSubmit={handleCreateStore}
                    >


                        {/* Store Name */}

                        <div className="form-group">

                            <label>
                                Store Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    storeForm.name
                                }
                                onChange={
                                    handleStoreChange
                                }
                                placeholder="Enter store name"
                                required
                            />

                        </div>



                        {/* Store Email */}

                        <div className="form-group">

                            <label>
                                Store Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    storeForm.email
                                }
                                onChange={
                                    handleStoreChange
                                }
                                placeholder="Enter store email"
                                required
                            />

                        </div>



                        {/* Address */}

                        <div className="form-group">

                            <label>
                                Store Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                value={
                                    storeForm.address
                                }
                                onChange={
                                    handleStoreChange
                                }
                                placeholder="Enter store address"
                                required
                            />

                        </div>



                        {/* Owner */}

                        <div className="form-group">

                            <label>
                                Select Owner
                            </label>


                            <select
                                name="owner_id"
                                value={
                                    storeForm.owner_id
                                }
                                onChange={
                                    handleStoreChange
                                }
                                required
                            >

                                <option value="">
                                    Select an owner
                                </option>


                                {owners.map(
                                    (owner) => (

                                        <option
                                            key={owner.id}
                                            value={owner.id}
                                        >

                                            {
                                                owner.name
                                            }

                                            {" - "}

                                            {
                                                owner.email
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>



                        {/* Message */}

                        {storeMessage && (

                            <div className="success-message">

                                {storeMessage}

                            </div>

                        )}



                        {storeError && (

                            <div className="error-message">

                                {storeError}

                            </div>

                        )}



                        {/* Submit */}

                        <div className="form-button">

                            <button
                                type="submit"
                                disabled={
                                    creatingStore
                                }
                            >

                                {
                                    creatingStore
                                        ? "Creating..."
                                        : "Create Store"
                                }

                            </button>

                        </div>


                    </form>

                </section>

                {editingStore && (

                        <section className="dashboard-section">

                                    <h2>
                                         Edit Store
                                    </h2>


                                    <form
                                             className="store-form"
                                             onSubmit={handleUpdateStore}
                                    >

                                {/* Store Name */}

                                    <div className="form-group">

                <label>
                    Store Name
                </label>

                <input
                    type="text"
                    value={editStoreForm.name}
                    onChange={(e) =>
                        setEditStoreForm({
                            ...editStoreForm,
                            name: e.target.value
                        })
                    }
                    required
                />

                                    </div>


                                {/* Email */}

                                   <div className="form-group">

                <label>
                    Store Email
                </label>

                <input
                    type="email"
                    value={editStoreForm.email}
                    onChange={(e) =>
                        setEditStoreForm({
                            ...editStoreForm,
                            email: e.target.value
                        })
                    }
                    required
                />

                                   </div>


                                {/* Address */}

                                 <div className="form-group">

                <label>
                    Store Address
                </label>

                <input
                    type="text"
                    value={editStoreForm.address}
                    onChange={(e) =>
                        setEditStoreForm({
                            ...editStoreForm,
                            address: e.target.value
                        })
                    }
                    required
                />

                                </div>


                                {/* Owner */}

                                   <div className="form-group">

                <label>
                    Select Owner
                </label>

                <select
                    value={editStoreForm.owner_id}
                    onChange={(e) =>
                        setEditStoreForm({
                            ...editStoreForm,
                            owner_id: e.target.value
                        })
                    }
                >

                    <option value="">
                        Select Owner
                    </option>


                    {owners.map((owner) => (

                        <option
                            key={owner.id}
                            value={owner.id}
                        >
                            {owner.name} - {owner.email}
                        </option>

                    ))}

                </select>

                                 </div>


                                {/* Buttons */}

                                   <div className="form-button">

                <button type="submit">
                    Update Store
                </button>


                <button
                    type="button"
                    onClick={() =>
                        setEditingStore(null)
                    }
                >
                    Cancel
                </button>

                                 </div>

                                </form>

                        </section>

                    )}

                {/* 
                    USERS
                */}

                <section className="dashboard-section">


                    <div className="section-header">

                        <h2>
                            Users
                        </h2>

                    </div>


                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search by name, email or role..."
                        value={userSearch}
                        onChange={(e) =>
                            setUserSearch(
                                e.target.value
                            )
                        }
                    />


                    <div className="table-container">

                        {filteredUsers.length === 0 ? (

                            <p>
                                No users found.
                            </p>

                        ) : (

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Role
                                        </th>

                                        <th>
                                            Address
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        filteredUsers.map(
                                            (user) => (

                                                <tr
                                                    key={
                                                        user.id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            user.id
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            user.name
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            user.email
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            user.role
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            user.address ||
                                                            "N/A"
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )
                                    }

                                </tbody>

                            </table>

                        )}

                    </div>

                </section>



                {/*
                    STORES
                */}

                <section className="dashboard-section">


                    <div className="section-header">

                        <h2>
                            Stores
                        </h2>

                    </div>


                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search by name, email or address..."
                        value={storeSearch}
                        onChange={(e) =>
                            setStoreSearch(
                                e.target.value
                            )
                        }
                    />


                    <div className="table-container">

                        {filteredStores.length === 0 ? (

                            <p>
                                No stores found.
                            </p>

                        ) : (

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Address
                                        </th>

                                        <th>
                                            Owner ID
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        filteredStores.map(
                                            (store) => (

                                                <tr
                                                    key={
                                                        store.id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            store.id
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            store.name
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            store.email
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            store.address
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            store.owner_id ??
                                                            "N/A"
                                                        }
                                                    </td>

                                                    <td>

                                                     <td>

                                            <button
                                                    className="edit-button"
                                                        onClick={() =>
                                                        handleEditStore(store)
                                                    }
                                                    >
                                                     Edit
                                            </button>


                                            <button
                                                     className="delete-button"
                                                        onClick={() =>
                                                        handleDeleteStore(store.id)
                                                    }
                                                    disabled={
                                                        deletingStore === store.id
                                                    }
                                                    >
                                                   {
                                                    deletingStore === store.id
                                                    ? "Deleting..."
                                                        : "Delete"
                                                    }
                                                    </button>

                                                    </td>   

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                        handleDeleteStore(store.id)
                                                          }
                                                         disabled={
                                                            deletingStore === store.id
                                                        }
                                                          >

                                                         {
                                                             deletingStore === store.id
                                                               ? "Deleting..."
                                                             : "Delete"
                                                       }

                                                    </button>

                                                </td>

                                                </tr>

                                            )
                                        )
                                    }

                                </tbody>

                            </table>

                        )}

                    </div>

                </section>


            </main>

        </div>

    );

}


export default AdminDashboard;
