import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ProductCard from "../../components/product/ProductCard";

import imageMap from "../../components/product/ImageMap";

import bannerImage from "../../images/bg_images/bg_image_4.png";
import loadingGif from "../../images/loading.gif";
import emptyIcon from "../../images/icon_images/empty_icon.jpg";

import "./allProductsPage.css";

const getFilteredProducts = (products) => {
  const seenTypeSeries = new Set();
  const filtered = [];

  products.forEach((product) => {
    const nameLower = (product.name || "").toLowerCase();

    const isWholeSet = nameLower.includes("whole set");

    if (isWholeSet) {
      filtered.push(product);
    } else {
      const key = `${product.type}|${product.series}`;
      if (!seenTypeSeries.has(key)) {
        seenTypeSeries.add(key);
        filtered.push(product);
      }
    }
  });

  return filtered;
};

const getPriceRange = (product, allProducts) => {
  const related = allProducts.filter(
    (p) =>
      p.series === product.series &&
      p.type === product.type &&
      (p.name?.toLowerCase().includes("whole set") ||
        !p.name?.toLowerCase().includes("whole set"))
  );

  const prices = related
    .map((p) => parseFloat(p.price))
    .filter((price) => !isNaN(price));

  if (prices.length === 0) return "$0.00";

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return min === max
    ? `$${min.toFixed(2)}`
    : `$${min.toFixed(2)} - $${max.toFixed(2)}`;
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
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Products"));
        const products = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          products.push({
            id: doc.id,
            ...data,
            image: imageMap[data.imageKey],
            imageBack: imageMap[data.imageBackKey],
          });
        });

        products.sort((a, b) => parseInt(a.id) - parseInt(b.id));

        setAllProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const isSeriesOutOfStock = (product) => {
    const related = allProducts.filter(
      (p) =>
        p.series === product.series &&
        p.type === product.type &&
        (p.name?.toLowerCase().includes("whole set") ||
          !p.name?.toLowerCase().includes("whole set"))
    );

    return related.every((p) => p.quantity === 0 || p.quantity === undefined);
  };

  const baseFilteredProducts = getFilteredProducts(allProducts);

  const filterByCategory = (products) => {
    switch (selectedCategory) {
      case "Labubu":
        return products.filter(
          (p) => p.productType?.toLowerCase() === "labubu"
        );
      case "Skullpanda":
        return products.filter(
          (p) => p.productType?.toLowerCase() === "skullpanda"
        );
      case "Secrets":
        return products.filter((p) => p.type?.toLowerCase() === "secret");
      case "Bundle Prices":
        return products.filter((p) =>
          p.series?.toLowerCase().includes("bundle")
        );
      case "Others":
        return products.filter(
          (p) =>
            p.productType?.toLowerCase() !== "labubu" &&
            p.productType?.toLowerCase() !== "skullpanda" &&
            p.type?.toLowerCase() !== "secret"
        );
      default:
        return products;
    }
  };

  const filteredProducts = filterByCategory(baseFilteredProducts).filter((p) =>
    filteredBySeries ? p.series?.toLowerCase().includes(filteredBySeries) : true
  );

  const categories = [
    "All Products",
    "Labubu",
    "Skullpanda",
    "Bundle Prices",
    "Secrets",
    "Others",
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
          className={`allproducts-categories-animated-wrapper ${
            showCategories ? "expanded" : ""
          }`}
        >
          <div className="allproducts-categories-bar">
            <ul className="allproducts-categories-list">
              {categories.map((category) => (
                <li
                  key={category}
                  className={`allproducts-category ${
                    selectedCategory === category ? "active" : ""
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
