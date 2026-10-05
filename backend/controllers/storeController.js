const { Op } = require('sequelize');
const { Store, Rating, sequelize } = require('../models');

/**
 * List all stores for normal users with search capability.
 * Includes average rating and the current user's submitted rating.
 */
const getStores = async (req, res) => {
  try {
    const { name, address, sortBy, sortOrder } = req.query;
    const where = {};

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({ where });

    // Get user's ratings for all stores in one query
    const userRatings = await Rating.findAll({
      where: { user_id: req.user.id }
    });
    const userRatingsMap = {};
    userRatings.forEach(r => {
      userRatingsMap[r.store_id] = r.rating;
    });

    const result = [];
    for (const store of stores) {
      const ratingResult = await Rating.findAll({
        where: { store_id: store.id },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings']
        ]
      });

      result.push({
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: ratingResult[0].getDataValue('averageRating')
          ? parseFloat(parseFloat(ratingResult[0].getDataValue('averageRating')).toFixed(1))
          : 0,
        totalRatings: parseInt(ratingResult[0].getDataValue('totalRatings')) || 0,
        userRating: userRatingsMap[store.id] || null
      });
    }

    // Sort
    const allowedSortFields = ['name', 'address', 'averageRating'];
    if (sortBy && allowedSortFields.includes(sortBy)) {
      const dir = sortOrder === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (typeof aVal === 'string') return dir * aVal.localeCompare(bVal);
        return dir * (aVal - bVal);
      });
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json(result);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Submit or update a rating for a store.
 * Uses findOrCreate + update pattern to handle upsert.
 */
const submitRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    // Validate rating value
    if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5.' });
    }

    // Verify store exists
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    // Upsert: find existing rating or create new one
    const [ratingRecord, created] = await Rating.findOrCreate({
      where: { user_id: req.user.id, store_id: parseInt(id) },
      defaults: { rating }
    });

    if (!created) {
      await ratingRecord.update({ rating });
    }

    // Calculate updated average for the store
    const avgResult = await Rating.findAll({
      where: { store_id: id },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings']
      ]
    });

    res.json({
      message: created ? 'Rating submitted successfully.' : 'Rating updated successfully.',
      userRating: ratingRecord.rating,
      averageRating: parseFloat(parseFloat(avgResult[0].getDataValue('averageRating')).toFixed(1)),
      totalRatings: parseInt(avgResult[0].getDataValue('totalRatings'))
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getStores, submitRating };
