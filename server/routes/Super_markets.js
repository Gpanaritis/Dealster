const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const { Super_markets, Offers, Products, Subcategory, Category } = require('../models');
const axios = require('axios');
const { verifyToken, isAdmin } = require('../middleware/authJwt');

router.get('/', async (req, res) => {
    try {
        const { latitude, longitude } = req.query;
        const supermarkets = await Super_markets.findAll({
            include: [{
                model: Offers,
                as: "offers",
                attributes: []
            }],
            attributes: {
                include: [
                    [Sequelize.fn("COUNT", Sequelize.col("offers.id")), "num_offers"],
                    [
                        Sequelize.literal(`ST_Distance_Sphere(point(${longitude}, ${latitude}), point(longitude, latitude)) <= 50`),
                        "is_near"
                    ]
                ]
            },
            group: ['Super_markets.id']
        });
        res.json(supermarkets);
    }
    catch (error) {
        console.error(`Error fetching supermarkets: ${error}`);
        res.status(500).json({ error: 'Error fetching supermarkets' });
    }
});

//get all products for a supermarket
router.get('/:super_market_id/products', async (req, res) => {
    try {
        const supermarket = await Super_markets.findByPk(req.params.super_market_id, {
            include: {
                model: Products,
                as: 'products',
                attributes: ['id', 'name', 'price', 'image'],
                through: { attributes: [] }
            }
        });
        res.json(supermarket.products);
    }
    catch (error) {
        console.error(`Error fetching products for supermarket: ${error}`);
        res.status(500).json({ error: 'Error fetching products for supermarket' });
    }
});

// get all supermarkets that are close to given position
router.get('/close', async (req, res) => {
    try {
        let { latitude, longitude } = req.query;
        latitude = 21.76420750;
        longitude = 38.21043650;
        const supermarkets = await Super_markets.findAll({
            where: {
                latitude: {
                    [Op.between]: [latitude - 0.004, latitude + 0.004]
                },
                longitude: {
                    [Op.between]: [longitude - 0.004, longitude + 0.004]
                }
            }
        });
        res.json(supermarkets);
    }
    catch (error) {
        console.error(`Error fetching offers: ${error}`);
        res.status(500).json({ error: 'Error fetching offers' });
    }
});

router.get('/:super_market_id/categories', async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'name'],
            include: [
                {
                    model: Subcategory,
                    as: 'subcategories',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: Products,
                            as: 'products',
                            attributes: ['id', 'name', 'price'],
                            through: {
                                attributes: []
                            },
                            include: [
                                {
                                    model: Super_markets,
                                    as: 'supermarkets',
                                    where: {
                                        id: req.params.super_market_id
                                    },
                                    attributes: [],
                                    through: {
                                        attributes: []
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [['name', 'ASC']],
            distinct: true
        });

        res.json(categories);
    } catch (error) {
        console.error(`Error fetching categories for supermarket: ${error}`);
        res.status(500).json({ error: 'Error fetching categories for supermarket' });
    }
});

router.get('/product_name/:product_name', async (req, res) => {
    try {
        const { product_name } = req.params;
        const supermarkets = await Super_markets.findAll({
            include: {
                model: Products,
                as: 'products',
                attributes: []
            },
            where: {
                '$products.name$': {
                    [Op.like]: `%${product_name}%`
                }
            },
            distinct: true
        });
        res.json(supermarkets);
    }
    catch (error) {
        console.error(`Error fetching supermarkets: ${error}`);
        res.status(500).json({ error: 'Error fetching supermarkets' });
    }
});

router.get('/category_name/:category_name', async (req, res) => {
    try {
        const { category_name } = req.params;
        const supermarkets = await Super_markets.findAll({
            include: {
                model: Offers,
                as: 'offers',
                attributes: [],
                required: true,
                include: [
                    {
                        model: Products,
                        as: 'product',
                        attributes: [],
                        required: true,
                        include: [
                            {
                                model: Subcategory,
                                as: 'subcategories',
                                attributes: [],
                                required: true,
                                include: [
                                    {
                                        model: Category,
                                        as: 'category',
                                        attributes: [],
                                        where: {
                                            name: category_name
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            // ascending order by supermarket id
            order: [['id', 'ASC']],
            distinct: true
        });
        res.json(supermarkets);
    }
    catch (error) {
        console.error(`Error fetching supermarkets: ${error}`);
        res.status(500).json({ error: 'Error fetching supermarkets' });
    }
});


//post a new supermarket
router.post('/one', async (req, res) => {
    try {
        const supermarket = await Super_markets.create(req.body);
        res.json(supermarket);
    }
    catch (error) {
        console.error(`Error creating supermarket: ${error}`);
        res.status(500).json({ error: 'Error creating supermarket' });
    }
});

router.post('/geojson', async (req, res) => {
    try {
        const supermarkets = req.body.features;
        const supermarketsData = supermarkets
            .filter(supermarket => supermarket.properties.name)
            .map(supermarket => ({
                name: supermarket.properties.name,
                latitude: supermarket.geometry.coordinates[0],
                longitude: supermarket.geometry.coordinates[1],
            }));
        // await Super_markets.bulkCreate(supermarketsData);
        res.json(supermarkets);
    }
    catch (error) {
        console.error(`Error creating supermarkets: ${error}`);
        res.status(500).json({ error: 'Error creating supermarkets' });
    }
});

router.post('/', async (req, res) => {
    try {
        const supermarkets = req.body.features;
        const supermarketsData = [];

        for (const supermarket of supermarkets) {
            if (supermarket.properties.name) {
                const latitude = supermarket.geometry.coordinates[1];
                const longitude = supermarket.geometry.coordinates[0];

                // check to see if the supermarket already exists
                const existingSupermarket = await Super_markets.findOne({
                    where: {
                        latitude: latitude,
                        longitude: longitude
                    }
                });
                if (existingSupermarket) continue;

                // Make a request to the Nominatim API for reverse geocoding
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );

                // Extract address details from the response
                const addressComponents = response.data.address;
                const address = addressComponents.road || '';
                const addressNumber = addressComponents.house_number || '';
                const postcode = addressComponents.postcode || '';

                // Construct the full address
                const fullAddressParts = [];
                if (address) fullAddressParts.push(address);
                if (addressNumber) fullAddressParts.push(addressNumber);
                if (postcode) fullAddressParts.push(postcode);

                const fullAddress = fullAddressParts.join(', ');

                supermarketsData.push({
                    name: supermarket.properties.name,
                    latitude: latitude,
                    longitude: longitude,
                    address: fullAddress,
                });
            }
        }

        await Super_markets.bulkCreate(supermarketsData, { ignoreDuplicates: true });
        res.json(supermarketsData);
    } catch (error) {
        console.error(`Error creating supermarkets: ${error}`);
        res.status(500).json({ error: 'Error creating supermarkets' });
    }
});

module.exports = router;