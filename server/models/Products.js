module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define('Products', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:
        {
            type: DataTypes.STRING,
            allowNull: false
        },
        price:
        {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }
    );
    // Products.associate = (models) => {
    //     Products.hasMany(models.Offers, {
    //         foreignKey: 'product_id',
    //         as: 'offers'
    //     });
    //     Products.belongsToMany(models.Subcategory, {
    //         through: 'Products_Subcategory',
    //         as: 'subcategories',
    //         foreignKey: 'product_id'
    //     });
    //     Products.belongsToMany(models.Super_markets, {
    //         through: 'Products_Super_markets',
    //         as: 'super_markets',
    //         foreignKey: 'super_market_id'
    //     });
    // };
    return Products;
}