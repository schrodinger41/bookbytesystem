import React, { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import "./homePage.css";

// Static imports for slideshow background
import bgImage1 from "../../images/bg_images/bg_image_1.png";
import bgImage9 from "../../images/bg_images/bg_image_9.jpg";
import bgImage2 from "../../images/bg_images/bg_image_2.jpg";

// Static imports for cards and preview images
import bgImage11 from "../../images/bg_images/bg_image_11.png";
import bgImage12 from "../../images/bg_images/bg_image_12.png";
import bgImage5 from "../../images/bg_images/bg_image_5.png";
import bgImage6 from "../../images/bg_images/bg_image_6.png";
import bgImage10 from "../../images/bg_images/bg_image_10.jpg";
import bgImage7 from "../../images/bg_images/bg_image_7.png";
import bgImage8 from "../../images/bg_images/bg_image_8.png";

import lycheePreview from "../../images/product_previews/lychee_bundle_preview.png";
import dadaPreview from "../../images/product_previews/dada_bundle_preview.png";
import macaronSecret from "../../images/product_previews/exciting_macaron_secret_preview.png";
import impressionnismeSecret from "../../images/product_previews/l'impressionnisme_secret_preview.png";

import deliveryIcon from "../../images/icon_images/delivery_icon.png";
import authenticIcon from "../../images/icon_images/authentic_icon.png";
import responseIcon from "../../images/icon_images/response_icon.png";
import packagingIcon from "../../images/icon_images/packaging_icon.png";

import labubuFace from "../../images/labubu_face.jpg";

const bgImages = [bgImage1, bgImage9, bgImage2];

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bgImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const productCardImages = {
    "Exciting Macaron": bgImage9,
    "Have A Seat": bgImage2,
    "Big Into Energy": bgImage11,
    "Coca-Cola Series": bgImage12,
    Zimomo: bgImage5,
    Mokoko: bgImage6,
    "Special Pendants": bgImage10,
    "L'impressionnisme": bgImage7,
    "Winter Symphony": bgImage8,
  };

  return (
    <div>
      <Header />
      <div className="home-content">
        <div
          className="slideshow-background"
          style={{ backgroundImage: `url(${bgImages[currentIndex]})` }}
        >
          <div className="slideshow-overlay"></div>
          <div className="slideshow-content">
            <h4>Welcome to</h4>
            <h1>Labulovetreasures</h1>
            <a href="/ProductCatalogue" className="shop-now-btn">
              Shop Now
            </a>
          </div>
          <div className="carousel-dots">
            {bgImages.map((_, index) => (
              <span
                key={index}
                className={`dot ${currentIndex === index ? "active" : ""}`}
              ></span>
            ))}
          </div>
        </div>

        {/* LABUBU PRODUCTS */}
        <div className="products-section">
          <h2 className="product-title">LABUBU PRODUCTS</h2>
          <p className="product-description">
            Labubu is a popular, mischievous-looking, elf-like toy character
            with high, pointed ears, jagged teeth, and a round, furry body,
            known for its playful yet slightly fierce expression. It's a
            character in the "The Monsters" series, created by artist Kasing
            Lung.
          </p>
          <div className="product-grid">
            {[
              "Exciting Macaron",
              "Have A Seat",
              "Big Into Energy",
              "Coca-Cola Series",
              "Zimomo",
              "Mokoko",
              "Special Pendants",
            ].map((title, index) => {
              const sizes = [
                "large",
                "medium",
                "small",
                "small",
                "small",
                "small",
                "medium",
              ];
              const borderColors = [
                "#B7CA5E",
                "#E7D7BA",
                "#B9BDFD",
                "#E4E5EB",
                "#D3DFDB",
                "#E0F2FA",
                "#B7CC87",
              ];
              return (
                <a
                  key={index}
                  href={`/ProductCatalogue?series=${encodeURIComponent(title)}`}
                  className={`product-card ${sizes[index]}`}
                  style={{
                    backgroundImage: `url(${productCardImages[title]})`,
                    border: `2px solid ${borderColors[index]}`,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div className="card-overlay">
                    <h3>{title}</h3>
                    <span className="view-all">View All</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* BUNDLE PREVIEWS */}
        <div className="product-preview-section">
          <h2 className="product-preview-title">BUNDLE PRICES</h2>
          <div className="product-preview-cards">
            <div className="product-preview-card">
              <img
                src={lycheePreview}
                alt="Bundle 1"
                className="product-preview-image"
              />
              <p className="product-preview-description">
                Lychee Berry + (Soymilk/Sesame Bean/Green Grape/Toffee/Seasalt
                Coconut)
              </p>
              <p className="product-preview-price">$105.00</p>
            </div>
            <div className="product-preview-card">
              <img
                src={dadaPreview}
                alt="Bundle 2"
                className="product-preview-image"
              />
              <p className="product-preview-description">
                Dada + (Baba/Ququ/Hehe/Zizi/Sisi)
              </p>
              <p className="product-preview-price">$90.00</p>
            </div>
          </div>
          <a
            href="/ProductCatalogue?category=Bundle%20Prices"
            className="view-all-btn"
          >
            View All
          </a>
        </div>

        {/* SKULLPANDA PRODUCTS */}
        <div className="products-section">
          <h2 className="product-title">SKULLPANDA PRODUCTS</h2>
          <p className="product-description">
            Skullpanda is a popular art toy series created by Chinese artist
            Xiong Mao and produced by Pop Mart. It features a mysterious,
            traveling symbiote character known for its skull-shaped helmet and
            dreamy appearance.
          </p>
          <div className="product-grid">
            {["L'impressionnisme", "Winter Symphony"].map((title, index) => (
              <a
                key={index}
                href={`/ProductCatalogue?series=${encodeURIComponent(title)}`}
                className="product-card large"
                style={{
                  backgroundImage: `url(${productCardImages[title]})`,
                  border: `2px solid ${["#B7CA5E", "#E7D7BA"][index]}`,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div className="card-overlay">
                  <h3>{title}</h3>
                  <span className="view-all">View All</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* SECRETS SECTION */}
        <div className="product-preview-section-two">
          <h2 className="product-preview-title">SECRETS</h2>
          <div className="product-preview-cards">
            <div className="product-preview-card">
              <img
                src={macaronSecret}
                alt="Secret 1"
                className="product-preview-image"
              />
              <p className="product-preview-description">
                EXISTING MACARON - Chestnut Cocoa
              </p>
              <p className="product-preview-price">$194.00</p>
            </div>
            <div className="product-preview-card">
              <img
                src={impressionnismeSecret}
                alt="Secret 2"
                className="product-preview-image"
              />
              <p className="product-preview-description">
                L'IMPRESSIONNISME - In The Garden
              </p>
              <p className="product-preview-price">$294.00</p>
            </div>
          </div>
          <a href="/ProductCatalogue?category=Secrets" className="view-all-btn">
            View All
          </a>
        </div>

        {/* SHOP BADGES */}
        <div className="shop-badges-section">
          <div className="badge-grid">
            <div className="badge-card">
              <img src={deliveryIcon} alt="Reliable Delivery" />
              <h4>Reliable Delivery</h4>
              <p>Orders arrive safely, securely, and on time.</p>
            </div>
            <div className="badge-card">
              <img src={authenticIcon} alt="Authentic Products" />
              <h4>Authentic Products</h4>
              <p>Guaranteed original and trusted items.</p>
            </div>
            <div className="badge-card">
              <img src={responseIcon} alt="Timely Response" />
              <h4>Timely Response</h4>
              <p>Quick and reliable customer support.</p>
            </div>
            <div className="badge-card">
              <img src={packagingIcon} alt="Secure Packaging" />
              <h4>Secure Packaging</h4>
              <p>Carefully packed to ensure item safety.</p>
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS */}
        <div className="customer-reviews-section">
          <h2 className="reviews-title">Customer Reviews</h2>
          <p className="reviews-subtitle">
            Discover what our customers think about our services
          </p>
          <div className="review-grid">
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <div className="review-row">
                <img
                  src={labubuFace}
                  alt="Michelle profile"
                  className="review-avatar"
                />
                <div className="review-content">
                  <h4 className="review-name">Michelle</h4>
                  <p className="review-text">Fantastic and kind seller!</p>
                </div>
              </div>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <div className="review-row">
                <img
                  src={labubuFace}
                  alt="Kyle profile"
                  className="review-avatar"
                />
                <div className="review-content">
                  <h4 className="review-name">Kyle</h4>
                  <p className="review-text">
                    Great seller don't hesitate to do business!!
                  </p>
                </div>
              </div>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <div className="review-row">
                <img
                  src={labubuFace}
                  alt="Jorge profile"
                  className="review-avatar"
                />
                <div className="review-content">
                  <h4 className="review-name">Jorge</h4>
                  <p className="review-text">
                    Very friendly and knowledgeable! Great product! Will buy
                    again from seller
                  </p>
                </div>
              </div>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <div className="review-row">
                <img
                  src={labubuFace}
                  alt="Becca profile"
                  className="review-avatar"
                />
                <div className="review-content">
                  <h4 className="review-name">Becca</h4>
                  <p className="review-text">
                    Super nice seller! Would buy from her again 😊
                  </p>
                </div>
              </div>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <div className="review-row">
                <img
                  src={labubuFace}
                  alt="Lufthansa profile"
                  className="review-avatar"
                />
                <div className="review-content">
                  <h4 className="review-name">Lufthansa</h4>
                  <p className="review-text">
                    Picked up the "Good Luck to You" Labubu in person. Item
                    looked just like the photos and was in great shape. Seller
                    was easy to talk to and the whole process was quick and
                    smooth. Appreciate it!
                  </p>
                </div>
              </div>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <div className="review-row">
                <img
                  src={labubuFace}
                  alt="Katie profile"
                  className="review-avatar"
                />
                <div className="review-content">
                  <h4 className="review-name">Katie</h4>
                  <p className="review-text">
                    Seller is legit! Quick at shipping and communicated the
                    whole process with me and even asked if I received to double
                    confirm the package came safely. Highly recommend!
                  </p>
                </div>
              </div>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <div className="review-row">
                <img
                  src={labubuFace}
                  alt="Cori profile"
                  className="review-avatar"
                />
                <div className="review-content">
                  <h4 className="review-name">Cori</h4>
                  <p className="review-text">
                    Great seller will definitely purchase from again.
                  </p>
                </div>
              </div>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <div className="review-row">
                <img
                  src={labubuFace}
                  alt="Yolanda profile"
                  className="review-avatar"
                />
                <div className="review-content">
                  <h4 className="review-name">Yolanda</h4>
                  <p className="review-text">
                    Authentic HAS Dada from Pop Mart! Seller was so transparent
                    and so easy to work with. Would definitely recommend others
                    to shop!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
