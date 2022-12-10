const client = require('./client');

async function getRoutineById(id){
  //Jaron
}

async function getRoutinesWithoutActivities(){
  //Kelan
}

async function getAllRoutines() {
  //Rae
}

async function getAllRoutinesByUser({username}) {
  //Marty
}

async function getPublicRoutinesByUser({username}) {
  //Kelan
}

async function getAllPublicRoutines() {
  //Marty
}

async function getPublicRoutinesByActivity({id}) {
  //Rae
}

async function createRoutine({creatorId, isPublic, name, goal}) {
  //Jaron
}

async function updateRoutine({id, ...fields}) {
}

async function destroyRoutine(id) {
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}