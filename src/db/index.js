const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging:false
});

sequelize.authenticate().then(() => {
    console.log('Connected')
}).catch((err) => {
    console.log(err)
})

const db = {}
db.sequelize = sequelize;
db.Sequelize = Sequelize

db.users = require("../models/users")
db.inventory = require("../models/inventory")
db.order = require("../models/orders")
db.shipments = require("../models/shipments")
db.reports = require("../models/reports")

sequelize.sync()
  .then(() => {
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });


module.exports = db