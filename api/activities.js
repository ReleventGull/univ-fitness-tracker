const express = require('express');
const id = require('faker/lib/locales/id_ID');
const router = express.Router();
const {getAllActivities, getActivityById, getPublicRoutinesByActivity, getUser, updateActivity} = require('../db')


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

router.post('/', async (req, res, next) => {
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
        
    }
})

// PATCH /api/activities/:activityId

router.patch("/:activityId", getUser, async (req, res, next) => {
    const { activityId } = req.params;
    const { name, description } = req.body;
  
    const updateFields = {};
  
    

  
    if (name) {
      updateFields.name = name;
    }
  
    if (description) {
      updateFields.description = description;
    }
  
    try {
      const originalActivity = await getActivityById(activityId);
  
      if (originalActivity.user.id === req.user.id) {
        const updatedActivity = await updateActivity(activityId, updateFields);
        res.send({ allActivities: updatedActivity });
      } else {
        next({
          name: "UnauthorizedUserError",
          message: "You cannot update an activity that is not yours",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

module.exports = router;
