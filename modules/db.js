const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, (err) => {
    if(!err){console.log('MongoDB connection succeeded.');}
    else{console.log('Error in MongoDB connection :' + JSON.stringify(err, undefined, 2));}
});

require('./user.model');
require('./user_profile.model');
require('./user_professional_data');
require('./user_comments');
require('./Sensedata');

