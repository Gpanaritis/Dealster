module.exports = (sequelize, DataTypes) => {
    const Super_markets = sequelize.define('Super_markets', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:
        {
            type : DataTypes.STRING,
            allowNull: false
        },
        latitude:
        {
            type : DataTypes.DECIMAL(10, 8),
            allowNull: false
        },
        longitude:
        {
            type : DataTypes.DECIMAL(11, 8),
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }
    );

    Super_markets.associate = (models) => {
        Super_markets.hasMany(models.Offers, {
            foreignKey: 'super_market_id',
            as: 'offers'
        });
    };

    return Super_markets;
}