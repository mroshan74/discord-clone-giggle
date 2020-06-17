const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const jwt = require = require('jsonwebtoken')
const usersController = {}

usersController.register = (req,res) => {
    const body = req.body
    const user = new User(body)
    user.save().then(user => res.json(user))
    .catch(err => res.json(err))
}

usersController.login = (req,res) => {
    const body = req.body
    User.findOne({email: body.email})
        .then(user => {
            if(!user){
                res.json({error: 'invalid email or password'})
            }else{
                bcryptjs.compare(body.password, user.password)
                    .then(match => {
                        if(match){
                            const tokenData = {
                                username: user.username,
                                email: user.email,
                                _id: user._id
                            }
                            const token = jwt.sign(tokenData,'athena786',{ expiresIn: '15h' })
                            res.json({token})
                        }else{
                            res.json({error: 'invalid email or password'})
                        }
                    }).catch(err => res.json(err))
            }
        }).catch(err => res.json(err))
}

usersController.account = (req,res) => {
    res.json(req.user)
}

module.exports = usersController