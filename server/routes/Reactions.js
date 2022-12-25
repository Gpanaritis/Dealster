const express = require('express');
const router = express.Router();
const { Reactions } = require('../models');

//get all reactions for an offer
router.get('/:offerId', async (req, res) => {
    const reactions = await Reactions.findAll({ where: { offerId: req.params.offerId } });
    res.json(reactions);
});

module.exports = router;