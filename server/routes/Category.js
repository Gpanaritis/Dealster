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
router.get('/subcategories/:category_id', async (req, res) => {
    const subcategories = await Subcategory.findAll({ where: { category_id: req.params.category_id } });
    res.json(subcategories);
});

//post a new category
router.post('/', async (req, res) => {
    try{
        // if category already exists, return error
        // const existingCategory = await Category.findOne({ where: { name: req.body.name } });
        // if(existingCategory){
        //     return res.status(409).json({ error: 'Category already exists' });
        // }

        if (Array.isArray(req.body)) {
            const categories = await Category.bulkCreate(req.body, { ignoreDuplicates: true });
            return res.json(categories);
        }
        // else create new category
        else{
            const category = await Category.create(req.body);
            return res.json(category);
        }
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