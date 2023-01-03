/* eslint-disable no-useless-catch */
const client = require("./client");
const bcrypt = require('bcrypt')
const SALT_COUNT = 10
// database functions

// user functions
async function createUser({ username, password }) {
 const hashPassword = await bcrypt.hash(password, SALT_COUNT)

  try {
  const {rows: [user]} = await client.query(`
  INSERT INTO users (username, password)
  VALUES ($1, $2)
  RETURNING *;
  `, [username, hashPassword])

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
    
    let passwordsMatch = await bcrypt.compare(password, user.password)
  
    if (!passwordsMatch) {
      return false
     }
     else {
      delete user.password
      return user
     }

  
    
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
  console.log(userName)
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
      console.log("USER IS HERE", user)
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
