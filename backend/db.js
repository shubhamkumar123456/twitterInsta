const mongoose = require('mongoose');

const connectToDb = ()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/twitterApp')
    .then(() => console.log('connect to mongodb successfully!'))
    .catch(()=>console.log('error in connecting mongodb'));
}

module.exports = connectToDb;