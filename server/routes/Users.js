const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const users = await Users.findAll();
    res.json(users);
});

router.post('/register', async (req, res) => {
    const {username, password, email} = req.body;
    //Validate user input
    if (!(email && password && username)) {
        res.status(400).send("All input is required");
    }
    //Check if user already exist
    const old = await Users.findOne({ where: { email: email } });

    if (old) {
        return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    //Create user in our database
    const user = await Users.create({
        username: username,
        password: encryptedPassword,
        email: email
    });

    //Create token
    const token = jwt.sign(
        { user_id: user.id, email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );

    //save user token
    user.token = token;

    //return new user
    res.status(201).json(user);
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    //Validate user input
    if (!(email && password)) {
        res.status(400).send("All input is required");
    }

    //Check if user exist
    const user = await Users.findOne({ where: { email: email } });

    if (user && (await bcrypt.compare(password, user.password))) {
        //Create token
        // res.status(200).json(user.id);
        //sign in token
        const token = jwt.sign(
            { user_id: user.id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );


        // const token = jwt.sign(
        //     { id: user.id, email },
        //     process.env.TOKEN_KEY,
        //     {
        //         expiresIn: "2h",
        //     }
        // );

        //save user token
        user.token = token;

        //user
        res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
});

router.get('/me', async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
        res.json(req.user);
    } catch (ex) {
        res.status(400).send("Invalid token.");
    }
});

router.get("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

module.exports = router;