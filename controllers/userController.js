const model = require('../models/user');
const Connection = require('../models/connection');

//Render sign up page

exports.new = (req, res)=>{
    if(!req.session.user){
        return res.render('./new');
    }
    else{
        req.flash('error', 'You are logged in already');
        return res.redirect('profile');
    }
}

//Render profile page

exports.profile = (req, res, next)=>{
    if(!req.session.user){
        req.flash('error', 'You are not logged in');
        return res.redirect('./new');
    } else{
    let id = req.session.user;
    Promise.all([model.findById(id), Connection.find({hostName: id})])
    .then(results=>{
        const [user, connections] = results;
        res.render('./user/profile', {user, connections});
    })
    .catch(err=>next(err));
}
};

//Render login page

exports.login = (req, res)=>{
    if(!req.session.user){
        console.log(req.flash());
        res.render('./login');
    }
    else{
        req.flash('error', 'You are logged in already');
        return res.redirect('profile');
    }
    
}