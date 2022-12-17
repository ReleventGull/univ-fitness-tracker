const express = require('express');
const router = express.Router();


// POST /api/users/login

// POST /api/users/register

// GET /api/users/me

router.get('/me', async (req, res, next) => {
    //test
    
    //const getUsers = await getUserByUsername()
    try{
        const {users} = req.params
        console.log("heh", users)
        const getUser = await getUserByUsername(users)
        res.send({ users })
    } catch (error){
        next(error);
    }
})

// GET /api/users/:username/routines

module.exports = router;
