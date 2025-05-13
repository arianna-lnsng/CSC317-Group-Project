router.get('/watchlist', async (req, res) => {
    try {
        // Fetch the user with the watchlist populated
        const user = await User.findById(req.session.user._id).populate('watchlist');
        
        // If the user is not found or there is no watchlist, return a message
        if (!user) {
            return res.redirect('/auth/login');
        }
        
        // Render the watchlist page
        res.render('user/watchlist', { 
            user,
            message: user.watchlist.length === 0 ? 'Your watchlist is empty.' : '' // Add an empty watchlist message if necessary
        });
    } catch (error) {
        console.error('Error loading watchlist:', error);
        res.render('error', {
            title: 'Error',
            message: 'There was an issue loading your watchlist.',
            error
        });
    }
});
