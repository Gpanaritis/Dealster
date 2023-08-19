import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SupermarketService from "../services/supermarket.service";
import "../styles/SupermarketOffers.css";


const SupermarketOffers = () => {
    const { supermarket_id } = useParams();
    const supermarket = SupermarketService.getStoredSupermarketById(supermarket_id);
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        const fetchOffers = async () => {
            const response = await SupermarketService.getOffers(supermarket_id);
            setOffers(response);
        };
        fetchOffers();
    }, [supermarket_id]);

    // Inside the SupermarketOffers component
    return (
        <div className="supermarket-offers">
            <h1 className="supermarket-name">{supermarket.name}</h1>
            <p className="supermarket-address">{supermarket.address}</p>
            <div className="offer-container">
                {Array.isArray(offers) && offers.length > 0 ? (
                    offers.map((offer) => (
                        <div key={offer.id} className={`offer-card ${offer.stock ? '' : 'out-of-stock'}`}>
                            <a href="https://example.com">
                                <img
                                    src={offer.product.image}
                                    alt={offer.product.name}
                                    className="offer-image"
                                />
                            </a>
                            <h2>
                                <a className="offer-link text-black" href={`/product/${offer.product.id}`}>
                                    {offer.product.name}
                                </a>
                            </h2>
                            <div className="offer-details">
                                <p className="price">
                                    <span> Price: </span>
                                    <span className="original-price">{offer.product.price}€</span>
                                    <span className="discount-price"> | {offer.price}€</span>
                                </p>
                                <p className="stock-status">
                                    {offer.stock ? (
                                        <span className="in-stock">
                                            <i className="fas fa-check-circle"></i> In Stock
                                        </span>
                                    ) : (
                                        <span className="out-of-stock">
                                            <i className="fas fa-times-circle"></i> Out of Stock
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="username">
                                <p>By: <a href={`/user/${offer.username}`}>{offer.username}</a></p>
                            </div>
                            <div className="likes-dislikes">
                                <p>Likes: {offer.likes} | Dislikes: {offer.dislikes}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No offers found.</p>
                )}
            </div>
        </div>
    );


};

export default SupermarketOffers;