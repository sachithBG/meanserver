const mongoose = require('mongoose');

var user_comments = new mongoose.Schema({
    comment: { 
      type: String,
      required: 'comment can\'t be empty'
     },
    time : { type : Date, default: Date.now },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
},{ timestamps: true });

mongoose.model('user_comments', user_comments);