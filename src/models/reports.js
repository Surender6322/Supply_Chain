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
    report_data: {
      type: DataTypes.JSON,
    },
  })
  return Report;
}