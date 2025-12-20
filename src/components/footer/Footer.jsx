import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-column footer-business-info">
          <h3 className="footer-heading">BUSINESS INFORMATION</h3>
          <p>
            <strong>Online Shop Name:</strong> Labulovetreasures
          </p>
          <p>
            <strong>Business Location:</strong> Arlington, VA 22203
          </p>
          <p>
            <strong>Business Hours:</strong> 9:00AM - 9:00PM (Mon - Fri),
            <br />
            USA (GMT-4) Eastern Standard Time (EST)
          </p>
          <p>
            <strong>Contact Number:</strong> 925-727-3630
          </p>
          <p>
            <strong>Email:</strong> labulovetreasures@gmail.com
          </p>
        </div>

        <div className="footer-column footer-useful-links">
          <h3 className="footer-heading">USEFUL LINKS</h3>
          <p>
            <a href="/" className="footer-link">
              Home Page
            </a>
          </p>
          <p>
            <a href="/ProductCatalogue" className="footer-link">
              Products
            </a>
          </p>
          <p>
            <a href="/ContactUs" className="footer-link">
              Contact Us
            </a>
          </p>
          <p>
            <a href="/Faq" className="footer-link">
              Frequently Asked Questions (FAQ)
            </a>
          </p>
        </div>

        <div className="footer-column footer-socials">
          <h3 className="footer-heading">OUR SOCIALS</h3>
          <p>
            <a
              href="https://www.facebook.com/marketplace/profile/100003786026066/"
              className="footer-link"
            >
              Facebook
            </a>
          </p>
          <p>
            <a href="#" className="footer-link">
              Instagram
            </a>
          </p>
          <p>
            <a href="#" className="footer-link">
              Tiktok
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
