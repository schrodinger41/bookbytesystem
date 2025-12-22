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
        <h2>Reservation Summary</h2>
        <div className="modal-body">
          {/* LEFT: Customer Details */}
          <div className="modal-left">
            <h3>Customer Details</h3>
            <div className="customer-info-display">
              <p><strong>Name:</strong> {userData?.fullName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p className="info-note" style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
                * Reservation will be linked to this account.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Cart Summary + Button + Disclaimer */}
        <div className="modal-right">
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <img src={item.image} alt={item.name} />
              <div>
                <p className="summary-name">{item.series}</p>
                <p className="summary-variant">{item.variant}</p>
              </div>
              <p className="summary-qty">Qty: {item.quantity}</p>
            </div>
          ))}

          <div className="summary-totals" style={{ marginTop: '20px' }}>
            <div className="summary-row">
              <h3>Total Books:</h3>
              <h3>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</h3>
            </div>
          </div>

          <button className="submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Confirm Reservation"}
          </button>

          <p className="disclaimer">
            Please review your details. By clicking 'Confirm Reservation', you agree to reserve the selected books.
            You will need to pick them up from the library within the designated timeframe.
          </p>
        </div>
      </div>

      <button className="modal-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default OrderSummaryModal;
