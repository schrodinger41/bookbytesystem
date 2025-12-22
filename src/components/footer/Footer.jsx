import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-column footer-business-info">
          <h3 className="footer-heading">BUSINESS INFORMATION</h3>
          <p>
            <strong>Online Shop Name:</strong> BookByte
          </p>
          <p>
            <strong>Business Location:</strong> 123 Story Street, Bookville, BK 45678
          </p>
          <p>
            <strong>Business Hours:</strong> 9:00AM - 9:00PM (Mon - Fri),
            <br />
            USA (GMT-5) Eastern Standard Time (EST)
          </p>
          <p>
            <strong>Contact Number:</strong> +1 (555) 123-4567
          </p>
          <p>
            <strong>Email:</strong> support@bookbyte.com
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
              Books
            </a>
          </p>

          <p>
            <a href="/Faq" className="footer-link">
              Frequently Asked Questions (FAQ)
            </a>
          </p>
        </div>


      </div>
    </footer>
  );
}

export default Footer;
