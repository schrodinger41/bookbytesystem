// src/pages/product/ProductPage.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import Products from "../../components/product/Product";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ProductCard from "../../components/product/ProductCard";
import AddToCartModal from "../../components/modal/AddToCartModal";
import StockLimitModal from "../../components/modal/StockLimitModal";
import imageMap from "../../components/product/ImageMap";
import loadingGif from "../../images/loading.gif";
import "./productsPage.css";
import "../allProductsPage/allProductsPage.css";

const getPriceRange = (variants) => {
  if (!variants || variants.length === 0) return "$0.00";
  // For books, just return the price of the items (assuming items are similar or just showing range of genre)
  // Simplified for this use case to just show price
  return variants[0]?.price || "$0.00";
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
    const fetchProductData = async () => {
      setLoading(true);

      try {
        // Fetch Firestore data
        const querySnapshot = await getDocs(collection(db, "Products"));
        const firestoreMap = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const numericId = parseInt(doc.id);
          firestoreMap[numericId] = {
            price: data.price,
            quantity: data.quantity
          };
        });

        // Find product in static array
        const selected = Products.find((p) => p.id === parseInt(productId));

        if (selected) {
          // Merge static products with Firestore data
          const mergedProducts = Products.map(p => ({
            ...p,
            price: firestoreMap[p.id]?.price || p.price,
            quantity: firestoreMap[p.id]?.quantity || p.quantity
          }));

          setAllVariants(mergedProducts);

          // Create stock map with Firestore data
          const stockMap = {};
          mergedProducts.forEach(p => {
            const priceNum = typeof p.price === 'string'
              ? parseFloat(p.price.replace('$', ''))
              : p.price;
            stockMap[p.id] = { price: priceNum, stock: p.quantity };
          });
          setGlobalStockMap(stockMap);

          // Get Firestore data for selected product
          const firestoreProduct = firestoreMap[selected.id];
          const mergedSelected = {
            ...selected,
            price: firestoreProduct?.price || selected.price,
            quantity: firestoreProduct?.quantity || selected.quantity
          };

          setSelectedVariant(mergedSelected);
          setSelectedImage(mergedSelected.image);

          const priceNum = typeof mergedSelected.price === 'string'
            ? parseFloat(mergedSelected.price.replace('$', ''))
            : mergedSelected.price;
          setLiveData({ price: priceNum, stock: mergedSelected.quantity });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);

        // Fallback to static data if Firestore fails
        const selected = Products.find((p) => p.id === parseInt(productId));
        if (selected) {
          setAllVariants(Products);
          const stockMap = {};
          Products.forEach(p => {
            const priceNum = parseFloat(p.price.replace('$', ''));
            stockMap[p.id] = { price: priceNum, stock: p.quantity };
          });
          setGlobalStockMap(stockMap);
          setSelectedVariant(selected);
          setSelectedImage(selected.image);
          const priceNum = parseFloat(selected.price.replace('$', ''));
          setLiveData({ price: priceNum, stock: selected.quantity });
        }
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // For books, we don't really want "variants" buttons (showing all other books in genre).
  // So let's just make this empty or filtered to self.
  const variants = [];

  const isWholeSet = false;

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
          price: v.price, // getPriceRange(groupVariants, globalStockMap),
        });
      }
    });

    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }

    return filtered.slice(0, 5);
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
            {selectedVariant.productName}
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
                    className={`variant-button ${selectedVariant.id === v.id ? "selected" : ""
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
            <p className="product-synopsis" style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
              <strong>Synopsis:</strong> <br />
              {selectedVariant.synopsis}
            </p>

            {["Author", "Pages", "Language", "Type"].map((field) => (
              <p key={field}>
                <strong>{field}:</strong>{" "}
                {
                  selectedVariant[
                  field.toLowerCase()
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
