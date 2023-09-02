import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductService from "../services/product.service";

import "../styles/Products.css";

const Product = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState("");
  const [supermarketWithPrices, setSupermarketWithPrices] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductService.getProduct(product_id);
        setProduct(response);
      } catch (error) {
        const errorMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setProduct({ error: errorMessage });
      }
    };

    fetchProduct();

  }, [product_id]);

  useEffect(() => {
    if (product) {
      const supermarketWithPrices = product.supermarkets.map((supermarket) => {
        const offerPrices = supermarket.offers.map((offer) => Number(offer.price));
        const lowestPrice = Math.min(...offerPrices, product.price);
        const isOfferPrice = offerPrices.includes(lowestPrice);

        return {
          id: supermarket.id,
          name: supermarket.name,
          address: supermarket.address,
          price: lowestPrice,
          isOfferPrice: isOfferPrice
        };
      });
      // sort by price asc
      supermarketWithPrices.sort((a, b) => a.price - b.price);
      setSupermarketWithPrices(supermarketWithPrices);
    }
  }, [product]);

  return (
    <div className="container">
      <header className="jumbotron">
        <div className="product-header">
          <img src={product.image} alt={product.name} className="product-image" />
          <div className="product-details">
            <div>
              <p><h3>{product.name}</h3></p>
              <p>Categories: {product.subcategories && product.subcategories.map((subcategory) => subcategory.category.name).join(', ')}</p>
              <p>Subcategories: {product.subcategories && product.subcategories.map((subcategory) => subcategory.name).join(', ')}</p>
            </div>
          </div>
        </div>
      </header>
      <div className="supermarket-offers">
        <div className="offer-container">
          {supermarketWithPrices &&
            supermarketWithPrices.map((supermarket) => (
              <div key={supermarket.id} className="product-offer-card">
                <div className="offer-details">
                  <h2 className="supermarket-name"><a className="offer-link text-black" href={`/supermarketOffers/${supermarket.id}`}>{supermarket.name}</a></h2>
                  <p className="supermarket-address">{supermarket.address}</p>
                  <p className="discount-price">
                    {supermarket.isOfferPrice ? (
                      <span className="bigger-price-green">
                        {supermarket.price.toFixed(2)}
                      </span>
                    ) : (
                      <span className="bigger-price">{supermarket.price.toFixed(2)}</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
