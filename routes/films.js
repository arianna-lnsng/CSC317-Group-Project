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
    let titles = [];
    if (search) {
        // 1. Try text search
        let query = { $text: { $search: search } };
        titles = await Title.find(query).sort({ name: 'asc' }).limit(50);

        // 2. If no results, try case-insensitive regex on name and director
        if (titles.length === 0) {
            const regex = new RegExp(search, 'i');
            titles = await Title.find({
                $or: [
                    { name: regex },
                    { director: regex }
                ]
            }).sort({ name: 'asc' }).limit(50);
        }

        // 3. If an exact (case-insensitive) match on name, redirect to detail page
        if (titles.length > 0) {
            const exact = titles.find(t => t.name.toLowerCase() === search.toLowerCase());
            if (exact) {
                return res.redirect(`/titles/${exact._id}`);
            }
        }

        // 4. If only one result, redirect to detail page
        if (titles.length === 1) {
            return res.redirect(`/titles/${titles[0]._id}`);
        }
    } else {
        // No search: show default list
        titles = await Title.find().sort({ name: 'asc' }).limit(50);
    }
    res.render('movies', { title: 'Movies', titles });
});

module.exports = router;
