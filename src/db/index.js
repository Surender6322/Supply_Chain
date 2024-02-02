const {Sequelize, DataTypes} = require('sequelize');
const shipments = require('../models/shipments');
const orders = require('../models/orders');

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

db.users = require("../models/users")(sequelize,DataTypes)
db.inventory = require("../models/inventory")(sequelize,DataTypes)
db.order = require("../models/orders")(sequelize,DataTypes)
db.shipments = require("../models/shipments")(sequelize,DataTypes)
db.reports = require("../models/reports")(sequelize,DataTypes)
 
// one to many b/w users and reports
db.users.hasMany(db.reports,{foreignKey:'userId'})
db.reports.belongsTo(db.users,{foreignKey:'userId'})

// one to many b/w users and shipments
db.users.hasMany(db.shipments,{foreignKey:'userId'})
db.shipments.belongsTo(db.users,{foreignKey:'userId'})

// one to one b/w orders and shipments
db.order.hasOne(db.shipments, {foreignKey: 'orderId' });
db.shipments.belongsTo(db.order, {foreignKey: 'orderId' });

sequelize.sync({force:false})
  .then(() => {
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });


module.exports = db