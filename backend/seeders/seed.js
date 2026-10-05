require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Store, Rating } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected.');

    await sequelize.sync({ force: true });
    console.log('✓ Tables recreated.');

    // ── Create Admin User ──
    const adminPassword = await bcrypt.hash('Admin@1234', 12);
    const admin = await User.create({
      name: 'System Administrator User',
      email: 'admin@admin.com',
      password: adminPassword,
      address: '123 Admin Street, Admin City, Admin State 10001',
      role: 'admin'
    });

    // ── Create Store Owners ──
    const ownerPassword = await bcrypt.hash('Owner@1234', 12);
    const owner1 = await User.create({
      name: 'Premium Coffee Store Owner',
      email: 'owner1@store.com',
      password: ownerPassword,
      address: '456 Coffee Lane, Brew City, BC 20002',
      role: 'store_owner'
    });

    const owner2 = await User.create({
      name: 'Electronics Megastore Owner',
      email: 'owner2@store.com',
      password: ownerPassword,
      address: '789 Tech Boulevard, Silicon Valley, CA 30003',
      role: 'store_owner'
    });

    // ── Create Normal Users ──
    const userPassword = await bcrypt.hash('User@12345', 12);
    const user1 = await User.create({
      name: 'Regular Application User One',
      email: 'user1@user.com',
      password: userPassword,
      address: '101 User Avenue, User Town, UT 40004',
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Regular Application User Two',
      email: 'user2@user.com',
      password: userPassword,
      address: '202 Member Street, Member City, MC 50005',
      role: 'user'
    });

    const user3 = await User.create({
      name: 'Regular Application User Three',
      email: 'user3@user.com',
      password: userPassword,
      address: '303 Visitor Road, Guest Village, GV 60006',
      role: 'user'
    });

    console.log('✓ Users created.');

    // ── Create Stores ──
    const store1 = await Store.create({
      name: 'Premium Coffee House Store',
      email: 'coffee@store.com',
      address: '456 Coffee Lane, Brew City, BC 20002',
      owner_id: owner1.id
    });

    const store2 = await Store.create({
      name: 'Electronics Megastore Outlet',
      email: 'electronics@store.com',
      address: '789 Tech Boulevard, Silicon Valley, CA 30003',
      owner_id: owner2.id
    });

    const store3 = await Store.create({
      name: 'Fashion Forward Clothing Store',
      email: 'fashion@store.com',
      address: '321 Style Street, Fashion District, FD 70007',
      owner_id: null
    });

    const store4 = await Store.create({
      name: 'Gourmet Kitchen Supplies Hub',
      email: 'kitchen@store.com',
      address: '654 Culinary Court, Food City, FC 80008',
      owner_id: null
    });

    console.log('✓ Stores created.');

    // ── Create Ratings ──
    await Rating.bulkCreate([
      { user_id: user1.id, store_id: store1.id, rating: 4 },
      { user_id: user1.id, store_id: store2.id, rating: 5 },
      { user_id: user1.id, store_id: store3.id, rating: 3 },
      { user_id: user2.id, store_id: store1.id, rating: 3 },
      { user_id: user2.id, store_id: store3.id, rating: 4 },
      { user_id: user2.id, store_id: store4.id, rating: 5 },
      { user_id: user3.id, store_id: store1.id, rating: 5 },
      { user_id: user3.id, store_id: store2.id, rating: 4 },
    ]);

    console.log('✓ Ratings created.');

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║          SEED COMPLETE                    ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log('║  Admin:  admin@admin.com  / Admin@1234   ║');
    console.log('║  Owner:  owner1@store.com / Owner@1234   ║');
    console.log('║  Owner:  owner2@store.com / Owner@1234   ║');
    console.log('║  User:   user1@user.com   / User@12345   ║');
    console.log('║  User:   user2@user.com   / User@12345   ║');
    console.log('║  User:   user3@user.com   / User@12345   ║');
    console.log('╚══════════════════════════════════════════╝');
    return true;
  } catch (error) {
    console.error('✗ Seed error:', error);
    throw error;
  }
};

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = seed;
