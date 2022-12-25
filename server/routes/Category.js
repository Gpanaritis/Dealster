const express = require('express');
const router = express.Router();
const { Category } = require('../models');

//get all categories
router.get('/', async (req, res) => {
    const categories = await Category.findAll();
    res.json(categories);
});

//get all subcategories for a category
router.get('/:category_id/subcategories', async (req, res) => {
    const subcategories = await Subcategory.findAll({ where: { category_id: req.params.category_id } });
    res.json(subcategories);
});

module.exports = router;