const User = require('../models/user')
const jwt = require('jsonwebtoken')

const authenticateUser = (req,res,next) => {
    if(req.header('x-auth')){
        const token = req.header('x-auth')
        let tokenData
        try {
            tokenData = jwt.verify(token, 'athena786')
            User.findById(tokenData._id)
                .then(user => {
                    req.user = user
                    next()
                })
                .catch(err => res.json(err))
        } catch (err) {
            res.json({ errors: err.message })
        }
    } else {
        res.json({ error: 'token must be provided' })
    }
}

module.exports = { authenticateUser }