const client = require('./client');
const {attachActivitiesToRoutines} = require('./activities');


async function getRoutineById(id){
 try {
  console.log('Ths id being passed in',)
const {rows: [routine]} = await client.query(`
SELECT routines.*, users.username AS "creatorName"
FROM
routines
JOIN users
ON routines."creatorId"=users.id
WHERE routines.id=$1;
`, [id]) 

return attachActivitiesToRoutines(routine) 
 } catch(error) {
  console.log("There was an error getting the rouine by the id")
  console.log(error)
  throw error
 }
}

async function getRoutinesWithoutActivities(){
  try {
    const {rows: routines} = await client.query(`
      SELECT *
      FROM routines;
    `);
    
    return routines;
  } catch(error) {
    console.log("There was an error getting the routines without activities");
    throw error;
  }
}

async function getAllRoutines() {
  //Rae
  try {
    console.log("Pulling all routines!")
    const { rows: routines } = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM
  routines
  JOIN users
  ON routines."creatorId"=users.id;
    `);
    
    return  attachActivitiesToRoutines(routines)
  } catch (error) {
    console.log("There was an error pulling all routines.")
    throw error;
  }
}

async function getAllRoutinesByUser({username}) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [username]
    );

    const {
      rows: routines,
    } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM
      routines
      JOIN users
      ON routines."creatorId"=users.id
      WHERE "creatorId"= ${user.id};
      `)
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log("There was an error getting routines by user")
    throw error;
  }
}

async function getPublicRoutinesByUser({username}) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [username]
    );
    
    const {
      rows: routines,
    } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM
      routines
      JOIN users
      ON routines."creatorId"=users.id
      WHERE "creatorId"=$1 AND "isPublic"=true;
    `,
      [user.id]
    );

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log("There was an error getting the public routines by user");
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const {
      rows: routines,
    } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM
    routines
    JOIN users
    ON routines."creatorId"=users.id
    WHERE "isPublic"=true;
    `,

    );

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
  //Marty
}

async function getPublicRoutinesByActivity({id}) {
  //Rae 
  console.log("Getting public routines by activity!")
  try{
    const { rows: [routine_activity] } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE "activityId"=$1;`, [id]);
  
    if(!routine_activity) {
      return undefined
    }
  const {rows: routines} = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM
  routines
  JOIN users
  ON routines."creatorId"=users.id
  WHERE routines.id=${routine_activity.routineId};
  `)
  
return attachActivitiesToRoutines(routines)
}catch(error){
    console.log("There was an error getting public routines by activity.")
    console.log(error)
    throw error;
  }
}


async function createRoutine({creatorId, isPublic, name, goal}) {
try {
const {rows: [routine]} = await client.query(`
INSERT INTO routines (name, goal, "creatorId", "isPublic")
VALUES ($1, $2, $3, $4)
RETURNING *;
`, [name, goal, creatorId, isPublic])

const {rows: [routineWithname]} = await client.query(`
SELECT routines.*, users.username AS "creatorName"
FROM
routines
JOIN users
ON routines."creatorId"=users.id
WHERE routines.id=$1;
`, [routine.id])
return routineWithname
}catch(error) {
  console.log("There was an error creating a routine")
  console.log(error)
  throw error
}
}

async function updateRoutine({id, ...fields}) {
  try {
    if (!Object.values(fields)) {
      return false
    }
    const keys = Object.keys(fields)
    
    const beforeString = keys.map((word, index) => `"${word}"=$${index+2}`)
  
    
    
    const setString = beforeString.join(', ')
    console.log(setString)
    
    const {rows: [routine]} = await client.query(`
    UPDATE routines
    SET ${setString}
    WHERE id=$1
    RETURNING *;
    `, [id, ...Object.values(fields)])
    return routine
  }catch(error) {
    console.log("There was an error updating routine")
    console.log(error)
    throw error
  }
}

async function destroyRoutine(id) {
  try {
    const {rows: [destroyedRoutineActivities]} = await client.query(`
    DELETE 
    FROM routine_activities
    WHERE "routineId"=$1
    RETURNING *;
    `,[id])
    
    const {rows: [destroyedRoutine]} = await client.query(`
    DELETE 
    FROM routines
    WHERE id=$1
    RETURNING *;
    `,[id])
    return destroyedRoutine;
  }catch(error) {
    console.log("There was an error trying to destroy the routine")
    throw error
  }
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
