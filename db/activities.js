const client = require("./client");

// database functions
async function getAllActivities() {}

async function getActivityById(id) {
  try {
    const {
      rows: [activities],
    } = await client.query(
      `
      SELECT id, name, description,
      FROM activities,
      WHERE id=$1;
    `,
      [id]
    );

    if (!activities) {
      return null;
    }

    return activities;
  } catch (error) {
    throw error;
  }
}

async function getActivityByName(name) {}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {}

// return the new activity
async function createActivity({ name, description }) {}

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
