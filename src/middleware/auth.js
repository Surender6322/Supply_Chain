const jwt = require("jsonwebtoken");
const db = require("../db/index");
const Users = db.users;
const { Op, literal } = require("sequelize");
 
const auth = async (req, res, next) => {
  try {
    // console.log("I am here");
 
    const existingUsersCount = await Users.count();
    // console.log(existingUsersCount);
    if (existingUsersCount === 0 && req.body.role === "Manager") {
      next();
      return;
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const user = await Users.findOne({
      where: {
        id: decoded.id,
        [Op.and]: literal(
          `JSON_CONTAINS(tokens, '${JSON.stringify({ token: token })}')`
        ),
      },
    });
    // console.log(user);
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    // console.log(e);
    return res.status(404).send({ error: "Please authenticate" });
  }
};
 
module.exports = auth;
 