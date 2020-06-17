const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')
const md5 = require('crypto-js/md5')

const Schema = mongoose.Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 64,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
        validator: function(value){
            return isEmail(value)
        },
        message: function(){
            return 'invalid email format'
        }
    }
  },
  password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 64
  },
  profilePicUrl: {
      type: String
  }
})

userSchema.pre('save', function(next){
    console.log(this.password)
    // 🚀 creating a default profilePic generated randomly or by gravatar user database -> refs
    // https://www.npmjs.com/package/crypto-js
    // http://en.gravatar.com/site/implement/images/
    // http://en.gravatar.com/site/implement/hash/
    //🔥 gravatar only accepts md5 hashed values to search the user gravatar database to set random gravatar or fetch existing
    const hashed = md5(this.email.toLowerCase()).toString() 
    const url = `https://www.gravatar.com/avatar/${hashed}?s=200&d=identicon`
    this.profilePicUrl = url

    bcryptjs.genSalt().then((salt) =>
      bcryptjs.hash(this.password, salt).then((encrypted) => {
        this.password = encrypted
        next()
      })
    )
})

const User = mongoose.model('User',userSchema)
module.exports = User