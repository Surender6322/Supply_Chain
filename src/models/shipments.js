module.exports = (sequelize, DataTypes) => {
    const Shipment = sequelize.define('Shipment', {
        destination: {
            type: DataTypes.STRING,
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