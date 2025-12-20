import React from "react";
import "./addToCartModal.css";

const AddToCartModal = ({ image, series, onClose, onViewCart }) => {
  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal-content">
        <div className="cart-modal-header">
          <p className="cart-modal-title">Item added to your cart!</p>
          <button className="cart-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cart-modal-body">
          <img src={image} alt={series} className="cart-modal-image" />
          <p className="cart-modal-series">{series}</p>
        </div>

        <button className="view-cart-button" onClick={onViewCart}>
          View Cart
        </button>

        <button className="ok-button" onClick={onClose}>
          Okay
        </button>
      </div>
    </div>
  );
};

export default AddToCartModal;
