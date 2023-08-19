const express = require('express');
const router = express.Router();
const { Offers, Super_markets, Reactions, Products, Users } = require('../models');
const uniqueObjects = require('unique-objects');

//get all offers
router.get('/', async (req, res) => {
    try{
        const offers = await Offers.findAll();
        res.json(offers);
    }
    catch(error){
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: 'Error fetching offers' });
    }
});

// get all aupermarkets that have offers
router.get('/supermarkets', async (req, res) => {
    try{
        const offers = await Offers.findAll({
            include: [{
                model: Super_markets,
                as: "supermarket",
                attributes: ['id', 'name', 'latitude', 'longitude']
            }]
        });
        let offersWithSupermarkets = offers.map(offer => offer.supermarket);
        offersWithSupermarkets = uniqueObjects(offersWithSupermarkets, ['id']);

        // remove supermarkets that are close
        const { latitude, longitude } = req.query;
        const radius = 0.004;
        offersWithSupermarkets = offersWithSupermarkets.filter(supermarket => {
            return (supermarket.latitude > latitude + radius || supermarket.latitude < latitude - radius) ||
                (supermarket.longitude > longitude + radius || supermarket.longitude < longitude - radius);
        });

        res.json(offersWithSupermarkets);
    }
    catch(error){
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: 'Error fetching offers' });
    }
});

// get all supermarkets that do not have offers
router.get('/supermarkets/empty', async (req, res) => {
    try{
        const offers = await Offers.findAll({
            include: [{
                model: Super_markets,
                as: "supermarket",
                attributes: ['id', 'name', 'latitude', 'longitude']
            }]
        });
        const offersWithSupermarkets = uniqueObjects(offers.map(offer => offer.supermarket), ['id']);

        let supermarkets = await Super_markets.findAll();
        supermarkets = uniqueObjects(supermarkets, ['id']);
        let supermarketsWithoutOffers = supermarkets.filter(supermarket => {
            return !offersWithSupermarkets.some(offerSupermarket => offerSupermarket.id === supermarket.id);
        });
        // remove supermarkets that are close
        const { latitude, longitude } = req.query;
        const radius = 0.004;
        supermarketsWithoutOffers = supermarketsWithoutOffers.filter(supermarket => {
            return (supermarket.latitude > latitude + radius || supermarket.latitude < latitude - radius) ||
                (supermarket.longitude > longitude + radius || supermarket.longitude < longitude - radius);
        });

        res.json(supermarketsWithoutOffers);
    }
    catch(error){
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: 'Error fetching offers' });
    }
});


//get all offers for a product
router.get('/:product_id', async (req, res) => {
    try{
        const offers = await Offers.findAll({ where: { product_id: req.params.product_id } });
        res.json(offers);
    }
    catch(error){
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: 'Error fetching offers' });
    }
});

//get all offers for a supermarket
router.get('/supermarket/:super_market_id', async (req, res) => {
    try{
        const offers = await Offers.findAll({ 
            where: { supermarket_id: req.params.super_market_id },
            include: [
                { model: Reactions, as: "reactions" },
                { model: Products, as: "product"},
                { model: Users, as: "user"}
            ],
            order: [['createdAt', 'DESC']]
        });
        const offersWithLikesAndDislikes = offers.map((offer) => {
            const likes = offer.reactions.filter((reaction) => reaction.reaction === "like").length;
            const dislikes = offer.reactions.filter((reaction) => reaction.reaction === "dislike").length;
            const username = offer.user.username;
            const { reactions, product_id, user, ...offerWithoutReactions } = offer.toJSON();
            return { ...offerWithoutReactions, username, likes, dislikes };
        });
        res.json(offersWithLikesAndDislikes);
    }
    catch(error){
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: 'Error fetching offers' });
    }
});

//post a new offer
router.post('/', async (req, res) => {
    try{
        // if req.body is an array, use bulkCreate
        if(Array.isArray(req.body)){
            const offers = await Offers.bulkCreate(req.body);
            res.json(offers);
        }
        // else use create
        else{
            const offer = await Offers.create(req.body);
            res.json(offer);
        }
    }
    catch(error){
        console.error(`Error creating offer: ${error}`);
        res.status(500).json({ error: 'Error creating offer' });
    }
});

module.exports = router;