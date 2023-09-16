const express = require('express');
const router = express.Router();
const { Tokens } = require('../models');
const { Op } = require('sequelize');
const {getUserIdFromToken} = require('../middleware/authJwt');
const { Users } = require('../models');

//get all points for a user
router.get('/user/:username/sum', async (req, res) => {
    try{
        const user = await Users.findOne({ where: { username: req.params.username } });
        const tokens = await Tokens.sum('tokens', { where: { user_id: user.id } });
        res.json(tokens || 0);
    } catch (error) {
        console.error(`Error fetching tokens: ${error}`);
        res.status(500).json({ error: 'Error fetching tokens' });
    }
});

// get all points for a user in a month (monthsBeforeToday = 0 is the current month)
router.get('/user/:username/month/:month', async (req, res) => {
    try {
        const user = await Users.findOne({ where: { username: req.params.username } });
        const monthsBeforeToday = parseInt(req.params.month);
        const month = new Date();
        month.setMonth(month.getMonth() - monthsBeforeToday);
        const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
        const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);
        const tokens = await Tokens.sum('tokens',{ where: { user_id: user.id, createdAt: { [Op.between]: [startOfMonth, endOfMonth] } } });
        res.json(tokens || 0);
    } catch (error) {
        console.error(`Error fetching tokens: ${error}`);
        res.status(500).json({ error: 'Error fetching tokens' });
    }
});

module.exports = router;