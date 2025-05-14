/**
 * titles.js
 * 04-29-2025 - Modified by Cielina Lubrino
 * 05-13-2025 - Updated by Rama Harish Vegesna
 */
const express = require('express');
const router = express.Router();
const Title = require('../models/Title');
const Review = require('../models/Review');
const Rating = require('../models/Rating');

// GET title detail
router.get('/:id', async (req, res) => {
    try {
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
        let userRating = null;
        if (req.session.user) {
            const rating = await Rating.findOne({ 
                userId: req.session.user._id, 
                titleId: title._id 
            });
            if (rating) {
                userRating = rating.rating;
            }
        }
        res.render('titles', { title, reviews, relatedTitles,
             userRating,
             csrfToken: req.csrfToken(),   // ✅ add this
  user: req.session.user 

         });
    } catch (err) {
        console.error('Error loading title page:', err);
        res.status(500).render('error', {
            title: 'Server Error',
            message: 'Something went wrong while loading the title page.',
            error: err
        });
    }
});

// POST rating
router.post('/:id/rate', async (req, res) => {
    try {
        const title = await Title.findById(req.params.id);
        if (!title) {
            return res.status(404).render('error', { 
                title: 'Movie Not Found', 
                message: 'Sorry, that movie could not be found.', 
                error: { status: 404 }
            });
        }

        const newRating = new Rating({
            userId: req.session.user._id,
            titleId: title._id,
            rating: parseInt(req.body.rating)
        });

        await newRating.save();
        res.redirect(`/titles/${req.params.id}`);
    } catch (err) {
        console.error('Error saving rating:', err);
        res.status(500).render('error', {
            title: 'Rating Error',
            message: 'Failed to submit your rating.',
            error: err
        });
    }
});

// POST review
// POST review
router.post('/:id/reviews', async (req, res) => {
    try {
        // Log the incoming review data for debugging
        console.log('Incoming review data:', {
            userId: req.session.user?._id,
            reviewTitle: req.body.reviewTitle,
            content: req.body.content
        });

        // Create the review document
        const newReview = new Review({
            titleId: req.params.id,
            userId: req.session.user._id,
            reviewTitle: req.body.reviewTitle,
            content: req.body.content
        });

        // Save the review and redirect
        await newReview.save();
        res.redirect(`/titles/${req.params.id}`);
    } catch (err) {
        console.error('Review creation failed:', err);
        res.status(400).render('error', {
            title: 'Review Error',
            message: 'Failed to submit your review. Make sure all required fields are filled out correctly.',
            error: err
        });
    }
});


module.exports = router;
