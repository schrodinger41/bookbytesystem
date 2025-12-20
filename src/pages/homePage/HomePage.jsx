import React from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import "./homePage.css";

// Static imports for slideshow background
import bgImage1 from "../../images/bg_images/bg_image_1.png";
import fictionImg from "../../images/product_images/FICTION - 1984.jpg";
import nonFictionImg from "../../images/product_images/Non-Fiction - Sapiens A Brief History of Humankind.jpg";
import historyImg from "../../images/product_images/History - The History of the Philippines.jpg";
import selfHelpImg from "../../images/product_images/Self-Help - Atomic Habits.jpg";
import businessImg from "../../images/product_images/Business - Rich Dad Poor Dad.jpg";
import eduImg from "../../images/product_images/Education - Oxford English Dictionary.jpg";
import fantasyImg from "../../images/product_images/Fantasy - Harry Potter and the Sorcerers Stone.jpg";

import deliveryIcon from "../../images/icon_images/delivery_icon.png";
import authenticIcon from "../../images/icon_images/authentic_icon.png";
import responseIcon from "../../images/icon_images/response_icon.png";
import packagingIcon from "../../images/icon_images/packaging_icon.png";

import labubuFace from "../../images/labubu_face.jpg";

const HomePage = () => {
  const productCardImages = {
    "Fiction": fictionImg,
    "Non-Fiction": nonFictionImg,
    "History": historyImg,
    "Self-Help": selfHelpImg,
    "Business": businessImg,
    "Education": eduImg,
    "Fantasy": fantasyImg,
  };

  return (
    <div>
      <Header />
      <div className="home-content">
        <div
          className="slideshow-background"
          style={{ backgroundImage: `linear-gradient(rgba(205, 10, 114, 0.7), rgba(37, 7, 146, 0.8)), url(${bgImage1})` }}
        >
          <div className="slideshow-overlay"></div>
          <div className="slideshow-content">
            <h4>Welcome to</h4>
            <h1>BookByte</h1>
            <h4 className='desc'>Welcome to BookByte, your premier destination for discovering and exploring your next favorite book!</h4>
            <a href="/ProductCatalogue" className="shop-now-btn">
              Shop Now
            </a>
          </div>
        </div>

        <div className="products-section">
          <h2 className="product-title">BOOK GENRES</h2>
          <p className="product-description">
            Dive into a world of knowledge, imagination, and adventure with our
            carefully curated collection of book genres. Whether you love the
            gripping stories of Fiction, the insightful lessons of Non-Fiction,
            or the epic journeys of Fantasy & Science Fiction, our library has
            something for everyone. Explore the rich history of civilizations,
            gain practical wisdom through Self-Help & Personal Development, learn
            the secrets of business and economics, or discover essential insights
            from Education & Reference materials. Each genre opens doors to new
            ideas, unforgettable characters, and valuable life lessons, making
            reading an exciting and enriching experience for readers of all ages.
          </p>
          <div className="product-grid">
            {[
              "Fiction",
              "Non-Fiction",
              "History",
              "Self-Help",
              "Business",
              "Education",
              "Fantasy",
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
