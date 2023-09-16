const express = require('express');
const router = express.Router();
const { Subcategory } = require('../models');

//get all subcategories
router.get('/', async (req, res) => {
    const subcategories = await Subcategory.findAll();
    res.json(subcategories);
});

//get all products for a subcategory
router.get('/:subcategory_id/products', async (req, res) => {
    try{
        const subcategory = await Subcategory.findByPk(req.params.subcategory_id, {
            include: {
                model: Products,
                as : 'products',
                attributes: ['id', 'name', 'price'],
                through: { attributes: [] }
            }
        });
        res.json(subcategory.products);
    }
    catch(error){
        console.error(`Error fetching products for subcategory: ${error}`);
        res.status(500).json({ error: 'Error fetching products for subcategory' });
    }
});

//post a new subcategory
router.post('/', async (req, res) => {
    try{
        if(Array.isArray(req.body)){
            const subcategories = await Subcategory.bulkCreate(req.body, { ignoreDuplicates: true });
            res.json(subcategories);
        }
        else{
            const subcategory = await Subcategory.create(req.body);
            res.json(subcategory);
        }
    }
    catch(error){
        console.error(`Error creating subcategory: ${error}`);
        res.status(500).json({ error: 'Error creating subcategory' });
    }
});

module.exports = router;