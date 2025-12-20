import React, { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { auth, provider, db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import EditIcon from "../../images/icon_images/edit.png";
import imageMap from "../../components/product/ImageMap";
import "./adminPage.css";

function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [prices, setPrices] = useState({});
  const [editMode, setEditMode] = useState({});
  const [editedQuantities, setEditedQuantities] = useState({});
  const [editedPrices, setEditedPrices] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  // test

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
          image: imageMap[data.imageKey] || "", // resolve image 🔁
        });

        qtyData[id] = data.quantity ?? 0;
        priceData[id] = data.price ?? 0;
      });

      fetchedProducts.sort((a, b) => parseInt(a.id) - parseInt(b.id));

      setProducts(fetchedProducts);
      setQuantities(qtyData);
      setPrices(priceData);
    };

    fetchProducts();
  }, []);

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

  const handleSave = async (id) => {
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

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(query) ||
      product.productType?.toLowerCase().includes(query) ||
      product.series?.toLowerCase().includes(query)
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
              <h1>Product Management</h1>
              <input
                type="text"
                className="adminPage-searchInput"
                placeholder="Search by name, type, or series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <table className="adminPage-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Type</th>
                  <th>Series</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
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
                  const priceValue = isEditing ? editedPrices[id] : prices[id];

                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{product.name}</td>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="adminPage-productImg"
                        />
                      </td>
                      <td>{product.productType}</td>
                      <td>{product.series}</td>
                      <td>
                        {product.brand}, {product.productSize},{" "}
                        {product.material}, {product.lining}
                      </td>
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
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span>$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={priceValue}
                            onChange={(e) =>
                              handlePriceChange(id, e.target.value)
                            }
                            className="adminPage-priceInput"
                            disabled={!isEditing}
                            style={{ marginLeft: "4px", width: "60px" }}
                          />
                        </div>
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
                              onClick={() => handleSave(id)}
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
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default AdminPage;
