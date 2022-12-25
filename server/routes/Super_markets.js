const express = require('express');
const router = express.Router();
const { Super_markets } = require('../models');

//get all supermarkets
router.get('/', async (req, res) => {
    const supermarkets = await Super_markets.findAll();
    res.json(supermarkets);
});

//get all offers for a supermarket
router.get('/:super_market_id', async (req, res) => {
    const offers = await Offers.findAll({ where: { super_market_id: req.params.super_market_id } });
    res.json(offers);
});

//get all products for a supermarket
router.get('/:super_market_id/products', async (req, res) => {
    const products = await Products.findAll({ where: { super_market_id: req.params.super_market_id } });
    res.json(products);
});

module.exports = router;