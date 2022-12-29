const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {verifyToken, isAdmin} = require('../middleware/authJwt');
// const op = require('sequelize').Op;

const Users = db.Users;
const Roles = db.Roles;
console.log(Users);
console.log(Roles);
// const auth = require('../middleware/auth');

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

    if (req.body.roles) {
        // const roles = await Roles.findAll({
        //     where: {
        //         name: {
        //             [op.or]: req.body.roles
        //         }
        //     }
        // });
        const roles = [1, 2];
        await user.setRoles(roles);
    } else {
        // user role = 1
        // const userRole = await Roles.findOne({ where: { name: "user" } });
        const roles = [2];
        await user.setRoles(roles);
    }

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

        //save user token
        user.token = token;

        let authorities = [];
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        //user
        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
        });
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

router.get("/welcome", verifyToken, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

router.get("/admin", [verifyToken, isAdmin], (req, res) => {
    res.status(200).send("Admin content.");
});

module.exports = router;