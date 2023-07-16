const express = require('express');
const router = express.Router();
const { Offers } = require('../models');

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
        const offers = await Offers.findAll({ where: { super_market_id: req.params.super_market_id } });
        res.json(offers);
    }
    catch(error){
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: 'Error fetching offers' });
    }
});

//post a new offer
router.post('/', async (req, res) => {
    try{
        const offer = await Offers.create(req.body);
        res.json(offer);
    }
    catch(error){
        console.error(`Error creating offer: ${error}`);
        res.status(500).json({ error: 'Error creating offer' });
    }
});

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