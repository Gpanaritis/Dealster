module.exports = (sequelize, DataTypes) => {
    const Reactions = sequelize.define('Reactions', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        reaction:
        {
            type : DataTypes.STRING,
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }
    );

    return Reactions;
}