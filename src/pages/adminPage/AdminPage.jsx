import React, { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { collection, getDocs, doc, setDoc, query, orderBy, runTransaction } from "firebase/firestore";
import { auth, provider, db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import EditIcon from "../../images/icon_images/edit.png";
import imageMap from "../../components/product/ImageMap";
import "./adminPage.css";

function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("books");

  // Book Data
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [prices, setPrices] = useState({}); // Keep for record, even if not shown publicly
  const [editMode, setEditMode] = useState({});
  const [editedQuantities, setEditedQuantities] = useState({});
  const [editedPrices, setEditedPrices] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Rental Data
  const [rentals, setRentals] = useState([]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "Products"));
      const fetchedProducts = [];
      const qtyData = {};
      const priceData = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;

        fetchedProducts.push({
          id,
          ...data,
          image: imageMap[data.imageKey] || "",
        });

        qtyData[id] = data.quantity ?? 0;
        priceData[id] = data.price ?? 0;
      });

      fetchedProducts.sort((a, b) => parseInt(a.id) - parseInt(b.id));

      setProducts(fetchedProducts);
      setQuantities(qtyData);
      setPrices(priceData);
    };

    const fetchRentals = async () => {
      try {
        const q = query(collection(db, "Reservations"), orderBy("reservedAt", "desc"));
        const snapshot = await getDocs(q);
        setRentals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching rentals", err);
      }
    };

    if (user && isAdmin) {
      fetchProducts();
      fetchRentals();
    }
  }, [user, isAdmin]);

  // --- Book Management Handlers ---
  const handleQuantityChange = (id, value) => {
    setEditedQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handlePriceChange = (id, value) => {
    setEditedPrices((prev) => ({ ...prev, [id]: value }));
  };

  const handleEditClick = (id) => {
    setEditMode((prev) => ({ ...prev, [id]: true }));
    setEditedQuantities((prev) => ({ ...prev, [id]: quantities[id] }));
    setEditedPrices((prev) => ({ ...prev, [id]: prices[id] }));
  };

  const handleCancel = (id) => {
    setEditMode((prev) => ({ ...prev, [id]: false }));
    setEditedQuantities((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    setEditedPrices((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const handleSaveBook = async (id) => {
    const newQty = Math.max(0, parseInt(editedQuantities[id]) || 0);
    const newPrice = Math.max(0, parseFloat(editedPrices[id]) || 0);

    try {
      await setDoc(
        doc(db, "Products", id.toString()),
        {
          quantity: newQty,
          price: newPrice,
        },
        { merge: true }
      );

      setQuantities((prev) => ({ ...prev, [id]: newQty }));
      setPrices((prev) => ({ ...prev, [id]: newPrice }));
      setEditMode((prev) => ({ ...prev, [id]: false }));
    } catch (error) {
      console.error("Error updating quantity/price:", error);
    }
  };

  // --- Rental Management Handlers ---
  const handleConfirmReturn = async (rentalId) => {
    try {
      await runTransaction(db, async (transaction) => {
        const rentalRef = doc(db, "Reservations", rentalId);
        const rentalSnap = await transaction.get(rentalRef);

        if (!rentalSnap.exists()) throw "Rental does not exist!";
        const rentalData = rentalSnap.data();

        if (rentalData.status === "ReturnedConfirmed") throw "Already confirmed!";

        // Update Products stock
        for (const item of rentalData.items) {
          const productRef = doc(db, "Products", item.id.toString());
          const productSnap = await transaction.get(productRef);
          if (productSnap.exists()) {
            const currentQty = productSnap.data().quantity || 0;
            transaction.update(productRef, { quantity: currentQty + item.quantity });
          }
        }

        // Update Rental Status
        transaction.update(rentalRef, {
          status: "ReturnedConfirmed",
          returnedAt: new Date()
        });
      });

      // Update local state
      setRentals(prev => prev.map(r =>
        r.id === rentalId ? { ...r, status: "ReturnedConfirmed" } : r
      ));

      // Update local quantities state to reflect returned stock
      const rental = rentals.find(r => r.id === rentalId);
      if (rental) {
        const newQtyMap = { ...quantities };
        rental.items.forEach(item => {
          if (newQtyMap[item.id] !== undefined) {
            newQtyMap[item.id] += item.quantity;
          }
        });
        setQuantities(newQtyMap);
      }

      alert("Return confirmed and stock updated!");

    } catch (error) {
      console.error("Error confirming return:", error);
      alert("Failed to confirm return: " + error);
    }
  };


  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.id?.toString().includes(query) ||
      product.name?.toLowerCase().includes(query) ||
      product.series?.toLowerCase().includes(query) ||
      product.author?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="adminPage">
      <Header />

      <div className="adminPage-container">
        {!user && (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>Please sign in with your admin account</h2>
            <button onClick={handleLogin} className="adminPage-loginButton">
              Sign in with Google
            </button>
          </div>
        )}

        {user && !isAdmin && (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>Access Denied</h2>
            <p>This account does not have admin privileges.</p>
          </div>
        )}

        {user && isAdmin && (
          <>
            <div className="adminPage-header">
              <h1>Admin Dashboard</h1>
              <div className="admin-tabs">
                <button
                  className={`tab-btn ${activeTab === "books" ? "active" : ""}`}
                  onClick={() => setActiveTab("books")}
                >
                  Book Inventory
                </button>
                <button
                  className={`tab-btn ${activeTab === "rentals" ? "active" : ""}`}
                  onClick={() => setActiveTab("rentals")}
                >
                  Reservation Requests
                </button>
                <button
                  className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
                  onClick={() => setActiveTab("users")}
                >
                  Active Users
                </button>
              </div>
            </div>

            {activeTab === "books" && (
              <>
                <input
                  type="text"
                  className="adminPage-searchInput"
                  placeholder="Search by Title, Genre, or Author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ marginBottom: '20px' }}
                />
                <div className="table-scroll-container">
                  <table className="adminPage-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Genre</th>
                        <th>Author</th>
                        <th>Available Copies</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const id = product.id;
                        const isEditing = editMode[id];
                        const quantityValue = isEditing
                          ? editedQuantities[id]
                          : quantities[id];

                        return (
                          <tr key={id}>
                            <td>{id}</td>
                            <td>{product.name}</td>
                            <td>{product.series}</td>
                            <td>{product.author || product.brand}</td>
                            <td>
                              <input
                                type="number"
                                min="0"
                                value={quantityValue}
                                onChange={(e) =>
                                  handleQuantityChange(id, e.target.value)
                                }
                                className="adminPage-quantityInput"
                                disabled={!isEditing}
                              />
                            </td>
                            <td className="adminPage-actions">
                              {!isEditing ? (
                                <img
                                  src={EditIcon}
                                  alt="Edit"
                                  className="adminPage-actionBtn"
                                  onClick={() => handleEditClick(id)}
                                />
                              ) : (
                                <div style={{ display: "flex", gap: "5px" }}>
                                  <button
                                    onClick={() => handleSaveBook(id)}
                                    className="adminPage-saveBtn"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => handleCancel(id)}
                                    className="adminPage-cancelBtn"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === "rentals" && (
              <div className="table-scroll-container">
                <table className="adminPage-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>User</th>
                      <th>Books Reserved</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentals.map((rental) => (
                      <tr key={rental.id}>
                        <td>{rental.reservedAt?.toDate().toLocaleDateString()}</td>
                        <td>
                          {rental.userInfo.fullName}<br />
                          <small>{rental.userInfo.email}</small>
                        </td>
                        <td>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {rental.items.map((item, i) => (
                              <li key={i}>
                                {item.series} - {item.variant} (x{item.quantity})
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          <span className={`status-badge ${rental.status}`}>
                            {rental.status}
                          </span>
                        </td>
                        <td>
                          {rental.status === "ReturnedByUser" && (
                            <button
                              className="confirm-return-btn"
                              onClick={() => handleConfirmReturn(rental.id)}
                            >
                              Confirm Return
                            </button>
                          )}
                          {rental.status === "Reserved" && (
                            <span className="text-muted">Active</span>
                          )}
                          {rental.status === "ReturnedConfirmed" && (
                            <span className="text-success">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "users" && (
              <div className="table-scroll-container">
                <table className="adminPage-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Total Reservations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(new Set(rentals.map(r => r.userId))).map(userId => {
                      const userRentals = rentals.filter(r => r.userId === userId);
                      const userInfo = userRentals[0]?.userInfo || {};
                      return (
                        <tr key={userId}>
                          <td>{userId}</td>
                          <td>{userInfo.fullName || "N/A"}</td>
                          <td>{userInfo.email || "N/A"}</td>
                          <td>{userRentals.length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default AdminPage;
