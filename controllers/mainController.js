const model = require('../models/connection');

//Render about page

exports.about = (req, res) =>{
    res.render('./about');
}

// GET /contact: send contact page

exports.contact = (req, res)=>{
    res.render('./contact');
}