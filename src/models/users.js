const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isLongEnough(value) {
          if (value.length < 8) {
            throw new Error("Password should be at least 8 characters long !!");
          }
        },
        isNotPassword(value) {
          if (value.toLowerCase() === "password") {
            throw new Error('Password cannot be "password !!"');
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM('Staff', 'Manager', 'Customer'),
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tokens: {
      type: DataTypes.JSON,
      defaultValue: [],
      allownull: false,
    },
  });

  User.beforeCreate(async (user, options) => {
    user.name = user.name.trim();
    user.email = user.email.trim();
    user.password = await bcrypt.hash(user.password, 8);
  });

  User.beforeUpdate(async (user, options) => {
    if (user.changed("password")) {
      user.password = user.password.trim();
      user.password = await bcrypt.hash(user.password, 8);
    }
  });

  User.prototype.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });

    const existingTokens = user.getDataValue("tokens");

    existingTokens.push({ token });

    await User.update({ tokens: existingTokens }, { where: { id: user.id } });
    return token;
  };

  User.findByCredentials = async (email, password) => {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new Error("Unable to login !!")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new Error("Unable to login !!")
    }

    return user
  }

  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;          //deleted password from the response
    delete values.tokens;
    return values;
  };

  return User;
};