'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Users = require('./Users')(sequelize, Sequelize);
db.Category = require('./Category')(sequelize, Sequelize);
db.Subcategory = require('./Subcategory')(sequelize, Sequelize);
db.Products = require('./Products')(sequelize, Sequelize);
db.Offers = require('./Offers')(sequelize, Sequelize);
db.Super_markets = require('./Super_markets')(sequelize, Sequelize);
db.Reactions = require('./Reactions')(sequelize, Sequelize);
db.Price_history = require('./Price_history')(sequelize, Sequelize);
db.Roles = require('./Roles')(sequelize, Sequelize);

// associations
db.Category.hasMany(db.Subcategory, { foreignKey: 'category_id', as: 'subcategories' });

db.Offers.hasMany(db.Reactions, { foreignKey: 'offer_id', as: 'reactions' });

db.Products.hasMany(db.Price_history, { foreignKey: 'product_id', as: 'price_history' });
db.Products.hasMany(db.Offers, { foreignKey: 'product_id', as: 'offers' });

db.Products.belongsToMany(db.Subcategory, { through: 'Products_Subcategory', as: 'subcategories', foreignKey: 'product_id' });
db.Subcategory.belongsToMany(db.Products, { through: 'Products_Subcategory', as: 'products', foreignKey: 'subcategory_id' });

db.Products.belongsToMany(db.Super_markets, { through: 'Products_Super_markets', as: 'supermarkets', foreignKey: 'product_id' });
db.Super_markets.belongsToMany(db.Products, { through: 'Products_Super_markets', as: 'products', foreignKey: 'supermarket_id' });

db.Super_markets.hasMany(db.Offers, { foreignKey: 'supermarket_id', as: 'offers' });

db.Users.hasMany(db.Offers, { foreignKey: 'user_id', as: 'offers' });
db.Users.hasMany(db.Reactions, { foreignKey: 'user_id', as: 'reactions' });

db.Roles.belongsToMany(db.Users, { through: 'Users_Roles', as: 'users', foreignKey: 'role_id', otherKey: 'user_id' });
db.Users.belongsToMany(db.Roles, { through: 'Users_Roles', as: 'roles', foreignKey: 'user_id', otherKey: 'role_id' });


module.exports = db;
