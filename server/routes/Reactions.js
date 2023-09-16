const express = require('express');
const router = express.Router();
const { Reactions } = require('../models');
const {getUserIdFromToken} = require('../middleware/authJwt');
const { Offers, Users, Points } = require('../models');

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

// toggle like reaction
router.put('/like/:offerId', async (req, res) => {
    try{
        // get user id from token
        const userId = getUserIdFromToken(req.headers["x-access-token"]);
        // get user from offer
        const offer = await Offers.findByPk(req.params.offerId);
        const user = await Users.findByPk(offer.user_id);

        const reaction = await Reactions.findOne({ where: { offer_id: req.params.offerId, user_id: userId } });
        if(reaction){
            if(reaction.reaction === "like"){
                // remove reaction
                await reaction.destroy();
                const pointsEntry = await Points.create({
                    points: -5,
                    user_id: userId
                });

            }
            else{
                // change reaction
                reaction.reaction = "like";
                await reaction.save();
                // add points
                const pointsEntry = await Points.create({
                    points: 6,
                    user_id: userId
                });

            }
            res.json(reaction);
        }
        else{
            const reaction = await Reactions.create({ offer_id: req.params.offerId, user_id: userId, reaction: "like" });
            // add points
            const pointsEntry = await Points.create({
                points: 5,
                user_id: userId
            });
            res.json(reaction);
        }
    } catch (error) {
        console.error(`Error creating reaction: ${error}`);
        res.status(500).json({ error: 'Error creating reaction' });
    }
});

// toggle dislike reaction
router.put('/dislike/:offerId', async (req, res) => {
    try{
        // get user id from token
        const userId = getUserIdFromToken(req.headers["x-access-token"]);
        // get user from offer
        const offer = await Offers.findByPk(req.params.offerId);
        const user = await Users.findByPk(offer.user_id);

        const reaction = await Reactions.findOne({ where: { offer_id: req.params.offerId, user_id: userId } });
        if(reaction){
            if(reaction.reaction === "dislike"){
                // remove reaction
                await reaction.destroy();
                // add points
                const pointsEntry = await Points.create({
                    points: 1,
                    user_id: userId
                });
                
            }
            else{
                // change reaction
                reaction.reaction = "dislike";
                await reaction.save();
                console.log(reaction);
                // remove points
                const pointsEntry = await Points.create({
                    points: -6,
                    user_id: userId
                });
            }
            res.json(reaction);
        }
        else{
            const reaction = await Reactions.create({ offer_id: req.params.offerId, user_id: userId, reaction: "dislike" });
            // remove points
            const pointsEntry = await Points.create({
                points: -1,
                user_id: userId
            });
            res.json(reaction);
        }
    } catch (error) {
        console.error(`Error creating reaction: ${error}`);
        res.status(500).json({ error: 'Error creating reaction' });
    }
});

//create a reaction
router.post('/', async (req, res) => {
    try{
        if(Array.isArray(req.body)){
            const reactions = await Reactions.bulkCreate(req.body);
            res.json(reactions);
        }
        else{
            const reaction = await Reactions.create(req.body);
            res.json(reaction);
        }
    } catch (error) {
        console.error(`Error creating reaction: ${error}`);
        res.status(500).json({ error: 'Error creating reaction' });
    }
});

module.exports = router;