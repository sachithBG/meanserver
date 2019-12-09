const mongoose = require('mongoose');

var user_professional_data = new mongoose.Schema({
    cv: { 
      type: String
     },
    skills: [{ type: String }],
    languages: [{ type: String }],
    qualifications: [{ type: String }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
},{ timestamps: true });

mongoose.model('user_professional_data', user_professional_data);