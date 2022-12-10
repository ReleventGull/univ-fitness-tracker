const id = require("faker/lib/locales/id_ID");
const client = require("./client")

// database functions
async function getAllActivities() {

}

async function getActivityById(id) {
  
}

async function getActivityByName(name) {
  console.log("Pulling activity by name")
  try{
    const { rows: activitiesIds } = await client.query(`
    SELECT id, name, description
    FROM activities
    WHERE id=$1
    `, [name])
    //return await Promise.all(activitiesIds.map(
    //  activities => getActivityById(activity.id)));
   return activitiesIds 
} catch (error) {
  throw error;
}
} 


// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
}

// return the new activity
async function createActivity({ name, description }) {

}

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {

}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
