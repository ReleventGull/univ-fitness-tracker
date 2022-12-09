const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  
}

async function getUser({ username, password }) {

}


async function getUserById(userId) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT id, username,
      FROM users
      WHERE id=${ userId }
    `);

    if (!user) {
      return null
    }

    //user.posts = await getRoutinesByUser(userId);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
