
const client = require("./client");

// database functions
async function getAllActivities() {
  try {
    const { rows: activities } = await client.query(`
    SELECT * FROM activities;
    `);
    return activities;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const {
      rows: [activities],
    } = await client.query(
      `
        SELECT *
        FROM activities
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

async function getActivityByName(name) {
  console.log("Pulling activity by name");
  try {
    const {
      rows: [activitiesIds],
    } = await client.query(
      `
    SELECT *
    FROM activities
    WHERE name=$1;
    `,
      [name]
    );
    //return await Promise.all(activitiesIds.map(
    //  activities => getActivityById(activity.id)));
    console.log("Act here", activitiesIds);
    return activitiesIds;
  } catch (error) {
    throw error;
  }
}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {

  try {
    const {
      rows: activities,
    } = await client.query(`
      SELECT activities.*, routine_activities.id AS "routineActivityId", routine_activities."routineId", routine_activities.duration, routine_activities.count
      FROM activities
      INNER JOIN routine_activities ON activities.id = routine_activities."activityId";
    `);
   
    
    if(Array.isArray(routines)) {
      for (let i = 0; i < routines.length; i++) {
        routines[i]['activities'] = []
      }

      for (let j = 0; j < routines.length; j++) {
          for(let m = 0; m < activities.length; m++) {
            if (routines[j].id == activities[m].routineId) {
              routines[j]['activities'].push(activities[m])
            }
          }
      }
    }
    return routines
  } catch (error) {
    console.log("An error occured while attaching routines to activities");
    console.log(error)
    throw error;
  }
}

// return the new activity
async function createActivity({ name, description }) {
  try {
    const {
      rows: [activities],
    } = await client.query(
      `
      INSERT INTO activities(name, description)
      VALUES($1, $2)
      RETURNING *;
    `,
      [name, description]
    );

    return activities;
  } catch (error) {
    console.log("An error occured while creating activities");
    throw error;
  }
}

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {

  const descArray = Object.keys(fields)
  let beforeString = descArray.map((key,index) => `${key}=$${index+1}`)
  let [setString] = beforeString
  
  try {
    const {rows: [activity] } = await client.query(`
    UPDATE activities
    SET ${setString}
    WHERE id=$2
    RETURNING *;
    `, [...Object.values(fields), id])
    return activity
  }
  catch(error) {
    throw error
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
