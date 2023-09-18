const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin, getUserFromToken, getUserIdFromToken } = require('../middleware/authJwt');
const { Op } = require('sequelize');
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
    const { username, password, email } = req.body;
    //Validate user input
    if (!(email && password && username)) {
        res.status(400).send("All input is required");
    }
    //Check if user already exist
    const old_email = await Users.findOne({ where: { email: email } });

    if (old_email) {
        return res.status(409).send("User Already Exist. Please Login");
    }

    const old_username = await Users.findOne({ where: { username: username } });

    if (old_username) {
        return res.status(409).send("Username is already taken. Please choose another one");
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
        const roles = req.body.roles;
        console.log(roles);
        await user.setRoles(roles);
    } else {
        const userRole = await Roles.findOne({ where: { name: "user" } });
        await user.setRoles(userRole);
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
    const { email, password } = req.body;
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
    else {
        res.status(400).send("Invalid Credentials");
    }
});

router.get('/me', async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    try {
        const userId = getUserIdFromToken(token);
        const user = await Users.findByPk(userId);
        let authorities = [];
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
        });
    } catch (ex) {
        res.status(400).send("Invalid token.");
    }
});

// get leaderboard
router.get('/leaderboard', [verifyToken, isAdmin], async (req, res) => {
    try {
        const lastMonthStartDate = new Date();
        lastMonthStartDate.setMonth(lastMonthStartDate.getMonth() - 1);
        lastMonthStartDate.setHours(0, 0, 0, 0);

        const leaderboard = await Users.findAll({
            attributes: ['username', 'id'],
            include: [
                {
                    model: db.Points,
                    as: 'points',
                    attributes: [
                        [db.sequelize.fn('sum', db.sequelize.col('points')), 'totalPoints'],
                    ],
                },
                {
                    model: db.Tokens,
                    as: 'tokens',
                    attributes: [
                        [db.sequelize.fn('sum', db.sequelize.col('tokens')), 'totalTokens'],
                    ],
                },
            ],
            group: ['Users.id'], // Group by user ID to get distinct users
            order: [[db.sequelize.fn('sum', db.sequelize.col('points.points')), 'DESC']],
            separate: true, // Retrieve the associations separately
        });

        const tokensLastMonth = await db.Tokens.findAll({
            attributes: ['user_id', [db.sequelize.fn('sum', db.sequelize.col('tokens')), 'tokens']],
            where: {
                createdAt: {
                    [Op.gte]: lastMonthStartDate,
                },
            },
            group: ['user_id'],
        });

        // Map the result to get the desired format
        const formattedLeaderboard = leaderboard.map(user => ({
            username: user.username,
            id: user.id,
            points: user.points.length > 0 ? user.points[0].dataValues.totalPoints : 0,
            tokens: user.tokens.length > 0 ? user.tokens[0].dataValues.totalTokens : 0,
            tokensLastMonth: tokensLastMonth.find(tokens => tokens.user_id === user.id)?.dataValues.tokens || 0,
        }));

        res.json(formattedLeaderboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.put('/changeUsername/:username', verifyToken, async (req, res) => {
    const { username } = req.params;
    // Check if user exist
    const old_username = await Users.findOne({ where: { username: username } });
    if (old_username) {
        return res.status(409).send("Username is already taken. Please choose another one");
    }

    const token = req.headers['x-access-token'];
    const userId = getUserIdFromToken(token)
    const user = await Users.findByPk(userId);
    if (user) {
        user.username = username;
        await user.save();
        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken: token
        });
    } else {
        res.status(400).send("User not found");
    }
});

// add also the change password route
router.put('/changePassword', verifyToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = getUserIdFromToken(req.headers["x-access-token"]);
    const user = await Users.findByPk(userId);
    if (user) {
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (isOldPasswordValid) {
            const encryptedPassword = await bcrypt.hash(newPassword, 10);
            user.password = encryptedPassword;
            await user.save();
            res.status(200).send("Password changed successfully");
        } else {
            res.status(400).send("Old password is incorrect");
        }
    } else {
        res.status(400).send("User not found");
    }
});

router.get("/welcome", verifyToken, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

router.get("/admin", [verifyToken, isAdmin], (req, res) => {
    res.status(200).send("Admin content.");
});

module.exports = router;
