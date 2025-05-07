/**
 * films.js
 * 04-29-2025- Modified by Cielina Lubrino
 */

const express = require('express');
const router = express.Router();
const Title = require('../models/Title');

router.get('/', async (req, res) => {
    console.log('movies routes was triggered');///debug line
    const titles = await Title.find().sort({ name: 'asc' }).limit(10);
    res.render('movies', { title: 'Movies', titles });
});

module.exports = router;
