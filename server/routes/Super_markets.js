const express = require('express');
const router = express.Router();
const { Super_markets } = require('../models');

//get all supermarkets
router.get('/', async (req, res) => {
    const supermarkets = await Super_markets.findAll();
    res.json(supermarkets);
});

//get all products for a supermarket
router.get('/:super_market_id/products', async (req, res) => {
    try{
        const supermarket = await Super_markets.findByPk(req.params.super_market_id, {
            include: {
                model: Products,
                as : 'products',
                attributes: ['id', 'name', 'price'],
                through: { attributes: [] }
            }
        });
        res.json(supermarket.products);
    }
    catch(error){
        console.error(`Error fetching products for supermarket: ${error}`);
        res.status(500).json({ error: 'Error fetching products for supermarket' });
    }
});

//post a new supermarket
router.post('/', async (req, res) => {
    try{
        const supermarket = await Super_markets.create(req.body);
        res.json(supermarket);
    }
    catch(error){
        console.error(`Error creating supermarket: ${error}`);
        res.status(500).json({ error: 'Error creating supermarket' });
    }
});

router.post('/geojson', async (req, res) => {
    try{
        const supermarkets = req.body.features;
        const supermarketsData = supermarkets
            .filter(supermarket => supermarket.properties.name)
            .map(supermarket => ({
                name: supermarket.properties.name,
                latitude: supermarket.geometry.coordinates[0],
                longitude: supermarket.geometry.coordinates[1],
            }));
        await Super_markets.bulkCreate(supermarketsData);
        res.json(supermarkets);
    }
    catch(error){
        console.error(`Error creating supermarkets: ${error}`);
        res.status(500).json({ error: 'Error creating supermarkets' });
    }
});

module.exports = router;