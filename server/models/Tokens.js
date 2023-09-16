module.exports = (sequelize, DataTypes) => {
    const Tokens = sequelize.define('Tokens', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tokens:
        {
            type : DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            required: true,
            validate: {
                min: 0
            }
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }
    );

    return Tokens;
}