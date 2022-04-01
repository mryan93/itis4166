const connection = require('../models/connection');
const model = require('../models/connection');

// Render all connections
exports.index = (req, res, next) => {
    model.find()
    .then(connections=>res.render('./connections', {connections}))
    .catch(err=>next(err));  
}

// GET /connections/new: send html form for creating a new connection

exports.new = (req, res) =>{
    res.render('./new-connection');
}

//POST /connections: create a new connection

exports.create = (req, res, next)=>{
    let connection = new model(req.body); //create document
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
    model.findById(id)
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
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(connection=>{
        if(connection){
            return res.render('./edit', {connection});
        } else{
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
}

//PUT /connections/:id: update the connection identified by id

exports.update = (req, res, next) =>{
    let connection = req.body;
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{
        if(connection){
            res.redirect('/connections/'+id);
        } else{
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
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

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(connection=>{
        if(connection){
            res.redirect('/connections');
        } else{
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
}