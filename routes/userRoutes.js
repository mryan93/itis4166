const express = require('express');
const { append } = require('express/lib/response');
const controller = require('../controllers/userController');

const userRouter = express.Router();

//Get /new: send sign up page

userRouter.get('/new', controller.new);

//Get /profile: send profile page

userRouter.get('/profile', controller.profile);

//Get /login: send login page

userRouter.get('/login', controller.login);

module.exports = userRouter;