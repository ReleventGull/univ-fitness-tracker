const express = require('express');
const router = express.Router();
const {
    getAllPublicRoutines,
    createRoutine,
    updateRoutine,
    destroyRoutine,
    addActivityToRoutine
} = require('../db')

// GET /api/routines
//NOTE - Return a list of public routines, include the activities with them
router.get('/routines', async(req, res, next) => {
    try {
        const publicRoutines = await getAllPublicRoutines()
        res.send(publicRoutines)
    }catch(error) {
        console.log("There was an error getting all public routines.");
        next(error)
    }
});

// POST /api/routines
//NOTE Create a new routine
router.post('/routines', async(req, res, next) => {
    try {
        const {name, goal, isPublic, creatorId} = req.body;
        const newRoutine = await createRoutine({
            name, 
            goal,
            isPublic, 
            creatorId
        });
        res.send(newRoutine);
    } catch(error) {
        console.log("There was an error creating a new routine.");
        next(error);
    }
});

// PATCH /api/routines/:routineId
//NOTE - Update a routine, notably change public/private, the name, or the goal
router.patch('/routines/:routineId', async(req, res, next) => {
    try {
        const {routineId} = req.params;
        const {name, goal, isPublic} = req.body;
        const updatedRoutine = await updateRoutine({id: routineId, name, goal, isPublic});
        res.send(updatedRoutine);
    } catch(error) {
        console.log("There was an error updating a routine.");
        next(error);
    }
});

// DELETE /api/routines/:routineId
//NOTE - Hard delete a routine. Make sure to delete all the routineActivities whose routine is the one being deleted.
router.delete('/routines/:routineId', async(req, res, next) => {
    try {
        const {routineId} = req.params;
        console.log("routineId", routineId)
        const deletedRoutine = await destroyRoutine(routineId);
        res.send(deletedRoutine);
    } catch(error) {
        console.log("There was an error deleting a routine.");
        next(error);
    }
});

// POST /api/routines/:routineId/activities
//NOTE - Attach a single activity to a routine. Prevent duplication on (routineId, activityId) pair.
router.post('/routines/:routineId/activities', async(req, res, next) => {
    try {
        const {routineId} = req.params;
        const {activityId, count, duration} = req.body;
        const newRoutineActivity = await addActivityToRoutine({routineId, activityId, count, duration})
        res.send(newRoutineActivity);
    } catch(error) {
        console.log("There was an error adding an activity to a routine.");
        next(error);
    }
});

module.exports = router;
