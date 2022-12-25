const express = require('express');
const router = express.Router();
const { Products } = require('../models');

//get all products
router.get('/', async (req, res) => {
    const products = await Products.findAll();
    res.json(products);
});

//get all offers for a product
router.get('/:product_id', async (req, res) => {
    const offers = await Offers.findAll({ where: { product_id: req.params.product_id } });
    res.json(offers);
});

//get all supermarkets for a product
router.get('/:product_id/supermarkets', async (req, res) => {
    const supermarkets = await Super_markets.findAll({ where: { product_id: req.params.product_id } });
    res.json(supermarkets);
});

module.exports = router;