const express = require('express');
const router = express.Router();
const { Offers } = require('../models');

// //get all offers for a product
// router.get('/:product_id', async (req, res) => {
//     const offers = await Offers.findAll({ where: { product_id: req.params.product_id } });
//     res.json(offers);
// });

// //get all offers for a supermarket
// router.get('/supermarket/:super_market_id', async (req, res) => {
//     const offers = await Offers.findAll({ where: { super_market_id: req.params.super_market_id } });
//     res.json(offers);
// });

module.exports = router;