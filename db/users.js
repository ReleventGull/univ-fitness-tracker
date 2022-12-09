const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
  const {rows: users} = await client.query(`
  INSERT INTO users (name, password)
  VALUES ($1, $2)
  RETURNING *;
  `, [username, password])
  console.log(users)
  return users
  }catch(error) {
    console.log("There was an error creating users....")
  }

}

async function getUser({ username, password }) {

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
