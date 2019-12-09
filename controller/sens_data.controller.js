const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const User = mongoose.model('User');
const sensData = mongoose.model('sens_data');

module.exports.dataSave = (req,res,next) => {
    
    var data = new sensData();
    data.sensName = req.body.sensName;
    data.date = req.body.date;
    data.time = req.body.time;
    data.Temp = req.body.Temp;
    data.Humidity = req.body.Humidity;
    data.Barometer = req.body.Barometer;
    data.Accelerometer = req.body.Accelerometer;
    data.Magnetometer = req.body.Magnetometer;
    data.Gyroscope = req.body.Gyroscope;
    data.Light = req.body.Light;
    data.Battery = req.body.Battery;
    data.user = req.body.user;
    
    data.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate data address found.']);
            else
                return next(err);
        }

    });
}

module.exports.dataUpdate = (req, res, next) => {
    if (!ObjectId.isValid(req._id))
        return res.status(400).send(`No record with given id : ${req._id}`);

        sensData.findById({_id: req.params.id}) // We are temporary adding a user as the author
        .then(dataPro => {
            // if(!userPro)
            var s_data = new sensData({
                sensName : req.body.sensName,
                date : req.body.date,
                time : req.body.time,
                Temp : req.body.Temp,
                Humidity : req.body.Humidity,
                Barometer : req.body.Barometer,
                Accelerometer : req.body.Accelerometer,
                Magnetometer : req.body.Magnetometer,
                Gyroscope : req.body.Gyroscope,
                Light : req.body.Light,
                Battery : req.body.Battery
            });
            s_data.user = dataPro.user;
            s_data._id = dataPro._id;
            sensData.findByIdAndUpdate(dataPro._id , s_data)
            .then(r => {
            return res.status(201).json({ message: 'User profile Updated' });
            });
        }).catch(err => next(err));
}

module.exports.dataGet = (req, res, next) =>{
    // res.send('Okk')
    sensData.findOne({ _id: req.params.id },
        (err, data) => {
            if (!data)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, data : _.pick(data,['id','sensName','date','time', 
                'Temp','Humidity','Barometer','Accelerometer', 'Magnetometer','Gyroscope','Light','Battery', 'user']) });
        }
    );
}

module.exports.allDataGet = (req, res, next) =>{
    // res.send(req._id);
    sensData.find()
    .then(results => {
        if(results){
    return res.status(200).json({status: true, sens_data : results.map(r => {
            return {
                id:r.id,
                sensName : r.sensName,
                date : r.date,
                time : r.time,
                Temp : r.Temp,
                Humidity : r.Humidity,
                Barometer : r.Barometer,
                Accelerometer : r.Accelerometer,
                Magnetometer : r.Magnetometer,
                Gyroscope : r.Gyroscope,
                Light : r.Light,
                Battery : r.Battery,
                user : r.user
            };
            })});
    } else {
        const error = new Error('no data  found');
        error.status = 404;
        // throw error;
        return res.status(404).json({ status: false, message: error });
     }
    })
    .catch(err => next(err));
}


module.exports.deleteData = (req, res, next) => {    // not check    
    sensData.findByIdAndDelete({_id: req.params.id}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { error = 'Error in data Delete :' + JSON.stringify(err, undefined, 2);
        console.log(error);
        return res.status(201).json({ message: error });
    }});

}
module.exports.deleteAllData = (req, res, next) => {    // not check
    sensData.deleteMany((err, doc) => {
        if (!err) { res.send(doc); }
        else { error = 'Error in user Delete :' + JSON.stringify(err, undefined, 2);
        console.log(error);
        return res.status(201).json({ message: error });
    }});

}