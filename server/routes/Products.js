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

//post if product does not exist, and update if it does
router.post('/', async (req, res) => {
    const product = await Products.findOrCreate({
        where: { name: req.body.name },
        defaults: {
            name: req.body.name,
            subcategory_id: req.body.subcategory_id,
            super_market_id: req.body.super_market_id
        }
    });
    res.json(product);
});

//post products
router.post('/products', async (req, res) => {
    const products = await Products.bulkCreate(req.body);
    res.json(products);
});

module.exports = router;