const mongoose = require('mongoose');

var sens_data = new mongoose.Schema({

    sensName: { 
        type: String,
        required: 'comment can\'t be empty'
        },
        date: { 
            type: String
            },
        time: { 
            type: String
        },
        Temp: { 
            type: String,
            required: 'comment can\'t be empty'
         },
        Humidity: { 
          type: String
          },
        Barometer: { 
          type: String
          },
        Accelerometer: { 
        type: String,
        required: 'comment can\'t be empty'
          },
        Magnetometer: { 
          type: String
          },
        Gyroscope: { 
          type: String
          },
        Light: { 
        type: String
          },
        Battery: { 
            type: String
        },
        user: { 
            type: String
    }
},{ timestamps: true });

mongoose.model('sens_data', sens_data);