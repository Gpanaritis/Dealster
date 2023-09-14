const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Offers, Super_markets, Reactions, Products, Users } = require('../models');
const uniqueObjects = require('unique-objects');
const { verifyToken, isAdmin, getUserIdFromToken } = require('../middleware/authJwt');

const findMeanPriceYesterday = (offerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const offers = await Offers.findAll({ where: { product_id: offerId, stock: true } });
            const product = await Products.findByPk(offerId);

            // Convert the offer prices to numeric values
            const numericPrices = offers.map((offer) => parseFloat(offer.price));

            // Sum of numeric prices
            const sum = numericPrices.reduce((acc, price) => acc + price, 0);

            // Calculate mean price
            const meanPrice = offers.length > 0 ? (sum + parseFloat(product.price)) / (offers.length + 1) : parseFloat(product.price);

            console.log(meanPrice);
            console.log(product.price);

            resolve(meanPrice);
        } catch (error) {
            reject(error);
        }
    });
};


const findMeanPriceWeek = (offerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const offers = await Offers.findAll({
                where: {
                    product_id: offerId,
                    updatedAt: { [Op.lt]: oneWeekAgo }
                }
            });
            const product = await Products.findByPk(offerId);
            const sum = offers.reduce((acc, offer) => acc + offer.price, 0);
            const meanPrice = (sum + product.price) / (offers.length + 1);
            resolve(meanPrice);
        } catch (error) {
            reject(error);
        }
    });
};


//get all offers
router.get('/', async (req, res) => {
    try {
        const offers = await Offers.findAll();
        res.json(offers);
    }
    catch (error) {
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: 'Error fetching offers' });
    }
});

// get all aupermarkets that have offers
router.get('/supermarkets', async (req, res) => {
    try {
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
    catch (error) {
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: 'Error fetching offers' });
    }
});

// get all supermarkets that do not have offers
router.get('/supermarkets/empty', async (req, res) => {
    try {
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
    catch (error) {
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: 'Error fetching offers' });
    }
});


//get all offers for a product
// router.get('/:product_id', async (req, res) => {
//     try {
//         const offers = await Offers.findAll({ where: { product_id: req.params.product_id } });
//         res.json(offers);
//     }
//     catch (error) {
//         console.error(`Error fetching offers: ${error}`);
//         res.status(500).json({ error: 'Error fetching offers' });
//     }
// });

//get all offers for a supermarket
router.get('/supermarket/:super_market_id', async (req, res) => {
    try {
        let userId;
        try{
            userId = getUserIdFromToken(req.headers["x-access-token"]);
        }
        catch(error){
            console.log("no token");
        }
        const offers = await Offers.findAll({
            where: { supermarket_id: req.params.super_market_id },
            include: [
                { model: Reactions, as: "reactions" },
                { model: Products, as: "product" },
                { model: Users, as: "user" }
            ],
            order: [['createdAt', 'DESC']]
        });
        const offersWithLikesAndDislikes = offers.map((offer) => {
            const likes = offer.reactions.filter((reaction) => reaction.reaction === "like").length;
            const dislikes = offer.reactions.filter((reaction) => reaction.reaction === "dislike").length;
            const username = offer.user.username;
            const userReaction = offer.reactions.find((reaction) => reaction.user_id === userId)?.reaction ?? "";
            const { reactions, product_id, user, ...offerWithoutReactions } = offer.toJSON();
            return { ...offerWithoutReactions, username, likes, dislikes, userReaction };
        });
        res.json(offersWithLikesAndDislikes);
    }
    catch (error) {
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: 'Error fetching offers' });
    }
});

// get all offers by logged in user
router.get('/user', async (req, res) => {
    console.log("get offers added by me");
    try {
        const userId = getUserIdFromToken(req.headers["x-access-token"]);
        const offers = await Offers.findAll({
            where: { user_id: userId },
            include: [
                { model: Reactions, as: "reactions" },
                { model: Products, as: "product" },
                { model: Super_markets, as: "supermarket" },
                { model: Users, as: "user" }
            ],
            order: [['createdAt', 'DESC']]
        });
        console.log(offers);
        const offersWithLikesAndDislikes = offers.map((offer) => {
            const likes = offer.reactions.filter((reaction) => reaction.reaction === "like").length;
            const dislikes = offer.reactions.filter((reaction) => reaction.reaction === "dislike").length;
            const username = offer.user.username;
            const { reactions, product_id, user, ...offerWithoutReactions } = offer.toJSON();
            return { ...offerWithoutReactions, username, likes, dislikes };
        });
        res.json(offersWithLikesAndDislikes);
    }
    catch (error) {
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: 'Error fetching offers' });
    }
});

// get all offers by a user
router.get('/user/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const user = await Users.findOne({ where: { username: username } });
        const offers = await Offers.findAll({
            where: { user_id: user.id },
            include: [
                { model: Reactions, as: "reactions" },
                { model: Products, as: "product" },
                { model: Super_markets, as: "supermarket" },
                { model: Users, as: "user" }
            ],
            order: [['createdAt', 'DESC']]
        });
        const offersWithLikesAndDislikes = offers.map((offer) => {
            const likes = offer.reactions.filter((reaction) => reaction.reaction === "like").length;
            const dislikes = offer.reactions.filter((reaction) => reaction.reaction === "dislike").length;
            const username = offer.user.username;
            const { reactions, product_id, user, ...offerWithoutReactions } = offer.toJSON();
            return { ...offerWithoutReactions, username, likes, dislikes };
        }
        );
        res.json(offersWithLikesAndDislikes);
    }
    catch (error) {
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: 'Error fetching offers' });
    }
});

// get all ofers a user has reacted to
router.get('/reactions/user/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const reactionUser = await Users.findOne({ where: { username: username } });
        const offers = await Offers.findAll({
            include: [
                { model: Reactions, as: "reactions", where: { user_id: reactionUser.id } },
                { model: Products, as: "product" },
                { model: Super_markets, as: "supermarket" },
                { model: Users, as: "user" }
            ],
            order: [[{ model: Reactions, as: "reactions" }, "updatedAt", "DESC"]]
        });

        const offersWithLikesAndDislikes = offers.map((offer) => {
            const likes = offer.reactions.filter((reaction) => reaction.reaction === "like").length;
            const dislikes = offer.reactions.filter((reaction) => reaction.reaction === "dislike").length;
            const username = offer.user.username;
            const userReaction = offer.reactions.find((reaction) => reaction.user_id === reactionUser.id)?.reaction ?? "";
            const { reactions, product_id, user, ...offerWithoutReactions } = offer.toJSON();
            return { ...offerWithoutReactions, username, likes, dislikes, userReaction };
        });

        res.json(offersWithLikesAndDislikes);
    } catch (error) {
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: "Error fetching offers" });
    }
});

// toggle stock status
router.put('/stock/:offerId', verifyToken, async (req, res) => {
    try {
        const offer = await Offers.findByPk(req.params.offerId);
        offer.stock = !offer.stock;
        await offer.save();
        res.json(offer);
    } catch (error) {
        console.error(`Error updating offer: ${error}`);
        res.status(500).json({ error: 'Error updating offer' });
    }
});

//post a new offer
router.post('/', verifyToken, async (req, res) => {
    try {
        let points = 0;
        // if req.body is an array, use bulkCreate
        if (Array.isArray(req.body)) {
            const offers = await Offers.bulkCreate(req.body);
            res.json(offers);
        }
        // else use create
        else {
            const user_id = getUserIdFromToken(req.headers["x-access-token"]);
            const offerPrice = req.body.price;
            const product = await Products.findByPk(req.body.product_id);
            if (offerPrice >= product.price) {
                res.status(400).json({ message: 'Offer price must be lower than product price' });
                return;
            }
            // find offer with the same product_id and supermarket_id and user_id
            const user_offer = await Offers.findOne({ where: { product_id: req.body.product_id, supermarket_id: req.body.supermarket_id, user_id: user_id } });
            if (0.8*user_offer?.price < offerPrice) {
                res.status(400).json({ message: 'Offer already exists. (And is not 20% less than previous)' });
                return;
            }

            // calculate mean price
            const meanPrice = await findMeanPriceYesterday(req.body.product_id);
            if (offerPrice >= meanPrice) {
                res.status(400).json({ message: 'Offer price must be lower than mean price' });
                return;
            }
            const meanPriceWeek = await findMeanPriceWeek(req.body.product_id);
            if (offerPrice < 0.8*meanPrice) {
                points += 50;
            }
            if (offerPrice < 0.8*meanPriceWeek) {
                points += 20;
            }

            // update user monthly points
            const user = await Users.findByPk(user_id);
            user.monthly_points += points;
            await user.save();

            const offer = await Offers.create({
                ...req.body,
                user_id: user_id
            });
            res.json(offer);
        }
    }
    catch (error) {
        console.error(`Error creating offer: ${error}`);
        res.status(500).json({ message: 'Error creating offer' });
    }
});

module.exports = router;