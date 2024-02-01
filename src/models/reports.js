module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    userId:{
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    report_type: {
      type: DataTypes.ENUM('Inventory', 'Shipment'),
    },
    generated_date: {
      type: DataTypes.DATE,
    },
    total_value: {
      type: DataTypes.FLOAT,
    },
    report_data: {
      type: DataTypes.TEXT, // or DataTypes.JSON if using JSON
    },
  })
  return Report;
}