module.exports = (sequelize, DataTypes) => {
    const Inventory = sequelize.define('Inventory', {
        item_name: {
            type: DataTypes.STRING,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true, // Ensure it is an integer
                min: 0,
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2), //10 digits in total with 2 decimal places
            allowNull: false,
            validate: {
                isDecimal: true,
                min: 0,
            }
        },
        supplier: {
            type: DataTypes.STRING,
        },
    });
    return Inventory
}