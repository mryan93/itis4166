const express = require('express');
const { append } = require('express/lib/response');
const controller = require('../controllers/mainController');

const newRouter = express.Router();

// GET /about: send about page

newRouter.get('/about', controller.about);

// GET /contact: send contact page

newRouter.get('/contact', controller.contact);




module.exports = newRouter;