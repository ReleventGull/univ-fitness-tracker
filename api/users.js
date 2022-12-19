const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const SALT_COUNT = 10

const { 
    getUser,
    createUser,
    getUserByUsername,
    getUserById,
    getPublicRoutinesByUser
} = require('../db');

// POST /api/users/login
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        const user = await getUser({ username: username, password:password});

        if (user) {
            const token = jwt.sign({ id: user.id, username: username }, process.env.JWT_SECRET, {
                expiresIn: '1w',
            });
            res.send({ message: "you're logged in!", user:user, token:token });
        } else {
            next({
                name: 'Incorrect User Credentials',
                message: `User ${username} does not exist`,
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST /api/users/register

router.post('/register', async (req, res, next) => {
    try {
        const {username, password} = req.body
        const _user = await getUserByUsername(username)
        if(_user) {
           next({
                name: `User ${username} is already taken.`, 
                message: `User ${username} is already taken.`,
              });
        }
        if(password.length < 8) {
            next({
                name:`Password Too Short!`,
                message:`Password Too Short!`
            })
        }
        const user = await createUser({username: username, password: password})
        const token = jwt.sign({id: user.id, username: username}, JWT_SECRET, {expiresIn: '1w'})
        console.log('new user here', user)
        res.send({message: "Success", token: token, user: user })
    }catch(error) {
        next(error)
    }
})

// GET /api/users/me


router.get('/me', async (req, res, next) => {
    try{
        const auth = req.header('Authorization')

        if(!auth) {
        res.status(401)
        next({
        name:"You must be logged in to perform this action",
        message:"You must be logged in to perform this action"
         })
        }
        const token = auth.slice(7)
        console.log('Token is here', token)
        const {username} = jwt.verify(token, JWT_SECRET)
        const gettingUser = await getUserByUsername(username)
        console.log('The user is here', gettingUser)
        res.send(gettingUser)
    } catch(error){
        next(error);
        //descontsruct token & validate token
    }
})

// GET /api/users/:username/routines

router.get('/:username/routines', async(req, res, next) => {
    try {
        const {username} = req.params
        console.log("BRUH", username)
        const publicRoutines = await getPublicRoutinesByUser({username: username})
        res.send(publicRoutines)
    }catch(error) {
        next(error)
    }
})




module.exports = router;
