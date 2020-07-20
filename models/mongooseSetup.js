const mongoose = require('mongoose');

module.exports.init = ()=>{


  mongoose.connect('mongodb://localhost:27017/Adasan', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

  mongoose.connection.on('connected', () => {
      console.log(`Mongoose connected`);
    });
    mongoose.connection.on('error', err => {
      console.log('Mongoose connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });
    
}