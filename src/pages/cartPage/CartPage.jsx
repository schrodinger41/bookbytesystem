import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import DeleteIcon from "../../images/icon_images/delete.png";
import OrderSummaryModal from "../../components/modal/OrderSummaryModal";
import EmptyCartImage from "../../images/icon_images/empty_cart.png";
import Products from "../../components/product/Product";
import "./cartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [estimatedTotal, setEstimatedTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [stockMap, setStockMap] = useState({});
  const [stockLoading, setStockLoading] = useState(true);

  // Load cart from local storage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const validatedCart = storedCart.map((item) => ({
      ...item,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
    }));
    setCartItems(validatedCart);
  }, []);

  // Fetch stock info from Firebase
  useEffect(() => {
    const fetchStock = async () => {
      setStockLoading(true);
      const stockObj = {};
      for (const item of cartItems) {
        const docRef = doc(db, "Products", item.id.toString());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          stockObj[item.id] = docSnap.data().quantity;
        }
      }
      setStockMap(stockObj);
      setStockLoading(false);
    };

    if (cartItems.length > 0) {
      fetchStock();
    }
  }, [cartItems]);

  // Update estimated total
  useEffect(() => {
    const total = 0;
    setEstimatedTotal(total);
  }, [cartItems]);

  // Update quantity of a cart item
  const updateCartItem = (id, variant, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id && item.variant === variant) {
        const stockLimit = stockMap[item.id] ?? Infinity;
        const newQty = item.quantity + delta;
        return {
          ...item,
          quantity: Math.max(1, Math.min(newQty, stockLimit)),
        };
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  // Remove item from cart
  const removeCartItem = (id, variant) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.id === id && item.variant === variant)
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const navigate = useNavigate();

  return (
    <div className="cartPage">
      <Header />

      <div className="cartPage-container">
        <div className="cartPage-headerRow">
          <h1 className="cartPage-title">Your Reservation List</h1>
          <a href="/ProductCatalogue" className="cartPage-continueLink">
            Continue Browsing
          </a>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart-wrapper">
            <div className="empty-cart-content">
              <img
                src={EmptyCartImage}
                alt="Empty Cart"
                className="empty-cart-image"
              />
              <p className="empty-cart-text">Your reservation list is empty</p>
            </div>
          </div>
        ) : (
          <>
            <div className="cartPage-topRow">
              <span>Book</span>
              <span>Quantity</span>

            </div>

            <div className="cartPage-itemList">
              {cartItems.map((item) => (
                <div
                  className="cartPage-itemRow"
                  key={`${item.id}-${item.variant}`}
                >
                  <div className="cartPage-productInfo">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cartPage-productImage"
                    />
                    <div className="cartPage-productText">
                      <p
                        className="cartPage-productName cartPage-link"
                        onClick={() => {
                          const matching = Products.find(
                            (p) =>
                              p.series === item.series &&
                              p.name === item.variant
                          );
                          if (matching) {
                            navigate(`/product/${matching.id}`);
                          }
                        }}
                      >
                        {item.series}
                      </p>
                      <p
                        className="cartPage-productVariant cartPage-link"
                        onClick={() => {
                          const matching = Products.find(
                            (p) =>
                              p.series === item.series &&
                              p.name === item.variant
                          );
                          if (matching) {
                            navigate(`/product/${matching.id}`);
                          }
                        }}
                      >
                        {item.variant}
                      </p>

                    </div>
                  </div>

                  <div className="cartPage-quantityControl">
                    <div className="cartPage-quantityBox">
                      <button
                        className="cartPage-qtyBtn"
                        onClick={() =>
                          updateCartItem(item.id, item.variant, -1)
                        }
                      >
                        −
                      </button>
                      <span className="cartPage-quantity">{item.quantity}</span>
                      <button
                        className="cartPage-qtyBtn"
                        onClick={() => updateCartItem(item.id, item.variant, 1)}
                        disabled={
                          stockLoading ||
                          (stockMap[item.id] !== undefined &&
                            item.quantity >= stockMap[item.id])
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cartPage-removeBtn"
                      onClick={() => removeCartItem(item.id, item.variant)}
                    >
                      <img src={DeleteIcon} alt="Remove" />
                    </button>
                  </div>


                </div>
              ))}
            </div>

            <div className="cartPage-bottom">
              <div className="cartPage-summary">

              </div>

              <button
                className="cartPage-summaryButton"
                onClick={() => setShowModal(true)}
              >
                Proceed to Reserve
              </button>

              {showModal && (
                <OrderSummaryModal
                  cartItems={cartItems}
                  total={estimatedTotal}
                  onClose={() => setShowModal(false)}
                />
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
