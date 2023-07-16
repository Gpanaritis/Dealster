const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { Subcategory } = require('../models');

//get all categories
router.get('/', async (req, res) => {
    try{
        const categories = await Category.findAll();
        res.json(categories);
    }
    catch(error){
        console.error(`Error fetching categories: ${error}`);
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

//get all subcategories for a category
router.get('/:category_id/subcategories', async (req, res) => {
    const subcategories = await Subcategory.findAll({ where: { category_id: req.params.category_id } });
    res.json(subcategories);
});

//post a new category
router.post('/', async (req, res) => {
    try{
        const category = await Category.create(req.body);
        res.json(category);
    }
    catch(error){
        console.error(`Error creating category: ${error}`);
        res.status(500).json({ error: 'Error creating category' });
    }
});

// post many new categories
router.post('/many', async (req, res) => {
    try{
        const categories = await Category.bulkCreate(req.body);
        res.json(categories);
    }
    catch(error){
        console.error(`Error creating categories: ${error}`);
        res.status(500).json({ error: 'Error creating categories' });
    }
});

module.exports = router;