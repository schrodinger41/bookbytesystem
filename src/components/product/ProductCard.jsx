import React from "react";
import { Link } from "react-router-dom";
import fallbackImage from "../../images/labubu_face.jpg";
import "./productCard.css";

const ProductCard = ({
  id = "",
  image = fallbackImage,
  imageBack = null,
  type = "",
  series = "",
  price = "$0.00",
  badge = "",
  productName = "Untitled Product",
  outOfStock = false,
}) => {
  return (
    <Link
      to={outOfStock ? "#" : `/Product/${id}`}
      className={`productcard-wrapper ${outOfStock ? "disabled" : ""}`}
      onClick={(e) => {
        if (outOfStock) e.preventDefault();
      }}
    >
      <div className="productcard-image-container">
        <img
          src={image || fallbackImage}
          alt={type || "product image"}
          className="productcard-image front"
        />
        {imageBack && (
          <img
            src={imageBack}
            alt={`${type} back`}
            className="productcard-image back"
          />
        )}
        {badge && (
          <span className={`productcard-badge ${badge.toLowerCase()}`}>
            {badge}
          </span>
        )}
        {outOfStock && (
          <>
            <div className="productcard-overlay" />
            <span className="productcard-outofstock-label">Out of Stock</span>
          </>
        )}
      </div>
      <div className="productcard-details">
        <p className="productcard-title">
          {productName || "Unnamed"}
        </p>
        <p className="productcard-price">{price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
