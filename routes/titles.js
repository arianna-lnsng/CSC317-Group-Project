/**
 * titles.js
 * 04-29-2025- Modified by Cielina Lubrino
 */
const express = require('express');
const router = express.Router();
const Title = require('../models/Title');
const Review = require('../models/Review');

// GET title detail
router.get('/:id', async (req, res) => {
    const title = await Title.findById(req.params.id);
    if (!title) {
        return res.status(404).render('error', { 
            title: 'Movie Not Found', 
            message: 'Sorry, that movie could not be found.', 
            error: { status: 404 }
        });
    }
    const reviews = await Review.find({ titleId: title._id }).populate('userId', 'username');
    const relatedTitles = await Title.find({ genre: title.genre, _id: { $ne: title._id } }).limit(4);
    res.render('titles', { title, reviews, relatedTitles });
});

// POST rating
router.post('/:id/rate', async (req, res) => {
    const title = await Title.findById(req.params.id);
    title.ratings.push(parseInt(req.body.rating));
    title.averageRating = title.ratings.reduce((a, b) => a + b) / title.ratings.length;
    await title.save();
    res.redirect(`/titles/${req.params.id}`);
});

// POST review
router.post('/:id/reviews', async (req, res) => {
    const newReview = new Review({
        user: req.session.user._id,
        titleId: req.params.id,
        title: req.body.reviewTitle,
        content: req.body.content
    });
    await newReview.save();
    res.redirect(`/titles/${req.params.id}`);
});

module.exports = router;
