module.exports = (sequelize,DataTypes) => {
    const Order = sequelize.define('order', {
        order_date: {
          type: DataTypes.DATE,
        },
      })
      return Order
}