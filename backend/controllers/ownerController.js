const { Store, Rating, User, sequelize } = require('../models');

/**
 * Store owner dashboard.
 * Returns store info, average rating, and list of users who rated.
 */
const getDashboard = async (req, res) => {
  try {
    // Find the store(s) owned by this user
    const store = await Store.findOne({
      where: { owner_id: req.user.id }
    });

    if (!store) {
      return res.json({
        store: null,
        averageRating: 0,
        totalRatings: 0,
        ratings: [],
        message: 'No store found for this owner. Please contact the administrator.'
      });
    }

    // Get aggregate rating
    const avgResult = await Rating.findAll({
      where: { store_id: store.id },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings']
      ]
    });

    // Get list of users who submitted ratings
    const ratings = await Rating.findAll({
      where: { store_id: store.id },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email']
      }],
      order: [['updated_at', 'DESC']]
    });

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address
      },
      averageRating: avgResult[0].getDataValue('averageRating')
        ? parseFloat(parseFloat(avgResult[0].getDataValue('averageRating')).toFixed(1))
        : 0,
      totalRatings: parseInt(avgResult[0].getDataValue('totalRatings')) || 0,
      ratings: ratings.map(r => ({
        id: r.id,
        rating: r.rating,
        userName: r.User ? r.User.name : 'Unknown',
        userEmail: r.User ? r.User.email : 'Unknown',
        submittedAt: r.updated_at
      }))
    });
  } catch (error) {
    console.error('Owner dashboard error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Store owner deletes their own store.
 */
const deleteStore = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { owner_id: req.user.id }
    });

    if (!store) {
      return res.status(404).json({ message: 'No store found for your account.' });
    }

    await store.destroy();
    res.json({ message: 'Store removed successfully.' });
  } catch (error) {
    console.error('Delete owner store error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getDashboard, deleteStore };
