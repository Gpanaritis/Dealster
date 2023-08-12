import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SupermarketService from "../services/supermarket.service";

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ marginBottom: '1rem' }}>{supermarket.name}</h1>
            {Array.isArray(offers) && offers.length > 0 ? (
                <table style={{ margin: 'auto'}}>
                    <thead style={{ textAlign: 'center' }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>Description</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem' }}>Likes</th>
                            <th style={{ padding: '1rem' }}>Dislikes</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: 'center' }}>
                        {offers.map((offer) => (
                            <tr key={offer.id}>
                                <td style={{ padding: '1rem' }}>{offer.product.name}</td>
                                <td style={{ padding: '1rem' }}>{offer.price}€</td>
                                <td style={{ padding: '1rem' }}>{offer.likes}</td>
                                <td style={{ padding: '1rem' }}>{offer.dislikes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No offers found.</p>
            )}
        </div>
    );
};

export default SupermarketOffers;