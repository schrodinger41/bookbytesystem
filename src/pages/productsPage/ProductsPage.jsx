// src/pages/product/ProductPage.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ProductCard from "../../components/product/ProductCard";
import AddToCartModal from "../../components/modal/AddToCartModal";
import StockLimitModal from "../../components/modal/StockLimitModal";
import imageMap from "../../components/product/ImageMap";
import loadingGif from "../../images/loading.gif";
import "./productsPage.css";
import "../allProductsPage/allProductsPage.css";

const getPriceRange = (variants, globalStockMap) => {
  const prices = variants
    .map((v) => {
      const data = globalStockMap[v.id];
      return data?.price ?? null;
    })
    .filter((p) => p !== null && !isNaN(p));

  if (prices.length === 0) return "$0.00";
  const [min, max] = [Math.min(...prices), Math.max(...prices)];
  return min === max
    ? `$${min.toFixed(2)}`
    : `$${min.toFixed(2)} - $${max.toFixed(2)}`;
};

const ProductPage = () => {
  const { id } = useParams();
  const productId = id;
  const navigate = useNavigate();
  const galleryRef = useRef();

  const [allVariants, setAllVariants] = useState([]);
  const [globalStockMap, setGlobalStockMap] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [liveData, setLiveData] = useState({ price: null, stock: null });
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockModalData, setStockModalData] = useState({
    stock: 0,
    existingQty: 0,
  });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "Products"));
      const variants = [];
      const stockMap = {};

      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        const variant = {
          id: docSnap.id,
          name: d.name,
          series: d.series,
          type: d.type,
          productName: d.productName,
          brand: d.brand,
          productSize: d.productSize,
          material: d.material,
          lining: d.lining,
          image: imageMap[d.imageKey] || "",
          imageBack: imageMap[d.imageBackKey] || null,
        };
        variants.push(variant);
        stockMap[variant.id] = { price: d.price, stock: d.quantity };
      });

      setAllVariants(variants);

      setGlobalStockMap(stockMap);

      const selected = variants.find((v) => v.id === productId);
      if (selected) {
        setSelectedVariant(selected);
        setSelectedImage(selected.image);
        setLiveData(stockMap[selected.id]);
      }

      setLoading(false);
    };

    fetchAll();
  }, [productId]);

  const variants = allVariants.filter(
    (v) =>
      v.series === selectedVariant?.series && v.type === selectedVariant?.type
  );

  const isWholeSet = selectedVariant?.name.toLowerCase().includes("whole set");

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const nxt = Math.max(1, prev + delta);
      if (liveData.stock !== null) return Math.min(nxt, liveData.stock);
      return nxt;
    });
  };

  const scrollGallery = (dir) => {
    galleryRef.current.scrollTop += dir === "up" ? -80 : 80;
  };

  const recommendations = useMemo(() => {
    if (!allVariants.length || !selectedVariant) return [];

    const seenTypeSeries = new Set();
    const filtered = [];

    allVariants.forEach((v) => {
      const key = `${v.series}|${v.type}`;
      const isSameGroup =
        v.series === selectedVariant.series && v.type === selectedVariant.type;

      if (isSameGroup || seenTypeSeries.has(key)) return;

      const groupVariants = allVariants.filter(
        (x) => x.series === v.series && x.type === v.type
      );

      const isGroupOutOfStock = groupVariants.every((item) => {
        const stock = globalStockMap[item.id]?.stock;
        return stock === 0 || stock === undefined;
      });

      if (!isGroupOutOfStock) {
        seenTypeSeries.add(key);
        filtered.push({
          ...v,
          price: getPriceRange(groupVariants, globalStockMap),
        });
      }
    });

    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }

    return filtered.slice(0, 4);
  }, [allVariants, selectedVariant, globalStockMap]);

  if (loading || !selectedVariant) {
    return (
      <div className="loading-container-product-page">
        <img src={loadingGif} alt="Loading..." className="loading-gif" />
        <p className="loading-text">Loading products...</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="productpage-container">
        <div className="productpage-gallery">
          <button className="gallery-arrow" onClick={() => scrollGallery("up")}>
            ▲
          </button>

          <div className="productpage-thumbnails" ref={galleryRef}>
            {Array.from(
              new Set([selectedVariant.image, ...variants.map((v) => v.image)])
            ).map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(img)}
                className={
                  selectedImage === img
                    ? "thumbnail-img active"
                    : "thumbnail-img"
                }
                alt={`thumb ${i}`}
              />
            ))}
          </div>

          <button
            className="gallery-arrow"
            onClick={() => scrollGallery("down")}
          >
            ▼
          </button>
        </div>

        <div className="productpage-main-image-container">
          {selectedImage ? (
            <img
              className="main-image"
              src={selectedImage}
              alt={selectedVariant.name}
            />
          ) : (
            <div className="image-placeholder">Loading image...</div>
          )}
        </div>

        <div className="productpage-details">
          <h2>
            {selectedVariant.productName} – {selectedVariant.series}
            <br />
            <span className="variant-name">{selectedVariant.name}</span>
          </h2>
          <p className="productpage-price">
            {`$${liveData.price?.toFixed(2)}`}
          </p>
          <p className="productpage-stock">{`In Stock: ${liveData.stock}`}</p>

          {!isWholeSet && (
            <div className="variant-buttons">
              {variants.map((v) => {
                const isDisabled = !globalStockMap[v.id]?.stock;
                return (
                  <button
                    key={v.id}
                    disabled={isDisabled}
                    className={`variant-button ${
                      selectedVariant.id === v.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedVariant(v);
                      setSelectedImage(v.image);
                      setLiveData(globalStockMap[v.id]);
                      setQuantity(1);
                    }}
                  >
                    {v.name}
                  </button>
                );
              })}
            </div>
          )}

          <div className="quantity-controls">
            <div className="quantity-box">
              <button onClick={() => handleQuantityChange(-1)}>−</button>
              <span>{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= liveData.stock}
              >
                +
              </button>
            </div>
          </div>

          <button
            className="add-to-cart-button"
            disabled={!liveData.stock}
            onClick={() => {
              const cart = JSON.parse(localStorage.getItem("cart") || "[]");
              const idx = cart.findIndex(
                (item) => item.id === selectedVariant.id
              );
              const existingQty = idx >= 0 ? cart[idx].quantity : 0;
              const newQty = existingQty + quantity;

              if (newQty > liveData.stock) {
                setStockModalData({ stock: liveData.stock, existingQty });
                setShowStockModal(true);
                return;
              }

              if (idx >= 0) cart[idx].quantity = newQty;
              else
                cart.push({
                  id: selectedVariant.id,
                  name: selectedVariant.name,
                  series: selectedVariant.series,
                  variant: selectedVariant.name,
                  price: liveData.price,
                  quantity,
                  image: selectedImage,
                });
              localStorage.setItem("cart", JSON.stringify(cart));
              setShowAddModal(true);
            }}
          >
            Add to Cart
          </button>

          <div className="productpage-info">
            {["Brand", "Product Size", "Material", "Lining"].map((field) => (
              <p key={field}>
                <strong>{field}:</strong>{" "}
                {
                  selectedVariant[
                    field.replace(" ", "").charAt(0).toLowerCase() +
                      field.replace(" ", "").slice(1)
                  ]
                }
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="productpage-recommendations">
        <h3 className="recommend-title">You may also like</h3>
        {recommendations.length > 0 ? (
          <div className="allproducts-grid">
            {recommendations.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <ProductCard {...item} outOfStock={false} />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", padding: "1rem" }}>
            No recommendations available.
          </p>
        )}
      </div>

      {showAddModal && (
        <AddToCartModal
          image={selectedImage}
          series={selectedVariant.series}
          onClose={() => setShowAddModal(false)}
          onViewCart={() => navigate("/cart")}
        />
      )}
      {showStockModal && (
        <StockLimitModal
          stock={stockModalData.stock}
          existingQty={stockModalData.existingQty}
          onClose={() => setShowStockModal(false)}
          onViewCart={() => navigate("/cart")}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProductPage;
