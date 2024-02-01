module.exports = (sequelize, DataTypes) => {
    const Shipment = sequelize.define('shipment', {
        
        orderId : {
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        destination: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        shipment_date: {
            type: DataTypes.DATE,
        },
        expected_delivery: {
            type: DataTypes.DATE,
        },
        status: {
            type: DataTypes.ENUM('In Transit', 'Delayed', 'Delivered'),
        },
        current_location: {
            type: DataTypes.STRING,
        },
    });
    return Shipment

}