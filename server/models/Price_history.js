module.exports = (sequelize, DataTypes) => {
    const Price_history = sequelize.define('Price_history', {
        price:
        {
            type : DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_DATE')
        }
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