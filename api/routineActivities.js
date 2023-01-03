const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env
const { updateRoutineActivity, getRoutineActivityById, destroyRoutineActivity, getUserByUsername, getRoutineById, getUserById} = require('../db');
;
// const { requireUser } = require('./missinguser');


router.patch('/:routineActivityId', async (req, res, next) => {
  try {
  const auth = req.header('Authorization')
  if(!auth) {
    res.status(401)
    next({
    name:"You must be logged in to perform this action",
    message:"You must be logged in to perform this action"
     })
    }
    const token = auth.slice(7)
    console.log('Token is here', token)
    const {id, username} = jwt.verify(token, JWT_SECRET)
   
    const _user = await getUserById(id)
    console.log('USERBRO', _user)

    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const routineActivityToEdit = await getRoutineActivityById(routineActivityId)
    console.log('bruh', routineActivityToEdit)
    const routineCheckId = await getRoutineById(routineActivityToEdit.routineId)
    if(id === routineCheckId.creatorId) {
     const {routineActivityId} = req.params
      let updateObject = {}
      updateObject.id = routineActivityId
      
      if (count) {
        updateObject.count = count
      }
      if(duration) {
        updateObject.duration = duration
      }
      console.log('Yo im here', updateObject)
      const updatedRoutineActivity = await updateRoutineActivity(updateObject)
      console.log("UPDATED HERE", updatedRoutineActivity)
      res.send(updatedRoutineActivity)
    }else {
      next({
        name: "Unathorized",
        message: `User ${username} is not allowed to update ${routineCheckId.name}`
      })
    }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });


// DELETE /api/routine_activities/:routineActivityId


router.delete('/:routineActivityId', async (req, res, next) => {
    try {
      const auth = req.header('Authorization')
  if(!auth) {
    res.status(401)
    next({
    name:"You must be logged in to perform this action",
    message:"You must be logged in to perform this action"
     })
    }
    const token = auth.slice(7)
   
    const {username} = jwt.verify(token, JWT_SECRET) 
    const _user = await getUserByUsername(username)
      
    const { routineActivityId } = req.params;
    const gettingRA = await getRoutineActivityById(routineActivityId);
     
    const routine = await getRoutineById(gettingRA.routineId)
     
    if(_user.id != routine.creatorId) {
       
      next({
        name: `User ${username} is not allowed to delete ${routine.name}`,
         message: `User ${username} is not allowed to delete ${routine.name}`
        })
     }
     if(_user.id == routine.creatorId) {
      
      const destroyedRoutine = await destroyRoutineActivity(routineActivityId)
      res.send(destroyedRoutine)
      }
  } catch ({ name, message }) {
    next({ name, message })
   }
  });

module.exports = router;
