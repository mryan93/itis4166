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
    model.findById(id)
    .then(connection=>{
        if(connection){
            return res.render('./connection-detail', {connection});
        } else{
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));   
}

//GET /connections/:id/edit: send html form for editing an existing connection

exports.edit = (req, res, next) =>{
    let id = req.params.id;
    let connection = model.findById(id);
    if(connection){
        res.render('./edit', {connection});
    }
    else{
        let err = new Error('Cannot find a story with id ' + id);
        err.status = 404;
        next(err);
    }
}

//PUT /connections/:id: update the connection identified by id

exports.update = (req, res, next) =>{
    let connection = req.body;
    let id = req.params.id;

    if(model.updateById(id, connection)){
        res.redirect('/connections/'+id);
    } else{
        let err = new Error('Cannot find a story with id ' + id);
        err.status = 404;
        next(err);
    }
}

//DELETE /connections/:id, delete the story identified by id
exports.delete = (req, res, next) =>{
    let id = req.params.id;
    if (model.deleteById(id)){
        res.redirect('/connections');
    }
    else{
        let err = new Error('Cannot find a story with id ' + id);
        err.status = 404;
        next(err);
    }
}
