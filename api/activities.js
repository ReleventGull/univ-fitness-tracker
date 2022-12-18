const express = require('express');
const id = require('faker/lib/locales/id_ID');
const router = express.Router();
const {getAllActivities, getActivityById, getPublicRoutinesByActivity} = require('../db')


// GET /api/activities/:activityId/routines

router.get('/:activityId/routines', async(req, res, next) => {
    try {
        const {activityId} = req.params
        console.log("AHHHH", activityId)
        const publicRoutinesByActivity = await getPublicRoutinesByActivity({id: activityId})
        console.log('Result', publicRoutinesByActivity)
        if(!publicRoutinesByActivity) {
            next({
                message: 'Activity not found',
                    name:'InvalidExpression',
                    error: 'That activity does not exists'
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

// PATCH /api/activities/:activityId

module.exports = router;
