const mongoose = require('mongoose')

const configureDB = () => {
    const url = 'mongodb+srv://giggleApp:giggleDbServer@development.kxlvf.mongodb.net/giggle-db?retryWrites=true&w=majority'
    mongoose.connect(url,{
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
        .then(()=>{console.log('connected to giggle-discord-db...')})
        .catch((err) => console.log(err))
}

module.exports = configureDB