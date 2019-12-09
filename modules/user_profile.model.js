const mongoose = require('mongoose');

var user_profile = new mongoose.Schema({
    userName:{
    type:String,
    required: 'User Name can\'t be empty',
    },
    position: { 
      type: String,
      required: 'Position can\'t be empty'
     },
    office: { type: String,
      required: 'Office can\'t be empty'
     },
    gender: { type: String },
    birthday: { type: String },
    profile_img: { type: String },
    about: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
      professional_data: [
        {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          ref: 'user_professional_data'
        }
      ],
      user_comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          ref: 'user_comments'
        },
        ]
},{ timestamps: true });

mongoose.model('user_profile', user_profile);