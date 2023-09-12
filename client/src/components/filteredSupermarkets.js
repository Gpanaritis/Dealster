import React from "react";
import { useParams } from "react-router-dom";
import SupermarketService from "../services/supermarket.service";
import Map from "./Map";

const FilteredSupermarkets = () => {
    const { supermarket_name } = useParams();
    const supermarkets = SupermarketService.getStoredSupermarkets().filter(supermarket => supermarket.name.toLowerCase() === supermarket_name.toLowerCase());

    return (
        <div className="filtered-supermarkets">
            <div className="map-container">
                <Map selectedSupermarkets={supermarkets.map(supermarket => supermarket.id)} activeFilter={supermarket_name} />
            </div>
        </div>
    );
}

export default FilteredSupermarkets;
