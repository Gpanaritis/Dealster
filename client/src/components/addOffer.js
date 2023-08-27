import { useParams } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import SupermarketService from "../services/supermarket.service";
import AuthService from "../services/auth.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";
import "../styles/AddOffer.css";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

// ... (previous imports and code)

const AddOffer = () => {
  const { supermarket_id } = useParams();

  const form = useRef();
  const checkBtn = useRef();


  const [supermarket, setSupermarket] = useState("");
  const [products, setProduct] = useState("");
  const [categories, setCategories] = useState("");
  const [subcategories, setSubcategories] = useState("");
  const [user, setUser] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [productId, setProductId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supermarket = await SupermarketService.getStoredSupermarketById(supermarket_id);
        const categories = await SupermarketService.getCategories(supermarket_id);
        const user = AuthService.getCurrentUser();
        setCategories(categories);
        setUser(user);
        setSupermarket(supermarket);
      }
      catch (error) {
        console.error(`Error fetching products for supermarket: ${error}`);
      }
    };
    fetchData();
  }, [supermarket_id]);


  const onChangeOfferPrice = (e) => {
    const offerPrice = e.target.value;
    setOfferPrice(offerPrice);
  };

  const onChangeCategoryId = (e) => {
    const categoryId = e.target.value;
    const subcategories = categories.find((category) => category.id == categoryId).subcategories;
    setCategoryId(categoryId);
    setSubcategories(subcategories);
  };

  const onChangeSubcategoryId = (e) => {
    const subcategoryId = e.target.value;
    const products = subcategories.find((subcategory) => subcategory.id == subcategoryId).products;
    setSubcategoryId(subcategoryId);
    setProduct(products);
  };

  const onChangeProductId = (e) => {
    const productId = e.target.value;
    setProductId(productId);
  };

  const handleAddOffer = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      if (!user) {
        setMessage("You must be logged in to add an offer.");
        setSuccessful(false);
        return;
      }

      SupermarketService.postOffer({
        price: offerPrice,
        stock: true,
        product_id: productId,
        supermarket_id: supermarket_id
      }).then(
        (response) => {
          setMessage(response.data);
          setSuccessful(true);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <div className="card card-container">
      <h1>{supermarket.name}</h1>
      <Form onSubmit={handleAddOffer} ref={form}>

      <div className="form-group">
          <label htmlFor="category">Select Category</label>
          <Select
            className="form-control"
            name="category"
            value={categoryId}
            onChange={onChangeCategoryId}
            validations={[required]}
          >
            {
              <>
                <option value="">Select a Category</option>
                {categories && categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </>
            }
          </Select>
        </div>

      <div className="form-group">
          <label htmlFor="subcategory">Select Subcategory</label>
          <Select
            className="form-control"
            name="subcategory"
            value={subcategoryId}
            onChange={onChangeSubcategoryId}
            validations={[required]}
            disabled={!categoryId}
          >
            {categoryId ? (
              <>
                <option value="">Select a subcategory</option>
                {subcategories && subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </>
            ) : (
              <option value="">Select a category first</option>
            )}
          </Select>
        </div>

        <div className="form-group">
          <label htmlFor="product">Select Product</label>
          <Select
            className="form-control"
            name="product"
            value={productId}
            onChange={onChangeProductId}
            validations={[required]}
            disabled={!subcategoryId}
          >
            {subcategoryId ? (
              <>
                <option value="">Select a product</option>
                {products && products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - €{product.price}
                  </option>
                ))}
              </>
            ) : (
              <option value="">Select a subcategory first</option>
            )}
          </Select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Offer Price</label>
          <Input
            type="text"
            className="form-control"
            name="price"
            value={offerPrice}
            onChange={onChangeOfferPrice}
            validations={[required]}
          />
        </div>

        <div className="form-group">
          <button className="btn btn-primary btn-block">Add Offer</button>
        </div>

        {(message || successful) && (
          <div className="form-group text-center">
            <div
              className={
                successful ? "alert alert-success" : "alert alert-danger"
              }
              role="alert"
            >
              {successful ? "Success" : message}
            </div>
          </div>
        )}
        <CheckButton style={{ display: "none" }} ref={checkBtn} />
      </Form>
    </div>
  );
};

export default AddOffer;
