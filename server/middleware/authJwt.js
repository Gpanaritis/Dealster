const jwt = require('jsonwebtoken');
const config = process.env;
const { Users } = require('../models');


verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }

  return next();
};

isAdmin = async (req, res, next) => {

  const user = await Users.findOne({ where: { id: req.user.user_id } });
  const roles = await user.getRoles();
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "admin") {
      next();
      return;
    }
  }
  res.status(403).send({
    message: "Require Admin Role!"
  });
  return;
};

getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    return decoded.user_id;
  } catch (err) {
    // Here I want to throw an error
    throw new Error('Invalid Token');
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  getUserIdFromToken: getUserIdFromToken
};

module.exports = authJwt;