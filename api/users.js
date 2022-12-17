const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const { 
    getUser,
    createUser,
    getUserByUsername,
    getUserById,
} = require('../db');

// POST /api/users/login
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await getUser({ username, password });

        if (user) {
            const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
                expiresIn: '1w',
            });
            res.send({ message: "You're logged in!", token });
        } else {
            next({
                name: 'Incorrect User Credentials',
                message: 'Username or password is incorrect',
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST /api/users/register

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
