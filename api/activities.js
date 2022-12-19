const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const router = express.Router();
const {getAllActivities, getPublicRoutinesByActivity, getActivityById, updateActivity, createActivity, getActivityByName} = require('../db')


// GET /api/activities/:activityId/routines

router.get('/:activityId/routines', async(req, res, next) => {
    try {
        const {activityId} = req.params
        console.log("AHHHH", activityId)
        const publicRoutinesByActivity = await getPublicRoutinesByActivity({id: activityId})
        console.log('Result', publicRoutinesByActivity)
        if(!publicRoutinesByActivity) {
            next({
                    name:`Activity ${activityId} not found`,
                    message: `Activity ${activityId} not found`
            })
        }
        console.log("WTF", publicRoutinesByActivity)
        res.send(publicRoutinesByActivity)
    }catch(error) {
        next(error)
    }
})

// GET /api/activities

router.get('/', async(req, res, next) => {
    try {
        const allActivities = await getAllActivities()
        res.send(allActivities)
    }catch(error) {
        next(error)
    }
})


// POST /api/activities

router.post('/', async (req, res, next) => {
    try{
        const auth = req.header('Authorization')
        console.log("AUTHOR", auth)
        if(!auth) {
            res.status(401)
     next({
        name:'AuthoizationError',
        message:'You are not authorized'
     })
}
        const token = auth.slice(7)
        const {username} = jwt.verify(token, JWT_SECRET)
        if (!username) {
            next({
                name: "You are not logged in",
                message: "You are not logged in"
            })
        }
        const {name, description} = req.body
        const existingActivity = await getActivityByName(name)
        if(existingActivity) {
            next({
                name:  `An activity with name ${name} already exists`,
                message:  `An activity with name ${name} already exists`
            })
        }
        
        const newActivity = await createActivity({name: name, description: description})
        res.send(newActivity)
    } catch(error){
        next(error);
        
    }
})

// PATCH /api/activities/:activityId

router.patch("/:activityId", async (req, res, next) => {
    try {
        const auth = req.header('Authorization')
        if(!auth) {
            res.status(401)
     next({
        name:'AuthoizationError',
        message:'You are not authorized'
     })
    }
        const token = auth.slice(7)
        console.log("TOKEN HERE", token)
        const {username} = jwt.verify(token, JWT_SECRET)
        if (!username) {
            next({
                name: "You are not logged in",
                message: "You are not logged in"
            })
        }
    
    const {activityId} = req.params    
    const checkIfExist = await getActivityById(activityId)
    console.log('EXISTS BY ID', checkIfExist)
    
    if(!checkIfExist) {
        next({
               name:  `Activity ${activityId} not found`,
              message:  `Activity ${activityId} not found`
          })
     }
        
    const {name, description} = req.body
    
    const existingActivity = await getActivityByName(name)
    
    if(existingActivity) {
        next({
            name:  `An activity with name ${name} already exists`,
            message:  `An activity with name ${name} already exists`
        })
    }

    let updateFields = {}
    updateFields['name'] = name
    updateFields['description'] = description
    const updatedActivity = await updateActivity({id: activityId, ...updateFields})
    res.send(updatedActivity)
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

module.exports = router;
