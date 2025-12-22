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
              Reserve Now
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
              // New Bento Layout Pattern
              const sizes = [
                "medium", // Fiction (2 cols)
                "medium", // Non-Fiction (2 cols)
                "small",  // History (1 col)
                "small",  // Self-Help (1 col)
                "large",  // Business (2 cols, 2 rows)
                "small",  // Education (1 col)
                "small",  // Fantasy (1 col)
              ];

              const borderColors = [
                "#8d27ae",
                "#0D32AB",
                "#6a1b9a",
                "#4a148c",
                "#1565C0",
                "#9c27b0",
                "#00BCD4",
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






      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
