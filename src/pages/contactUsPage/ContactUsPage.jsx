import React from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import "./contactUsPage.css";

const ContactUsPage = () => {
  return (
    <div className="contactuspage-container">
      <Header />
      <div className="contactuspage-hero">
        <div className="contactuspage-overlay">
          <h1 className="contactuspage-title">Contact Us</h1>
          <p className="contactuspage-subtitle">
            We’re here to help you with any inquiries!
          </p>
          <div className="contactuspage-box">
            <div className="contactuspage-form-wrapper">
              <form className="contactuspage-form">
                <div className="contactuspage-form-group">
                  <label>First name</label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="contactuspage-input"
                  />
                </div>
                <div className="contactuspage-form-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="contactuspage-input"
                  />
                </div>
                <div className="contactuspage-form-group">
                  <label>Message</label>
                  <textarea
                    placeholder="Type your message"
                    className="contactuspage-textarea"
                  ></textarea>
                </div>
                <div className="contactuspage-button-container">
                  <button type="submit" className="contactuspage-button">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUsPage;
