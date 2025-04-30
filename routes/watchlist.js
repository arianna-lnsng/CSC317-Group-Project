/**
 * watchlist.js
 * 04-29-2025- Modified by Cielina Lubrino
 */

router.get('/dashboard', async (req, res) => {
    const user = await User.findById(req.session.user._id).populate('watchlist');
    res.render('user/dashboard', { user });
});
