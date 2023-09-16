module.exports = (sequelize, DataTypes) => {
    const Price_history = sequelize.define('Price_history', {
        price:
        {
            type : DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
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