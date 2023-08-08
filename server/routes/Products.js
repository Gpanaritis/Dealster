const express = require('express');
const router = express.Router();
const { Products } = require('../models');
const { Subcategory } = require('../models');
const { Super_markets } = require('../models');

//get all products
router.get('/', async (req, res) => {
    const products = await Products.findAll();
    res.json(products);
});

//get all supermarkets for a product
router.get('/:product_id/supermarkets', async (req, res) => {
    try{
        const product = await Products.findByPk(req.params.product_id, {
            include: {
                model: Super_markets,
                as : 'supermarkets',
                attributes: ['id', 'name', 'latitude', 'longitude'],
                through: { attributes: [] }
            }
        });
        res.json(product.supermarkets);
    }
    catch(error){
        console.error(`Error fetching supermarkets for product: ${error}`);
        res.status(500).json({ error: 'Error fetching supermarkets for product' });
    }
});

// get all subcategories for a product
router.get('/:product_id/subcategories', async (req, res) => {
    try{
        const product = await Products.findByPk(req.params.product_id, {
            include: {
                model: Subcategories,
                as : 'subcategories',
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }
        });
        res.json(product.subcategories);
    }
    catch(error){
        console.error(`Error fetching subcategories for product: ${error}`);
        res.status(500).json({ error: 'Error fetching subcategories for product' });
    }
});

//post if product does not exist, and update if it does
// router.post('/', async (req, res) => {
//     const product = await Products.findOrCreate({
//         where: { name: req.body.name },
//         defaults: {
//             name: req.body.name,
//             subcategory_id: req.body.subcategory_id,
//             super_market_id: req.body.super_market_id
//         }
//     });
//     res.json(product);
// });

// post product
router.post('/', async (req, res) => {
    try{
        const product = await Products.create(req.body);
        res.json(product);
    }
    catch(error){
        console.error(`Error creating product: ${error}`);
        res.status(500).json({ error: 'Error creating product' });
    }
});

//post products
router.post('/many', async (req, res) => {
    try{
        const products = await Products.bulkCreate(req.body);
        res.json(products);
    }
    catch(error){
        console.error(`Error creating products: ${error}`);
        res.status(500).json({ error: 'Error creating products' });
    }
});

//add a product to supermarkets
router.post('/:product_id/supermarkets', async (req, res) => {
    try{
        const product = await Products.findOne({ where: { id: req.params.product_id } });
        const { supermarket_ids } = req.body;
        console.log(supermarket_ids);
        console.log(req.body)
        const supermarkets = await Super_markets.findAll({ where: { id: supermarket_ids } });
        await product.addSupermarkets(supermarkets);
        res.json(product);
    }
    catch(error){
        console.error(`Error creating product: ${error}`);
        res.status(500).json({ error: 'Error creating product' });
    }
});

// add a product to all supermarkets
router.post("/:product_id/supermarkets/all", async (req, res) => {
    try{
        const product = await Products.findOne({ where: { id: req.params.product_id } });
        const supermarkets = await Super_markets.findAll();
        await product.addSupermarkets(supermarkets);
        res.json(product);
    }
    catch(error){
        console.error(`Error creating product: ${error}`);
        res.status(500).json({ error: 'Error creating product' });
    }
});

// add all products to all supermarkets
router.post("/all/supermarkets/all", async (req, res) => {
    try{
        const products = await Products.findAll();
        const supermarkets = await Super_markets.findAll();
        for (const product of products){
            await product.addSupermarkets(supermarkets);
        }
        res.json(products);
    }
    catch(error){
        console.error(`Error creating product: ${error}`);
        res.status(500).json({ error: 'Error creating product' });
    }
});

//add a product to a subcategory
router.post('/:product_id/subcategories', async (req, res) => {
    try{
        const product = await Products.findOne({ where: { id: req.params.product_id } });
        const { subcategory_id } = req.body;
        await product.update({ subcategory_id: subcategory_id });
        res.json(product);
    }
    catch(error){
        console.error(`Error creating product: ${error}`);
        res.status(500).json({ error: 'Error creating product' });
    }
});

module.exports = router;