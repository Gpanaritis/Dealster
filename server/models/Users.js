module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username:
        {
            type : DataTypes.STRING,
            allowNull: false
        },
        password:
        {
            type : DataTypes.STRING,
            allowNull: false
        },
        email:
        {
            type : DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        token:
        {
            type : DataTypes.STRING,
            allowNull: true
        },
        points:
        {
            type : DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        monthly_points:
        {
            type : DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }
    );

    // Users.associate = (models) => {
    //     Users.hasMany(models.Reactions, {
    //         foreignKey: 'user_id',
    //         as: 'reactions'
    //     });

    //     Users.hasMany(models.Offers, {
    //         foreignKey: 'user_id',
    //         as: 'offers'
    //     });
    // };


    return Users;
};