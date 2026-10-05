const sequelize = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// User <-> Rating (One-to-Many)
User.hasMany(Rating, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

// Store <-> Rating (One-to-Many)
Store.hasMany(Rating, { foreignKey: 'store_id', onDelete: 'CASCADE' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });

// User (Owner) <-> Store (One-to-Many)
User.hasMany(Store, { foreignKey: 'owner_id', as: 'ownedStores' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

module.exports = { sequelize, User, Store, Rating };
