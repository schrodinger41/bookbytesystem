import React, { useState } from "react";
import logoImg from "../../images/icon.png";
import "./header.css";
import { FaBook } from "react-icons/fa6";

import { HiOutlineMenuAlt3 } from "react-icons/hi"; // Added this if you forgot to import the icon

import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const handleNavbar = () => setToggleMenu(!toggleMenu);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
              style={{ color: `${toggleMenu ? "white" : "white"}` }}
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
            {!isAdmin ? (
              <>
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
                    BOOKS
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/Cart" className="nav-link" onClick={handleNavbar}>
                    RESERVATION LIST
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/MyRentals" className="nav-link" onClick={handleNavbar}>
                    MY RESERVATIONS
                  </a>
                </li>
              </>
            ) : null}
            {user && (
              <li className="nav-item">
                <button
                  onClick={() => { handleNavbar(); handleLogout(); }}
                  className="nav-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit' }}
                >
                  LOGOUT
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
