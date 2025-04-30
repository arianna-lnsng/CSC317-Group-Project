/**
 * movies.js
 * 04-29-2025- Modified by Cielina Lubrino
 */

const express = require('express');
const router = express.Router();
const Title = require('../models/Title');

router.get('/', async (req, res) => {
    const titles = await Title.find({ type: 'movie' });
    res.render('movies', { title: 'Movies', titles });
});

module.exports = router;
