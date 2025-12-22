import React from "react";
import "./stockLimitModal.css";

const StockLimitModal = ({ stock, existingQty, onClose, onViewCart }) => {
  return (
    <div className="stock-modal-overlay">
      <div className="stock-modal-content">
        <div className="stock-modal-header">
          <p className="stock-modal-title">Stock Limit Reached</p>
        </div>

        <div className="stock-modal-body">
          <p>
            Only <strong>{stock}</strong> of this variant is in stock.
            <br />
            You already have <strong>{existingQty}</strong> in your rental bag.
          </p>
        </div>
        <button className="view-cart-button" onClick={onViewCart}>
          View Rental Bag
        </button>
        <button className="ok-button" onClick={onClose}>
          Okay
        </button>
      </div>
    </div>
  );
};

export default StockLimitModal;
