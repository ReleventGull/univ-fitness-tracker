const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;


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
            res.send({ message: "You're logged in!", user:user, token:token });
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

router.post('/register', async (req, res, next) => {
    try {
        console.log('The body', req.body)
        const {username, password} = req.body
        const existingUser = await getUserByUsername(username)
        console.log("Exising user", existingUser)
        if(existingUser) {
           next({
                error: res.body,
                name: "IncorrectCredentialsError",
                message: `A user by that username already exists.`,
              });
        }else if (password.length < 8) {
            next('Password Too Short!')
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
            console.log("There is one that failed")
            res.status(401)
     next({
        name:'AuthoizationError',
        message:'You are not authorized'
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
