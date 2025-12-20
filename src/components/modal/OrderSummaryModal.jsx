import React, { useRef } from "react";
// import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import "./orderSummaryModal.css";

const OrderSummaryModal = ({ cartItems, total, onClose }) => {
  const navigate = useNavigate();
  const formRef = useRef();

  // Calculate $2 off for every 2 single boxes
  const singleBoxDiscount = (() => {
    let singleBoxQty = 0;
    cartItems.forEach((item) => {
      if (item.series.toLowerCase().includes("single box")) {
        singleBoxQty += item.quantity;
      }
    });
    return Math.floor(singleBoxQty / 2) * 2; // $2 off per 2 boxes
  })();

  const finalTotal = total - singleBoxDiscount;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const customer_name = `${formData.get("firstName")} ${formData.get(
      "lastName"
    )}`;
    const customer_email = formData.get("email");
    const invoice_id = `INV-${Date.now()}`;
    const contact_number = formData.get("contact");
    const address = formData.get("address");
    const address2 = formData.get("address2");
    const postal = formData.get("postal");
    const city = formData.get("city");
    const payment = formData.get("mode-of-payment");
    const full_address = `${address}, ${address2}, ${city}, ${postal}`;

    const product_rows = cartItems
      .map(
        (item) => `
        <tr>
          <td>${item.quantity}</td>
          <td>${item.series} - ${item.variant}</td>
          <td>$${Number(item.price).toFixed(2)}</td>
          <td>$${(item.quantity * item.price).toFixed(2)}</td>
        </tr>`
      )
      .join("");

    const templateParams = {
      invoice_id,
      customer_name,
      customer_email,
      contact_number,
      payment,
      full_address,
      product_rows,
      subtotal: `$${total.toFixed(2)}`,
      total: `$${finalTotal.toFixed(2)}`,
    };

    try {
      // await emailjs.send(
      //   "service_p2844i9",
      //   "template_n84rydj",
      //   templateParams,
      //   "PZNj6YlIY3YN199g_"
      // );
      localStorage.removeItem("cart");
      navigate("/ThankYou");
    } catch (err) {
      console.error("Failed to send email:", err);
    }
  };

  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Order Summary</h2>
        <div className="modal-body">
          {/* LEFT: Customer Details */}
          <div className="modal-left">
            <h3>Customer Details</h3>
            <form ref={formRef} onSubmit={handleSubmit} className="order-form">
              <div className="input-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name (optional)"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
              />
              <input type="text" name="address" placeholder="Address" />
              <input type="text" name="contact" placeholder="Contact number" />
              <input
                type="text"
                name="address2"
                placeholder="Apartment, suite, etc. (optional)"
              />
              <div className="input-row">
                <input type="text" name="postal" placeholder="Postal Code" />
                <input type="text" name="city" placeholder="City" />
              </div>
              <select
                name="mode-of-payment"
                required
                className="payment-select"
              >
                <option value="" disabled selected hidden>
                  Mode of Payment
                </option>
                <option value="Zelle">Zelle</option>
                <option value="PayPal">PayPal</option>
                <option value="Venmo">Venmo</option>
              </select>
            </form>
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
                <p className="summary-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {singleBoxDiscount > 0 && (
                <div className="summary-row">
                  <span>Single Box Discount:</span>
                  <span>-${singleBoxDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <h3>Total:</h3>
                <h3>${finalTotal.toFixed(2)}</h3>
              </div>
            </div>

            <button className="submit-btn" onClick={handleExternalSubmit}>
              Submit Order
            </button>

            <p className="disclaimer">
              Please review your customer details and order summary carefully.
              Click ‘Submit’ to notify us of your order. The payment transaction
              will be processed via email, and a tracking number will be
              provided once your order has been shipped.
            </p>
          </div>
        </div>

        <button className="modal-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
