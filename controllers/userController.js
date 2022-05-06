const {validationResult} = require('express-validator');
const model = require('../models/user');
const Connection = require('../models/connection');
const User = require('../models/user');
const rsvpModel = require('../models/rsvp');

//Render sign up page

exports.new = (req, res)=>{
    return res.render('./new');
}

//Render profile page

exports.profile = (req, res, next)=>{
    //Render rsvps here?
    if(!req.session.user){
        req.flash('error', 'You are not logged in');
        return res.redirect('./login');
    } else{
    let id = req.session.user;
    Promise.all([model.findById(id), Connection.find({hostName: id}), rsvpModel.find({userName: id}), Connection.find()])
    .then(results=>{
        //Sends data for user, connections, and rsvp to the profile page
        const [user, connections, rsvps, allConnections] = results;
        res.render('./profile', {user, connections, rsvps, allConnections});
        console.log(allConnections);
    })
    .catch(err=>next(err));
}
};

//Render login page

exports.login = (req, res)=>{
    res.render('./login');    
}

//logout the user

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    });
}

//process login request

exports.getUserLogin = (req, res, next)=>{
    //authenticate user's login request
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    }
    let email = req.body.email;
    if(email){
        email = email.toLowerCase();
    }
    let password = req.body.password;

    //get the user that matches the email
    User.findOne({email: email})
    .then(user=>{
        if(user){
            //user found in the database
            user.comparePassword(password)
            .then(result=>{
                if(result){
                    req.session.user = user._id; //store id in session
                    req.flash('success', 'You have succefully logged in');
                    res.redirect('/profile');
                }else{
                    //console.log('wrong password');
                    req.flash('error', 'Wrong password');
                    res.redirect('/login');
                }
            })
        } else{
            //console.log('wrong email address');
            req.flash('error', 'Wrong email address');
            res.redirect('/login');
        }
    })
    .catch(err=>next(err));
}

//create new user

exports.create = (req, res, next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    }
    let user = new User(req.body);
    if(user.email){
        user.email = user.email.toLowerCase();
    }
    user.save()
    .then(()=>res.redirect('/login'))
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            return redirect('/new');
        }

        if(err.code === 11000){
            req.flash('error', 'Email address has been used');
            return res.redirect('/new');
        }
        next(err);
    });
}