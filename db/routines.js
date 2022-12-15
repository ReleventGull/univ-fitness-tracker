const client = require('./client');

async function getRoutineById(id){
 try {
const {rows: [routine]} = await client.query(`
SELECT * FROM routines
WHERE id=${id};
`)

console.log('routine id', routine.id)
const {rows: [routine_activity]} = await client.query(`
SELECT * FROM routine_activities
WHERE "routineId"=${routine.id};
`)
console.log('The routine activity here', routine_activity)

return routine
 } catch(error) {
  console.log("There was an error getting the rouine by the id")
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
    SELECT * FROM routines;
    `);
    return routines;
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
      SELECT *
      FROM routines
      WHERE "creatorId"= ${user.id};
      `
      
      
    )
     
    return routines;
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
      SELECT *
      FROM routines
      WHERE "creatorId"=$1 AND "isPublic"=true;
    `,
      [user.id]
    );

    return routines;
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
      SELECT *
      FROM routines
      WHERE "isPublic"=true;
    `,
      
    );

    return routines;
  } catch (error) {
    throw error;
  }
  //Marty
}

async function getPublicRoutinesByActivity({id}) {
  //Rae 
  console.log("Getting public routines by activity!")
  try{
    const { rows: [routines] } = await client.query(`
    SELECT *
    FROM routines
    WHERE "isPublic"=${id}`, [id]);
    if(!isPublic) {
      return null;
    }
    activities.routines = await getRoutineById(id);
    return routines;
  }
  catch(error){
    console.log("There was an error getting public routines by activity.")
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
return routine
}catch(error) {
  console.log("There was an error creating a routine")
  throw error
}
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
