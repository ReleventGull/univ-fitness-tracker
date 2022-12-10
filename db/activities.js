const id = require("faker/lib/locales/id_ID");
const client = require("./client")

// database functions
async function getAllActivities() {
  try {
    const {rows: activities} = await client.query(`
    SELECT * FROM activities;
    `)
    return activities
  }catch(error) {
    throw error
  }

}

async function getActivityById(id) {
  
}

async function getActivityByName(name) {
  console.log("Pulling activity by name")
  try{
    const { rows: [activitiesIds] } = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1;
    `, [name])
    //return await Promise.all(activitiesIds.map(
    //  activities => getActivityById(activity.id)));
    console.log("Act here lmao", activitiesIds)
   return activitiesIds 
} catch (error) {
  throw error;
}
} 


// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
  try {
    const { rows: [activities] } = await client.query(`
      SELECT *
      FROM activities;
    `);
    return activities;
  } catch(error) {
    console.log("An error occured while attaching routines to activities")
    throw error
  }
}

// return the new activity
async function createActivity({ name, description }) {
  try {
    const { rows: [activities] } = await client.query(`
      INSERT INTO activities(name, description)
      VALUES($1, $2)
      RETURNING *;
    `, [name, description]);

    return activities;
  } catch (error) {
    console.log("An error occured while creating activities")
    throw error;
  }
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
