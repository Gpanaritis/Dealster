module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
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
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }
    );

    // Category.associate = (models) => {
    //     Category.hasMany(models.Subcategory, {
    //         foreignKey: 'category_id',
    //         as: 'subcategories'
    //     });
    // };
    return Category;
}