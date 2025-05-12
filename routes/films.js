/**
 * films.js
 * 04-29-2025- Modified by Cielina Lubrino
 */

const express = require('express');
const router = express.Router();
const Title = require('../models/Title');

router.get('/', async (req, res) => {
    console.log('movies routes was triggered');///debug line
    const { search } = req.query;
    let query = {};
    if (search) {
        query.$text = { $search: search };
    }
    const titles = await Title.find(query).sort({ name: 'asc' }).limit(50);
    res.render('movies', { title: 'Movies', titles });
});

module.exports = router;
