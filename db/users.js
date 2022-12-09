/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  
}

async function getUser({ username, password }) {

  try {
    const { rows: [ user ] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1
    `, [username]);

    if (!user) {
      throw new Error("Username incorrect, please try again.");
    }

    if (user.password != password) {
     throw new Error("Password incorrect, please try again.");
    }

    return "User does not exist";
  } catch (error) {
    throw error;
  }
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
