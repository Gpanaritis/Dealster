import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import SupermarketService from "../services/supermarket.service";
import Map from "./Map";

const ProductsMap = () => {

        const {category_name} = useParams();
        const [supermarkets, setSupermarkets] = useState([]);

        useEffect(() => {
                const fetchSupermarkets = async () => {
                    try {
                        const response = await SupermarketService.getSupermarketsByCategoryName(category_name);
                        setSupermarkets(response);
                        return response; // Return the response after it's set in state
                    } catch (error) {
                        console.error(`Error fetching supermarkets: ${error}`);
                    }
                };
        
                fetchSupermarkets();
            }, [category_name]);

        // Render the component after the supermarkets state is set
        if (supermarkets.length === 0) {
            return <div>Loading...</div>;
        }

        return (
                <div className="products-map">
                        <Map selectedSupermarkets ={supermarkets.map(supermarket => supermarket.id)} activeFilter={category_name} />
                </div>
        );
}

export default ProductsMap;