import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp, runTransaction, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import "./orderSummaryModal.css";

const OrderSummaryModal = ({ cartItems, onClose }) => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const rentalRequest = {
      fullName: userData?.fullName || "User",
      email: user?.email || "",
      // contact: userData?.contact || "",  // Removed as requested
    };

    try {
      // 1. Run transaction to check stock and decrement
      await runTransaction(db, async (transaction) => {
        const reads = [];
        for (const item of cartItems) {
          const productRef = doc(db, "Products", item.id.toString());
          reads.push({ ref: productRef, requestQty: item.quantity, name: item.name });
        }

        // Read all docs
        const snaps = await Promise.all(reads.map(r => transaction.get(r.ref)));

        // Check stock
        snaps.forEach((snap, index) => {
          if (!snap.exists()) {
            throw new Error(`Book "${reads[index].name}" does not exist in database.`);
          }
          const data = snap.data();
          if (data.quantity < reads[index].requestQty) {
            throw new Error(`Insufficient stock for "${reads[index].name}". Available: ${data.quantity}`);
          }
        });

        // Update stock
        snaps.forEach((snap, index) => {
          const newQty = snap.data().quantity - reads[index].requestQty;
          transaction.update(reads[index].ref, { quantity: newQty });
        });
      });

      // 2. Create Reservation Record
      await addDoc(collection(db, "Reservations"), {
        userId: user.uid,
        userInfo: rentalRequest,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          series: item.series,
          variant: item.variant,
          quantity: item.quantity,
          image: item.image
        })),
        status: "Reserved", // Initial status
        reservedAt: serverTimestamp(),
      });

      localStorage.removeItem("cart");
      navigate("/ThankYou");
    } catch (err) {
      console.error("Reservation failed:", err);
      alert("Reservation failed: " + err.message);
      setIsSubmitting(false);
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Reservation Summary</h2>

        <div className="modal-body">
          {/* Customer Details Section */}
          <div className="customer-section">
            <h3>Customer Details</h3>
            <div className="customer-info-display">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{userData?.fullName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Books Section */}
          <div className="books-section">
            <h3>Books to Reserve ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} total)</h3>
            <div className="books-list">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <p className="summary-name">{item.series}</p>
                    <p className="summary-variant">{item.variant}</p>
                  </div>
                  <div className="item-qty">
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="modal-footer">
          <p className="disclaimer">
            By confirming, you agree to reserve the selected books and pick them up from the library within the designated timeframe.
          </p>
          <div className="button-group">
            
            <button className="submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm Reservation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
