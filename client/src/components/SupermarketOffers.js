import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SupermarketService from "../services/supermarket.service";
import UserService from "../services/user.service";
import "../styles/SupermarketOffers.css";


const SupermarketOffers = () => {
    const { supermarket_id } = useParams();
    const supermarket = SupermarketService.getStoredSupermarketById(supermarket_id);
    const userId = localStorage.getItem("user");
    const [offers, setOffers] = useState([]);

    const likeClickHandler = async (offerId) => {
        if (!userId) {
            return;
        }
        UserService.likeOffer(offerId);
        setOffers(offers.map(offer => {
            if (offer.id === offerId) {
                if (offer.userReaction === "dislike") {
                    offer.dislikes--;
                }
                if (offer.userReaction === "like") {
                    offer.userReaction = "";
                    offer.likes--;
                }
                else {
                    offer.userReaction = "like";
                    offer.likes++;
                }
            }
            return offer;
        }
        ));
    };

    const dislikeClickHandler = async (offerId) => {
        if (!userId) {
            return;
        }
        UserService.dislikeOffer(offerId);
        setOffers(offers.map(offer => {
            if (offer.id === offerId) {
                if (offer.userReaction === "like") {
                    offer.likes--;
                }
                if (offer.userReaction === "dislike") {
                    offer.userReaction = "";
                    offer.dislikes--;
                }
                else {
                    offer.userReaction = "dislike";
                    offer.dislikes++;
                }
            }
            return offer;
        }
        ));
    };

    const stockClickHandler = async (offerId) => {
        if (!userId) {
            return;
        }
        UserService.stockOffer(offerId);
        const message = document.createElement('div');
        message.textContent = 'Stock status changed!';
        message.style.backgroundColor = 'green';
        message.style.color = 'white';
        message.style.padding = '10px';
        message.style.position = 'fixed';
        message.style.top = `${Math.max(66 - window.scrollY, 10)}px`;
        message.style.right = '10px';
        message.style.borderRadius = '5px';
        document.body.appendChild(message);
        setTimeout(() => {
            document.body.removeChild(message);
        }, 1000);
        window.addEventListener('scroll', () => {
            message.style.top = `${Math.max(80 - window.scrollY, 0)}px`;
        });

    };

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
            console.log(sortedOffers);
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
                        <div key={offer.id} className={`offer-card`}>
                            <a href={`/product/${offer.product.id}`} className={`${offer.stock ? '' : 'out-of-stock-gray'}`}>
                                <img
                                    src={offer.product.image}
                                    alt={offer.product.name}
                                    className="offer-image"
                                />
                            </a>
                            <h2 className={`${offer.stock ? '' : 'out-of-stock-gray'}`}>
                                <a className="offer-link text-black" href={`/product/${offer.product.id}`}>
                                    {offer.product.name}
                                </a>
                            </h2>
                            <div className="offer-details">
                                <p className={`price ${offer.stock ? '' : 'out-of-stock-gray'}`}>
                                    <span> Price: </span>
                                    <span className="original-price">{offer.product.price}€</span>
                                    <span className="discount-price"> | {offer.price}€</span>
                                </p>
                                <div className="stock-and-updated">
                                    <button
                                        className={`stock-button ${offer.stock ? 'in-stock' : 'out-of-stock'}`}
                                        onClick={() => stockClickHandler(offer.id)}
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
                                    <p className={`updatedAt ${offer.stock ? '' : 'out-of-stock-gray'}`}>
                                        <span className="updatedAt-icon">
                                            <i className="far fa-clock"></i>
                                        </span>
                                        {new Date(offer.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="username">
                                By: <a href={`/profile/${offer.username}`}>{offer.username}</a>
                            </div>
                            <div className={`likes-dislikes ${offer.stock ? '' : 'out-of-stock-gray'}`}>
                                {/* Replace "Likes" with a button */}
                                <button
                                    type="button"
                                    className={`likes-icon ${(offer.userReaction === "like") ? 'liked' : ''}`}
                                    style={{ border: 'none', backgroundColor: 'transparent' }}
                                    onClick={() => likeClickHandler(offer.id)}
                                >
                                    <i className="fas fa-thumbs-up"></i>
                                </button>
                                {offer.likes}
                                <span className="separator"> | </span>
                                {/* Replace "Dislikes" with a button */}
                                <button
                                    type="button"
                                    className={`dislikes-icon ${(offer.userReaction === "dislike") ? 'disliked' : ''}`}
                                    style={{ border: 'none', backgroundColor: 'transparent' }}
                                    onClick={() => dislikeClickHandler(offer.id)}
                                >
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