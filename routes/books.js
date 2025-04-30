
/**
 * books.js
 * 04-29-2025- Modified by Cielina Lubrino
 */


const express = require('express');
const router = express.Router();
const Title = require('../models/Title');


router.get('/', async (req, res) => {
    const titles = await Title.find({ type: 'book' });
    res.render('books', { title: 'Books', titles });
});

module.exports = router;
