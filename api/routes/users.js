const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email}).exec()
        .then(user => {
            if (user.length >= 1) { //even if user DNE, it returns an empty array, so check for length
                return res.status(409).json({
                    message: 'Email already exists!'
                }) // 409 code = conflict / 422 unprocessed entity
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({error:err});
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                res.status(500).json({error: err})
                            });
                    }
                })
            } // end of else
        })
        .catch(err => {
            res.status(500).json({error: err})
    });
});

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email}).exec()
        .then(user => {
            if (user.length < 1) { // 401 code: unauthorized (using "email not found" is not the best practice)
                return res.status(401).json({
                    message: 'Auth failed'
                });
            } 
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({ message: 'Auth failed' });
                };
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({ 
                        message: 'Auth successful',
                        token: token 
                    });
                };
                res.status(401).json({ message: 'Auth failed'});
            });
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})

router.delete('/:userId', (req, res, next) => {
    User.remove({_id: req.params.userId}).exec()
        .then(result => {
            res.status(200).json({message: 'User deleted'})
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
});

module.exports = router;