import { useParams } from "react-router-dom";
import { sanitize } from "dompurify";
import { useEffect, useState } from "react";
import SupermarketService from "../services/supermarket.service";
import "../styles/SupermarketOffers.css";
import "../styles/Offers.css";


const Offers = ({ supermarket_id, link }) => {

    const clean_link = sanitize(link);
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
            <div dangerouslySetInnerHTML={{ __html: clean_link }} />
            <div className="offer-container">
                {Array.isArray(offers) && offers.length > 0 ? (
                    offers.map((offer) => (
                        <div key={offer.id} className={`offer-card-map ${offer.stock ? '' : 'out-of-stock'}`}>
                            <h5>
                                <a className="offer-link text-black" href={`/product/${offer.product.id}`}>
                                    {offer.product.name}
                                </a>
                            </h5>
                            <div className="offer-details-map">
                                <p className="price">
                                    <span> Price: </span>
                                    <span className="original-price-map">{offer.product.price}€</span>
                                    <span className="discount-price-map"> | {offer.price}€</span>
                                </p>
                                <div className="stock-and-updated">
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
                                {/* Replace "Likes" with thumbs-up icon */}
                                <span className="likes-icon">
                                    <i className="fas fa-thumbs-up"></i>
                                </span>
                                {offer.likes}
                                <span className="separator"> | </span>
                                {/* Replace "Dislikes" with thumbs-down icon */}
                                <span className="dislikes-icon">
                                    <i className="fas fa-thumbs-down"></i>
                                </span>
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

export default Offers;