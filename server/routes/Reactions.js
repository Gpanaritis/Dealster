const express = require('express');
const router = express.Router();
const { Reactions } = require('../models');

//get all reactions for an offer
router.get('/offer/:offerId', async (req, res) => {
    try{
        const reactions = await Reactions.findAll({ where: { offerId: req.params.offerId } });
        res.json(reactions);
    } catch (error) {
        console.error(`Error fetching reactions: ${error}`);
        res.status(500).json({ error: 'Error fetching reactions' });
    }
});

//get all reactions for a user
router.get('/user/:userId', async (req, res) => {
    try{
        const reactions = await Reactions.findAll({ where: { userId: req.params.userId } });
        res.json(reactions);
    } catch (error) {
        console.error(`Error fetching reactions: ${error}`);
        res.status(500).json({ error: 'Error fetching reactions' });
    }
});

module.exports = router;