/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
  const {rows: [user]} = await client.query(`
  INSERT INTO users (username, password)
  VALUES ($1, $2)
  RETURNING *;
  `, [username, password])

  delete user.password
  return user
  }catch(error) {
    console.log("There was an error creating users....")
  }

}

async function getUser({ username, password }) {

  try {
    const { rows: [ user ] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
    `, [username]);

    if (!user) {
      throw new Error("Username incorrect, please try again.");
    }

    if (user.password !== password) {
     throw new Error("Password incorrect, please try again.");
    } 
    
    delete user.password
    return user
    
  } catch (error) {
    throw error;
  }
}


async function getUserById(userId) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT id, username
      FROM users
      WHERE id=$1;
    `, [userId]);

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
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [userName]
    );

    return user;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
