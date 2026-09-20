const jwt = require('jsonwebtoken');

/**
 * Generates a JSON Web Token for a given user ID.
 * @param {string} userId - The unique identifier of the user.
 * @returns {string} The generated JWT.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = generateToken;
