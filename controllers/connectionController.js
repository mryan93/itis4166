const connection = require('../models/connection');
const model = require('../models/connection');
const rsvpModel = require('../models/rsvp');
const {isLoggedIn} = require('../middlewares/auth');

// Render all connections
exports.index = (req, res, next) => {
    model.find()
    .then(connections=>res.render('./connections', {connections}))
    .catch(err=>next(err));  
}

// GET /connections/new: send html form for creating a new connection

exports.new = (req, res) =>{
    if(!req.session.user){
        req.flash('error', 'You are not logged in');
        return res.redirect('../login');
    } else{
        res.render('./new-connection');
    }
    
}

//POST /connections: create a new connection

exports.create = (req, res, next)=>{
    let connection = new model(req.body); //create document
    connection.hostName = req.session.user;
    connection.save() //insert document to db
    .then((connection)=>{
        console.log(connection);
        res.redirect('./connections');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });   
}

//GET /connections/:id: send details of connection identified by id

exports.show = (req, res, next) =>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    }
    model.findById(id).populate('hostName', 'firstName lastName')
    .then(connection=>{
        if(connection){
            return res.render('./connection-detail', {connection});
        } else{
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));   
}

//GET /connections/:id/edit: send html form for editing an existing connection

exports.edit = (req, res, next) =>{
    let id = req.params.id;

    model.findById(id)
    .then(connection=>{
        return res.render('./edit', {connection});
    })
    .catch(err=>next(err));
}

//PUT /connections/:id: update the connection identified by id

exports.update = (req, res, next) =>{
    let connection = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{
        res.redirect('/connections/'+id);
    })
    .catch(err=>{
        if(err.name === 'ValidationError')
            err.status = 400;
        return next(err);
    });
}

//DELETE /connections/:id, delete the story identified by id
exports.delete = (req, res, next) =>{
    let id = req.params.id;

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(connection=>{
        res.redirect('/connections');
    })
    .catch(err=>next(err));
}

//POST /connections/:id, create a new rsvp

exports.newRsvp = (req, res, next) =>{
    if(!req.session.user){
        return res.redirect('../login');
    }
}
