import React from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";

import "./thankYouPage.css";

const ThankYouPage = () => {
  return (
    <div className="thankYouPage">
      <Header />

      <div className="thankYouPage-hero">

        <div className="thankYouPage-messageBox">
          <h2>Your order request has been sent!</h2>
          <p>
            Kindly check your email for seller’s message within 24 hours. <br />
            Alternatively, contact them via facebook/email.
          </p>

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
