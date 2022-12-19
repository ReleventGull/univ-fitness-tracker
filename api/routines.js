const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const router = express.Router();
const {
    getAllPublicRoutines,
    getRoutineById,
    createRoutine,
    updateRoutine,
    destroyRoutine,
    addActivityToRoutine,
    getRoutineActivitiesByRoutine
} = require('../db')

// GET /api/routines
router.get('/', async(req, res, next) => {
    try {
        const publicRoutines = await getAllPublicRoutines()
        res.send(publicRoutines)
    }catch(error) {
        console.log("There was an error getting all public routines.");
        next(error)
    }
});

// POST /api/routines
router.post('/', async(req, res, next) => {
    try {
        const auth = req.header('Authorization')
        if (!auth) {
            res.status(401)
            next({
                name: "AuthorizationError",
                message: "You must be logged in to perform this action"
            })
        }
        const token = auth.slice(7)
        const { id }  = jwt.verify(token, JWT_SECRET)
        if (!id) {
            next({
                name: "AuthorizationError",
                message: "You must be logged in to perform this action"
            })
        }
        const {name, goal, isPublic} = req.body;
        const newRoutine = await createRoutine({creatorId: id, name: name, goal: goal, isPublic: isPublic});
        res.send(newRoutine);
    } catch(error) {
        console.log("There was an error creating a new routine.");
        next(error);
    }
});

// PATCH /api/routines/:routineId
router.patch('/:routineId', async(req, res, next) => {
    try {
        const auth = req.header('Authorization')
        if (!auth) {
            res.status(401)
            next({
                name: "You are not logged in",
                message: "You must be logged in to perform this action"
            })
        }
        const token = auth.slice(7)
        const {id, username} = jwt.verify(token, JWT_SECRET)
        if (!username) {
            next({
                name: "You are not logged in",
                message: "You must be logged in to perform this action"
            })
        }
        console.log("Updating a routine")
        const {routineId} = req.params;
        const verifyRoutine = await getRoutineById(routineId);
        if (verifyRoutine.creatorId != id) {
            next({
                name: `User ${username} is not allowed to update ${verifyRoutine.name}`,
                message: `User ${username} is not allowed to update ${verifyRoutine.name}`
            })
        }
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
router.delete('/:routineId', async(req, res, next) => {
    try {
        // returns a 403 when the user deletes a routine that isn't theirs
        const auth = req.header('Authorization')
        if(!auth) {
            res.status(403)
            next({
                name:'AuthorizationError',
                message:'You are not authorized'
            })
        }
        const token = auth.slice(7)

        const {id, username} = jwt.verify(token, JWT_SECRET)
        const {routineId} = req.params;

        const routine = await getRoutineById(routineId)

        if(routine.creatorId !== id) {
            res.status(403)
            next({
                name:'AuthorizationError',
                message:'You are not authorized'
            })
        }
        const deletedRoutine = await destroyRoutine(routineId);
        console.log("deletedRoutine", deletedRoutine);
        res.send(deletedRoutine);
    } catch(error) {
        console.log("There was an error deleting a routine.");
        next(error);
    }
});

// POST /api/routines/:routineId/activities
//NOTE - Attach a single activity to a routine. 
// Prevent duplication on (routineId, activityId) pair.
router.post('/:routineId/activities', async(req, res, next) => {
    try {
        const {routineId} = req.params;
        const existingRoutineActivities = await getRoutineActivitiesByRoutine(routineId);
        console.log("routineId", routineId);

        const {activityId, count, duration} = req.body;
        console.log("activityId", activityId);

        if (existingRoutineActivities.activityId == activityId) {
            next({
                name: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
                message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`
            })
        }
        const newRoutineActivity = await addActivityToRoutine({
            routineId: routineId, 
            activityId: activityId, 
            count: count, 
            duration: duration
        })
        res.send(newRoutineActivity);
    } catch(error) {
        console.log("There was an error adding an activity to a routine.");
        next(error);
    }
});

module.exports = router;
