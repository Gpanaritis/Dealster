module.exports = (sequelize, DataTypes) => {
    const Price_history = sequelize.define('Price_history', {
        date:
        {
            type : DataTypes.DATE,
            allowNull: false
        },
        price:
        {
            type : DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
    }
    );

    // Price_history.associate = (models) => {
    //     Price_history.belongsTo(models.Products, {
    //         foreignKey: 'product_id',
    //         onDelete: 'CASCADE'
    //     });
    // };
    return Price_history;
}