const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const { Products, Category, Offers } = require('../models');
const { Subcategory } = require('../models');
const { Super_markets } = require('../models');

//get all products
router.get('/', async (req, res) => {
    const products = await Products.findAll();
    res.json(products);
});

//get all supermarkets for a product
router.get('/:product_id/supermarkets', async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.product_id, {
            include: {
                model: Super_markets,
                as: 'supermarkets',
                attributes: ['id', 'name', 'latitude', 'longitude'],
                through: { attributes: [] }
            }
        });
        res.json(product.supermarkets);
    }
    catch (error) {
        console.error(`Error fetching supermarkets for product: ${error}`);
        res.status(500).json({ error: 'Error fetching supermarkets for product' });
    }
});

// get product by id
router.get('/:product_id', async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.product_id, {
            include: [
                {
                    model: Super_markets,
                    as: 'supermarkets',
                    attributes: ['id', 'name', 'latitude', 'longitude', 'address'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: Offers,
                            as: 'offers',
                            attributes: ['price'],
                            order: [['price', 'ASC']], // Order offers by price ascending
                            limit: 1, // Get only the minimum offer
                        }
                    ],
                },
                {
                    model: Subcategory,
                    as: 'subcategories',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: Category,
                            as: 'category',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        res.json(product);
    }
    catch (error) {
        console.error(`Error fetching product: ${error}`);
        res.status(500).json({ error: 'Error fetching product' });
    }
});


// get all subcategories for a product
router.get('/:product_id/subcategories', async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.product_id, {
            include: {
                model: Subcategories,
                as: 'subcategories',
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }
        });
        res.json(product.subcategories);
    }
    catch (error) {
        console.error(`Error fetching subcategories for product: ${error}`);
        res.status(500).json({ error: 'Error fetching subcategories for product' });
    }
});


//post products
router.post('/', async (req, res) => {
    // create a function
    const createProduct = async (product) => {
        try {
            const createdProduct = await Products.create(product);
            if (product.subcategory_ids) {
                const subcategories = await Subcategory.findAll({ where: { id: product.subcategory_ids } });
                await createdProduct.addSubcategory(subcategories);
            }
            if (product.supermarket_ids) {
                const supermarkets = await Super_markets.findAll({ where: { id: product.supermarket_ids } });
                await createdProduct.addSupermarkets(supermarkets);
            }
            if (product.supermarket_names == 'all') {
                const supermarkets = await Super_markets.findAll();
                await createdProduct.addSupermarkets(supermarkets);
            }
            else if (product.supermarket_names) {
                const supermarkets = await Super_markets.findAll({ where: { name: product.supermarket_names } });
                await createdProduct.addSupermarkets(supermarkets);
            }
            return createdProduct;
        } catch (error) {
            if (error instanceof sequelize.UniqueConstraintError) {
                console.error(`Error creating product: ${error}`);
                return null;
            }
        }
    }

    try {
        if (Array.isArray(req.body)) {
            let createdProduct;
            for (const product of req.body) {
                createdProduct = await createProduct(product);
            }
            res.json(createdProduct);
        }
        else {
            const createdProduct = await createProduct(req.body);
            res.json(createdProduct);
        }

    }
    catch (error) {
        console.error(`Error creating products: ${error}`);
        res.status(500).json({ error: 'Error creating products' });
    }
});


//add a product to supermarkets
router.post('/:product_id/supermarkets', async (req, res) => {
    try {
        const product = await Products.findOne({ where: { id: req.params.product_id } });
        const { supermarket_ids } = req.body;
        console.log(supermarket_ids);
        console.log(req.body)
        const supermarkets = await Super_markets.findAll({ where: { id: supermarket_ids } });
        await product.addSupermarkets(supermarkets);
        res.json(product);
    }
    catch (error) {
        console.error(`Error creating product: ${error}`);
        res.status(500).json({ error: 'Error creating product' });
    }
});

// add a product to all supermarkets
router.post("/:product_id/supermarkets/all", async (req, res) => {
    try {
        const product = await Products.findOne({ where: { id: req.params.product_id } });
        const supermarkets = await Super_markets.findAll();
        await product.addSupermarkets(supermarkets);
        res.json(product);
    }
    catch (error) {
        console.error(`Error creating product: ${error}`);
        res.status(500).json({ error: 'Error creating product' });
    }
});

// add all products to all supermarkets
router.post("/all/supermarkets/all", async (req, res) => {
    try {
        const products = await Products.findAll();
        const supermarkets = await Super_markets.findAll();
        for (const product of products) {
            await product.addSupermarkets(supermarkets);
        }
        res.json(products);
    }
    catch (error) {
        console.error(`Error creating product: ${error}`);
        res.status(500).json({ error: 'Error creating product' });
    }
});

//add a product to a subcategory
router.post('/:product_id/subcategories', async (req, res) => {
    try {
        const product = await Products.findOne({ where: { id: req.params.product_id } });
        const { subcategory_id } = req.body;
        await product.update({ subcategory_id: subcategory_id });
        res.json(product);
    }
    catch (error) {
        console.error(`Error creating product: ${error}`);
        res.status(500).json({ error: 'Error creating product' });
    }
});

module.exports = router;