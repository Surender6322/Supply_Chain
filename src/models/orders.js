module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define("orders", {
    user_id: {
      type: DataTypes.INTEGER,
     
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
 
    item_code:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
   
    item_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
 
  return Orders;
};
 