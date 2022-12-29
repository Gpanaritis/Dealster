module.exports = (sequelize, DataTypes) => {
    const Offers = sequelize.define('Offers', {
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
        price:
        {
            type : DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        stock:
        {
            type : DataTypes.BOOLEAN,
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }
    );

    // Offers.associate = (models) => {
    //     Offers.hasMany(models.Reactions, {
    //         foreignKey: 'offer_id',
    //         as: 'reactions'
    //     });
    // };
    return Offers;
}