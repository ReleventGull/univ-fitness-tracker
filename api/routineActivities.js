const express = require('express');
const router = express.Router();
const { getRoutineActivityById, updateRoutineActivity, destroyRoutineActivity } = require('../db');
const { requireUser } = require('./missinguser');


// PATCH /api/routine_activities/:routineActivityId
//routine_activities = posts
//routineActivityId = Id
//tags

router.patch('/:routineActivityId', requireUser, async (req, res, next) => {

    const { routineActivityId } = req.params;
    //const { title, content, tags } = req.body;
    const { count, duration } = req.body;
  
    const updateCount = {};
  
    if (count) {
      updateCount.count = count;
    }
  
    if (duration) {
      updateCount.duration = duration;
    }
  
    try {
      const ogRoutineActivity = await getRoutineActivityById(routineActivityId);
  
      if (ogRoutineActivity.routineId.activityId.id === req.user.id) {
        const updateRoutineActivity = await updateRoutineActivity(routineActivityId, updateCount);
        res.send({ routine_activities: updateRoutineActivity })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update routine activities that are not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });


// DELETE /api/routine_activities/:routineActivityId


router.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
      const gettingRA = await getRoutineActivityById(req.params.routineActivityId);
  
      if (gettingRA && gettingRA.routineId.activityId.id === req.user.id) {
        const updateRoutineActivity = await destroyRoutineActivity(gettingRA.id, { active: false });
  
        res.send({ routine_activities: updateRoutineActivity });
      } else {
        // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
        next( gettingRA ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete routine activites that are not yours"
        } : {
          name: "RoutineActivitiesNotFoundError",
          message: "That routine activity does not exist"
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });

module.exports = router;
