import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Products from "../../components/product/Product";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ProductCard from "../../components/product/ProductCard";

import bannerImage from "../../images/bg_images/bg_image_4.png";
import loadingGif from "../../images/loading.gif";
import emptyIcon from "../../images/icon_images/empty_icon.jpg";

import "./allProductsPage.css";

const getFilteredProducts = (products) => {
  return products;
};

const getPriceRange = (product) => {
  return product.price;
};

const AllProductsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [filteredBySeries, setFilteredBySeries] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const seriesParam = queryParams.get("series");
  const categoryParam = queryParams.get("category");

  useEffect(() => {
    if (seriesParam) {
      setSelectedCategory("All Products");
      setFilteredBySeries(seriesParam.toLowerCase());
    } else if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
      setFilteredBySeries(null);
    } else {
      setSelectedCategory("All Products");
      setFilteredBySeries(null);
    }
  }, [seriesParam, categoryParam]);

  useEffect(() => {
    // Simulate loading or just set data directly
    // Since it's local data, we could just set it, but keeping async pattern if you want loading state
    setAllProducts(Products);
    setIsLoading(false);
  }, []);

  const isSeriesOutOfStock = (product) => {
    return false; // Assuming all books are in stock as quantity logic is removed
  };

  const baseFilteredProducts = getFilteredProducts(allProducts);

  const filterByCategory = (products) => {
    if (selectedCategory === "All Products") {
      return products;
    }
    return products.filter((p) => p.type === selectedCategory);
  };

  const filteredProducts = filterByCategory(baseFilteredProducts).filter((p) =>
    filteredBySeries ? p.series?.toLowerCase().includes(filteredBySeries) : true
  );

  const categories = [
    "All Products",
    "Fiction",
    "Non-Fiction",
    "History",
    "Self-Help",
    "Business",
    "Education",
    "Fantasy",
  ];

  return (
    <div>
      <Header />
      <div className="allproducts-content">
        <div
          className="categories-toggle"
          onClick={() => setShowCategories(!showCategories)}
        >
          {showCategories ? "Hide Categories ▲" : "Show Categories ▼"}
        </div>

        <div
          className={`allproducts-categories-animated-wrapper ${showCategories ? "expanded" : ""
            }`}
        >
          <div className="allproducts-categories-bar">
            <ul className="allproducts-categories-list">
              {categories.map((category) => (
                <li
                  key={category}
                  className={`allproducts-category ${selectedCategory === category ? "active" : ""
                    }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setFilteredBySeries(null);
                    setShowCategories(false);
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="allproducts-container">
          <h1 className="allproducts-title">
            {filteredBySeries
              ? decodeURIComponent(seriesParam)
              : selectedCategory}
          </h1>

          {isLoading ? (
            <div className="loading-container">
              <img src={loadingGif} alt="Loading..." className="loading-gif" />
              <p className="loading-text">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <img src={emptyIcon} alt="Nothing here" className="empty-icon" />
              <p className="empty-text">Nothing to see here for now</p>
            </div>
          ) : (
            <div className="allproducts-grid">
              {[...filteredProducts]
                .map((product) => {
                  const displayPrice = getPriceRange(product, allProducts);
                  const outOfStock = isSeriesOutOfStock(product);

                  return {
                    product,
                    displayPrice,
                    outOfStock,
                  };
                })
                .sort((a, b) => {
                  if (a.outOfStock && !b.outOfStock) return 1;
                  if (!a.outOfStock && b.outOfStock) return -1;
                  return 0;
                })
                .map(({ product, displayPrice, outOfStock }) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    price={displayPrice}
                    outOfStock={outOfStock}
                  />
                ))}
            </div>
          )}
        </div>

        <div className="allproducts-image-banner">
          <img src={bannerImage} alt="Promo Banner" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllProductsPage;
