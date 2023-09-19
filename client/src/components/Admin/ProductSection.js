import React from "react";
import "../../styles/AdminProducts.css";
import UploadProducts from "./UploadProducts";

const AdminProductManagement = () => {

  return (
    <div className="container my-4">
      <div className="card">
        <div className="card-header bg-light">
          <h2 className="text-center">Upload Files</h2>
        </div>
        <div className="card-body">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4 text-center mb-3">
              <h3>Categories</h3>
              <UploadProducts typeOfData="categories" />
            </div>
            <div className="col-md-6 col-lg-4 text-center mb-3">
              <h3>Subcategories</h3>
              <UploadProducts typeOfData="subcategories" />
            </div>
            <div className="col-md-6 col-lg-4 text-center mb-3">
              <h3>Products</h3>
              <UploadProducts typeOfData="products" />
            </div>
            <div className="col-md-6 col-lg-4 text-center mb-3">
              <h3>Prices</h3>
              <UploadProducts typeOfData="price_history" />
            </div>
            <div className="col-md-6 col-lg-4 text-center mb-3">
              <h3>Supermarkets</h3>
              <UploadProducts typeOfData="supermarkets" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default AdminProductManagement;