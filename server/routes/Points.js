const express = require('express');
const router = express.Router();
const { Points } = require('../models');
const { Op } = require('sequelize');
const {getUserIdFromToken} = require('../middleware/authJwt');
const { Users } = require('../models');

//get all points for a user
router.get('/user/:username/sum', async (req, res) => {
    try{
        const user = await Users.findOne({ where: { username: req.params.username } });
        const points = await Points.sum('points',{ where: { user_id: user.id } });
        res.json(points || 0);
    } catch (error) {
        console.error(`Error fetching points: ${error}`);
        res.status(500).json({ error: 'Error fetching points' });
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
        const points = await Points.sum('points',{ where: { user_id: user.id, createdAt: { [Op.between]: [startOfMonth, endOfMonth] } } });
        res.json(points || 0);
    } catch (error) {
        console.error(`Error fetching points: ${error}`);
        res.status(500).json({ error: 'Error fetching points' });
    }
});

// get all points for a user in a day (daysBeforeToday = 0 is the current day)
router.get('/user/:username/day/:day', async (req, res) => {
    try {
        const user = await Users.findOne({ where: { username: req.params.username } });
        const daysBeforeToday = parseInt(req.params.day);
        const day = new Date();
        day.setDate(day.getDate() - daysBeforeToday);
        const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
        const points = await Points.sum('points',{ where: { userId: user.id, createdAt: { [Op.between]: [startOfDay, endOfDay] } } });
        res.json(points || 0);
    } catch (error) {
        console.error(`Error fetching points: ${error}`);
        res.status(500).json({ error: 'Error fetching points' });
    }
});

module.exports = router;