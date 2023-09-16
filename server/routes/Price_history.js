const express = require('express');
const router = express.Router();
const { Points } = require('../models');
const { Op } = require('sequelize');
const { getUserIdFromToken } = require('../middleware/authJwt');
const { Products, Price_history } = require('../models');

// get all prices for a product
router.get('/product/:product_id', async (req, res) => {
    try {
        const prices = await Price_history.findAll({ where: { product_id: req.params.product_id } });
        res.json(prices);
    } catch (error) {
        console.error(`Error fetching prices: ${error}`);
        res.status(500).json({ error: 'Error fetching prices' });
    }
});

// get mean price for a product yesterday
router.get('/product/:product_id/yesterday', async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59, 999);
        const priceHistory = await Price_history.findOne({
            where: {
                product_id: req.params.product_id,
                createdAt: { [Op.between]: [startOfDay, endOfDay] }
            }
        });
        res.json(priceHistory.price);
    } catch (error) {
        console.error(`Error fetching prices: ${error}`);
        res.status(500).json({ error: 'Error fetching prices' });
    }
});

// get mean price for a product last week
router.get('/product/:product_id/week', async (req, res) => {
    try {
        const today = new Date();
        const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 0, 0, 0, 0);
        const priceHistory = await Price_history.findAll({
            where: {
                product_id: req.params.product_id,
                createdAt: { [Op.gte]: oneWeekAgo }
            }
        });

        const prices = priceHistory.map(price => parseFloat(price.price));
        const meanPrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;
        res.json(meanPrice);
    } catch (error) {
        console.error(`Error fetching prices: ${error}`);
        res.status(500).json({ error: 'Error fetching prices' });
    }
});

// Post new prices
router.post('/', async (req, res) => {
    try {
        const { id, prices } = req.body;

        const priceHistory = prices.map(price => ({ product_id: id, date: price.date, price: price.price }));

        await Price_history.bulkCreate(priceHistory, { ignoreDuplicates: true });

        res.json(priceHistory);
    } catch (error) {
        console.error(`Error creating price history: ${error}`);
        res.status(500).json({ error: 'Error creating price history' });
    }
});

module.exports = router;