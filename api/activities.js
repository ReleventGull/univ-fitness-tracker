const express = require('express');
const router = express.Router();
const {getAllActivities} = require('../db')


// GET /api/activities/:activityId/routines

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
