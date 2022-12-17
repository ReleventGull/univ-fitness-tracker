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

// GET /api/users/:username/routines

module.exports = router;
