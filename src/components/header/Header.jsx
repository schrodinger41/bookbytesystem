import React, { useState } from "react";
import logoImg from "../../images/icon.png";
import "./header.css";
import { FaCartShopping } from "react-icons/fa6";

import { HiOutlineMenuAlt3 } from "react-icons/hi"; // Added this if you forgot to import the icon

function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const handleNavbar = () => setToggleMenu(!toggleMenu);

  return (
    <nav className="navbar" id="navbar">
      <div className="container navbar-content flex">
        <div className="brand-and-toggler flex flex-sb">
          <a href="/" className="navbar-brand flex">
            <img className="logo-img" src={logoImg} alt="site logo" />
          </a>
          <button
            type="button"
            className="navbar-toggler-btn"
            onClick={handleNavbar}
          >
            <HiOutlineMenuAlt3
              size={35}
              style={{ color: `${toggleMenu ? "#F4999E" : "#F4999E"}` }}
            />
          </button>
        </div>

        <div
          className={
            toggleMenu
              ? "navbar-collapse show-navbar-collapse"
              : "navbar-collapse"
          }
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="/" className="nav-link" onClick={handleNavbar}>
                HOME
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/ProductCatalogue"
                className="nav-link"
                onClick={handleNavbar}
              >
                PRODUCTS
              </a>
            </li>
            <li className="nav-item">
              <a href="/ContactUs" className="nav-link" onClick={handleNavbar}>
                CONTACT US
              </a>
            </li>
            <li className="nav-item">
              <a href="/Cart" className="nav-link" onClick={handleNavbar}>
                <FaCartShopping />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
