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
    const products = await Products.findAll({ where: { subcategory_id: req.params.subcategory_id } });
    res.json(products);
});

module.exports = router;