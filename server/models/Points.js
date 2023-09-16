module.exports = (sequelize, DataTypes) => {
    const Points = sequelize.define('Points', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        points:
        {
            type : DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            required: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }
    );

    return Points;
}

