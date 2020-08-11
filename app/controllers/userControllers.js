const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const jwt = require = require('jsonwebtoken')
const usersControllers = {}


//-----------Register User
usersControllers.register = (req,res) => {
    const body = req.body
    const user = new User(body)
    user.save().then(user => res.json(user))
    .catch(err => res.json(err))
}


//-----------Sign-in User
usersControllers.login = (req,res) => {
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
                            const token = jwt.sign(tokenData,'athena786')
                            res.json({token})
                        }else{
                            res.json({error: 'invalid email or password'})
                        }
                    }).catch(err => res.json(err))
            }
        }).catch(err => res.json(err))
}


//------------sent account details
usersControllers.account = (req,res) => {
    User.findOne({_id: req.user._id})
        .populate('friends.info','username profilePicUrl')
        .populate('notifications.info', 'username profilePicUrl')
        .then(user => {
            const { _id, username, email , profilePicUrl, notifications, groups } = user
            const friends = user.friends.filter(friend => friend.status !== 'Rejected')
            friends.sort((a,b) => {
                return (a.status < b.status) ? 1 : ((b.status < a.status) ? -1 : 0)
            })
            let packData = {
                _id,
                username,
                email,
                profilePicUrl,
                notifications,
                groups,
                friends,
            }
            res.json(packData)
        })
        .catch(err => res.json(err))
}

module.exports = usersControllers