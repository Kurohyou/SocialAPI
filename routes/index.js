const router = require('express').Router();

const thoughtRoutes = require('./thought');
const userRoutes = require('./user');

router.use('/api/users/',userRoutes);
router.use('/api/thoughts/',thoughtRoutes);

module.exports = router;