let mongoose = require('mongoose');
let passport = require('passport');
require('../config/passport')(passport);
let express = require('express');
let jwt = require('jsonwebtoken');
let User = require("../models/user");
let Todos = require("../models/todo");
var constants = require('../config/constants');
let router = express.Router();
let customError = require('../error');


router.post('/user/signup', function (req, res, next) {
    if (!req.body.useremail || !req.body.password) {
        next(new customError(400, 'useremail and password are required fields'));
    } else {
        let newUser = new User({
            useremail: req.body.useremail,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.useremail
        });
        return newUser.save().then((user) => {
            res.status(201).json({success: true, msg: 'Successfully created new user.'});
        }).catch((err) => {
            if (err && err.code === 11000) {
                let error = new customError(409, "User already exists");
                next(error);
            }
            if (err) next(new customError(500, 'internal server error'));

        })
    }
});

router.post('/user/signin', function(req, res, next) {
    if (!req.body.useremail || !req.body.password) {
        next(new customError(400, 'useremail and password are required fields'));
    }
    User.findOne({
        useremail: req.body.useremail
    }).then(function (user) {
        if (!user) {
            next(new customError(404, 'Authentication Failed. User not found!'));
        }
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
                // if user is found and password is right create a token
                let userObjectForToken = {};
                userObjectForToken['useremail'] = user['useremail'];
                userObjectForToken['userId'] = user['_id'];
                let token = jwt.sign(userObjectForToken, constants.APP_SECRET, { expiresIn: 60 * 60 * 24 });
                let options = {
                    maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                    //httpOnly: true, // The cookie only accessible by the web server
                };
                res.cookie('authorization', 'JWT ' + token, options);
                res.send({ success: true, token: `JWT ${token}`, id: user._id});
            } else {
                next(new customError(401, 'Authentication failed. Wrong password.'));
            }
        });
    }).catch(err => {
        if (!!err && !!err.name && err.name === 'CastError')
            next(new customError(404, 'User not found'));
        next(err);
    });
});

router.get('/user/validatetoken', passport.authenticate('jwt', { session: false }), function (req, res) {
    let token = getToken(req.headers);
    if (token) {
        return res.status(200).send();
    } else {
        next(new customError(403, 'User is not authorized'));
    }
});

router.post('/todo/create', function(req, res, next) {
    if (!req.body.userid ) {
        next(new customError(404, 'User not found'));
    }
    if (!req.body.description) {
        next(new customError(400, 'Description is required'));
    }
    if(getToken(req.headers)) {
        return User.find({userId: req.body.userid})
            .then((user) => {
                if (!user) next(new customError(404, 'User not found'));
                let newTodo = new Todos({
                    userId: req.body.userid,
                    description: req.body.description,
                    priority: req.body.priority,
                    status: req.body.status || 'DUE'
                });
                return newTodo.save()
                    .then((todo) => {
                        res.status(201).json({success: true, _id: todo._id});
                    }).catch((err) => {
                        next(new customError(500, 'Could not create todo, try again later'));
                    });
            }).catch(err => {
                if (!!err && !!err.name && err.name === 'CastError')
                    next(new customError(404, 'User not found'));
                next(err);
            });
    }
    next(new customError(403, 'User is not authorized'));
});

router.put('/todo/update/:id', function(req, res, next) {
    if (!req.body.userid ) {
        next(new customError(404, 'User not found'));
    }
    if (!req.body.description) {
        next(new customError(400, 'Description is required.'));
    }
    if(getToken(req.headers)) {
        let todoId = req.params.id;
            return User.find({userId: req.body.userid})
                .then((user) => {
                    if (!user) next(new customError(404, 'User not found'));
                    return Todos.findOneAndUpdate({_id: todoId}, {$set:req.body }, {new: true})
                        .then(updated => {
                            if (!!updated)
                            res.send(updated);
                            next(new customError(404, 'Todo not found!'));
                        }).catch(err => {
                            if (!!err && !!err.name  && err.name === 'CastError')
                                next(new customError(404, 'Todo not found'));
                            next(err);
                        });
                }).catch(err => {
                    if (!!err && !!err.name && err.name === 'CastError')
                        next(new customError(404, 'User not found'));
                    next(err);
                });

    }
    next(new customError(403, 'User is not authorized'));
});

router.get('/todo/:userid', function(req, res, next) {
    if (!req.params.userid)
        next(new customError(404, 'User not found'));
    let userid = req.params.userid;
    if(getToken(req.headers)) {
        return User.find({userId: userid})
            .then(user => {
                if (!user) next(new customError(404, 'User not found'));
                return Todos.find({userId: userid}).exec()
                    .then(todo => res.send(todo))
                    .catch(err => {
                        if (!!err && !!err.name && err.name === 'CastError')
                            next(new customError(404, 'Todo\'s not found'));
                        next(err)
                    });
            }).catch(err => {
                if (!!err && !!err.name && err.name === 'CastError')
                    next(new customError(404, 'User not found'));
                next(err);
            });
    }
    next(new customError(403, 'User is not authorized'));


});

router.get('/todo/:userid/:todoid', function(req, res, next) {
    if (!req.params.userid)
        next(new customError(404, 'User not found'));
    if (!req.params.todoid)
        next(new customError(404, 'Todo not found'));
    let {
        userid,
        todoid}= req.params;
    if(getToken(req.headers)) {
        return User.find({userId: userid})
            .then(user => {
                if (!user) next(new customError(404, 'User not found'));
                return Todos.findOne({userId: userid, _id: todoid}).exec()
                    .then(todo => res.send(todo))
                    .catch(err => {
                        if (!!err && !!err.name && err.name === 'CastError')
                            next(new customError(404, 'Todo not found'));
                        next(err)
                    });
            }).catch(err => {
                if (!!err && !!err.name && err.name === 'CastError')
                    next(new customError(404, 'User not found'));
                next(err);
            });
    }
    next(new customError(403, 'User is not authorized'));

});

router.delete('/todo/:userid/:todoid', function(req, res, next) {
    let {
        userid,
        todoid}= req.params;
    if(getToken(req.headers)) {
        return User.find({userId: req.body.userid})
            .then(user => {
                if (!user) next(new customError(404, 'User not found'));
                return Todos.remove({userId: userid, _id: todoid})
                    .then(todo => {
                      console.log(todo, "todooooo delete");
                        if(!!todo.result.n)
                            res.send(todo);
                        next(new customError(404, 'Todo not found'));
                    })
                    .catch(err => {
                        if (!!err && !!err.name && err.name === 'CastError')
                            next(new customError(404, 'Todo not found'));
                        next(err)
                    });
            }).catch(err => {
                if (!!err && !!err.name && err.name === 'CastError')
                    next(new customError(404, 'User not found'));
                next(err);
            });
    }
    next(new customError(403, 'User is not authorized'));
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;
