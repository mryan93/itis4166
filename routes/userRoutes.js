const express = require('express');
const {body} = require('express-validator');
const { append } = require('express/lib/response');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters'); 

const userRouter = express.Router();

//Get /new: send sign up page

userRouter.get('/new', isGuest, controller.new);

//Get /profile: send profile page

userRouter.get('/profile', isLoggedIn, controller.profile);

//Get /login: send login page

userRouter.get('/login', isGuest, controller.login);

//Get /logout: logout the user

userRouter.get('/logout', isLoggedIn, controller.logout);

//Post /login: process login request

userRouter.post('/login', logInLimiter, isGuest,
[body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})],
controller.getUserLogin);

//Post /: create a new user

userRouter.post('/', isGuest, 
[body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})],
controller.create);

module.exports = userRouter;