import React from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import labubuImg from "../../images/thank_you_labubu.png";
import "./thankYouPage.css";

const ThankYouPage = () => {
  return (
    <div className="thankYouPage">
      <Header />

      <div className="thankYouPage-hero">
        <img
          src={labubuImg}
          alt="Thank You Labubu"
          className="thankYouPage-labubu"
        />

        <div className="thankYouPage-messageBox">
          <h2>Your order request has been sent!</h2>
          <p>
            Kindly check your email for seller’s message within 24 hours. <br />
            Alternatively, contact them via facebook/email.
          </p>

          <div className="thankYouPage-icons">
            <a
              href="https://www.facebook.com/marketplace/profile/100003786026066/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="mailto:labulovetreasures@gmail.com">
              <i className="fas fa-envelope"></i>
            </a>
          </div>

          <button
            className="thankYouPage-button"
            onClick={() => (window.location.href = "/ProductCatalogue")}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ThankYouPage;
