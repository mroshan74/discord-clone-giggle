const mongoose = require('mongoose')

const configureDB = () => {
    mongoose.connect('mongodb://localhost:27017/giggle-discord-db',{
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
        .then(()=>{console.log('connected to giggle-discord-db...')})
        .catch((err) => console.log(err))
}

module.exports = configureDB