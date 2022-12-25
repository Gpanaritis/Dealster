const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    const users = await Users.findAll();
    res.json(users);
});

router.post('/register', async (req, res) => {
    const {username, password, email} = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash,
            email: email
        })
    });
    res.json({message: 'User created'});
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await Users.findOne({ where: { email: email } });
    if (!user) {
        res.json({error: 'User does not exist'});
    }
    bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
            res.json({error: 'Wrong username/password combination'});
        }
        res.json({message: 'Successfully authenticated'});
    });
});

module.exports = router;