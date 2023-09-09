import React from "react";
import { useParams } from "react-router-dom";
import SupermarketService from "../services/supermarket.service";
import Map from "./Map";

const ProductsMap = () => {

    const {supermarket_name} = useParams();
    const supermarkets = SupermarketService.getStoredSupermarkets().filter(supermarket => supermarket.name.toLowerCase() === supermarket_name.toLowerCase());
    console.log(supermarkets.map(supermarket => supermarket.id));

    return (
        <div className="products-map">
            <Map selectedSupermarkets ={supermarkets.map(supermarket => supermarket.id)} />
        </div>
    );
}

export default ProductsMap;