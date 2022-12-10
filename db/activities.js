const client = require("./client")

// database functions
async function getAllActivities() {

}

async function getActivityById(id) {
  
}

async function getActivityByName(name) {

}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
  try {
    const { rows: [activities] } = await client.query(`
      SELECT *
      FROM activities;
    `);
    return activities;
  } catch {
    console.log("An error occured while attaching routines to activities")
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
