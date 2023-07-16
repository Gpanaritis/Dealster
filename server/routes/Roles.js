const express = require('express');
const router = express.Router();

const { Users } = require('../models');
const {Roles} = require('../models');

// get all roles
router.get('/', async (req, res) => {
    try {
        const roles = await Roles.findAll();
        res.json(roles);
    } catch (error) {
        console.error(`Error fetching roles: ${error}`);
        res.status(500).json({ error: 'Error fetching roles' });
    }
});

// get all roles for a user
router.get('/:user_id', async (req, res) => {
    try{
        const user = await Users.findByPk(req.params.user_id, {
            include: {
                model: Roles,
                as: 'roles',
                attributes: ['id','name'],
                through: {
                    attributes: [],
                },
            }
        });
        res.json(user.roles);
    } catch (error) {
        console.error(`Error fetching roles: ${error}`);
        res.status(500).json({ error: 'Error fetching roles' });
    }
});

// get all users for a role
router.get('/:role_id/users', async (req, res) => {
    try{
        const role = await Roles.findByPk(req.params.role_id, {
            include: {
                model: Users,
                as: 'users',
                attributes: ['id','email', 'username'],
                through: {
                    attributes: [],
                },
            }
        });
        res.json(role.users);
    } catch (error) {
        console.error(`Error fetching users: ${error}`);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// post a new role
router.post('/', async (req, res) => {
    const roles = req.body;
    try {
      const createdRoles = await Roles.bulkCreate(roles);
      res.json(createdRoles);
    } catch (error) {
      console.error(`Error creating roles: ${error}`);
      res.status(500).json({ error: 'Error creating roles' });
    }
});

module.exports = router;