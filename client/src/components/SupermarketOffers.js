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

            // Sort the offers: true (in stock) first, false (out of stock) next
            const sortedOffers = response.sort((a, b) => {
                if (a.stock === b.stock) {
                    return 0; // Keep the same order for offers with the same stock status
                }
                return a.stock ? -1 : 1; // Put true (in stock) before false (out of stock)
            });

            setOffers(sortedOffers);
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
                            <a href={`/product/${offer.product.id}`}>
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
                                <div className="stock-and-updated">
                                    <button
                                        className={`stock-button ${offer.stock ? 'in-stock' : 'out-of-stock'}`}
                                        onClick={() => console.log('Button clicked')}
                                    >
                                        {offer.stock ? (
                                            <span>
                                                <i className="fas fa-check-circle"></i> In Stock
                                            </span>
                                        ) : (
                                            <span>
                                                <i className="fas fa-times-circle"></i> Out of Stock
                                            </span>
                                        )}
                                    </button>

                                    {/* Display updatedAt in a friendly format without the year */}
                                    <p className="updatedAt">
                                        <span className="updatedAt-icon">
                                            <i className="far fa-clock"></i>
                                        </span>
                                        {new Date(offer.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="username">
                                By: <a href={`/user/${offer.username}`}>{offer.username}</a>
                            </div>
                            <div className="likes-dislikes">
                                {/* Replace "Likes" with a button */}
                                <button type="button" className="likes-icon" style={{ border: 'none', backgroundColor: 'transparent' }}>
                                    <i className="fas fa-thumbs-up"></i>
                                </button>
                                {offer.likes}
                                <span className="separator"> | </span>
                                {/* Replace "Dislikes" with a button */}
                                <button type="button" className="dislikes-icon" style={{ border: 'none', backgroundColor: 'transparent' }}>
                                    <i className="fas fa-thumbs-down"></i>
                                </button>
                                {offer.dislikes}
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