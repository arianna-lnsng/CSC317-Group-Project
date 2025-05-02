/**
 * Authentication controller for After the Credits platform
 */
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getRegister = (req, res) => {
  res.render('auth/register', { 
    title: 'Register',
    formData: {},
    errors: []
  });
};

exports.postRegister = async (req, res, next) => {
  const errors = validationResult(req);
  const { username, email, password, confirmPassword } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render('auth/register', {
      title: 'Register',
      formData: { username, email },
      errors: errors.array()
    });
  }

  try {
    const user = new User({ username, email, password });
    await user.save();
    
    req.session.user = { _id: user._id, username: user.username, email: user.email };
    req.session.userId = user._id;
    console.info(`New user registered: ${username} (ID: ${user._id}) from IP: ${req.ip}`);
    
    res.redirect('/');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).render('auth/register', {
      title: 'Register',
      formData: { username, email },
      errors: [{ msg: 'An unexpected error occurred during registration. Please try again.' }]
    });
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login', { 
    title: 'Login',
    formData: {},
    errors: []
  });
};

exports.postLogin = async (req, res, next) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render('auth/login', {
      title: 'Login',
      formData: { email },
      errors: errors.array()
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`Login failed: User not found for email ${email} from IP: ${req.ip}`);
      return res.status(401).render('auth/login', {
        title: 'Login',
        formData: { email },
        errors: [{ msg: 'Invalid email or password.' }]
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
       console.warn(`Login failed: Incorrect password for email ${email} from IP: ${req.ip}`);
       return res.status(401).render('auth/login', {
        title: 'Login',
        formData: { email },
        errors: [{ msg: 'Invalid email or password.' }]
      });
    }

    req.session.user = { _id: user._id, username: user.username, email: user.email };
    req.session.userId = user._id;
    console.info(`User logged in: ${user.username} (ID: ${user._id}) from IP: ${req.ip}`);

    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);

  } catch (error) {
     console.error('Login error:', error);
     res.status(500).render('auth/login', {
      title: 'Login',
      formData: { email },
      errors: [{ msg: 'An unexpected error occurred during login. Please try again.' }]
    });
  }
};

exports.logout = (req, res) => {
  const username = req.session.user ? req.session.user.username : 'User';
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    console.info(`${username} logged out from IP: ${req.ip}`);
    res.clearCookie('connect.sid');
    res.redirect('/auth/login');
  });
};
