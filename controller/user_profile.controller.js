const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

var ObjectId = require('mongoose').Types.ObjectId;


const User = mongoose.model('User');
const user_profile = mongoose.model('user_profile');
const user_professional_data = mongoose.model('user_professional_data');
const user_comments = mongoose.model('user_comments');
const { check, validationResult } = require('express-validator');



module.exports.getProfile = (req, res, next) =>{
    var qur = { user: req._id+"" };
    user_profile.findOne(qur)
    .then(userProfile => {
            console.log(userProfile.user);
            if (!userProfile)
                return res.status(404).json({ status: false, message: 'User record not found.' + req._id });
            else
                return res.status(200).json({ status: true, user_profile : _.pick(userProfile,['id','userName','position','office','gender',
                'birthday','about','profile_img', 'professional_data' , 'user_comments','user']) });
        }
    ).catch(err => next(err));
}

module.exports.updateProfile = (req, res) => {
    updates(req, res);
    };

module.exports.saveProfile = (req, res, next) => {  //set user :id

    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        var qur = { user: req._id+"" };
        user_profile.findOne(qur)
        .then(userProfile => {
        if (!userProfile){
            // console.log(userProfile.user)
            User.findById(req._id) // We are temporary adding a user as the author
            .then(user => {
                // console.log(user)
            var userProfile = new user_profile({
                userName:req.body.userName,
                position: req.body.position,
                office: req.body.office,
                gender:req.body.gender,
                birthday: req.body.birthday,
                profile_img: req.body.profile_img,
                about: req.body.about,
            });
            userProfile.user = user._id;
            userProfile.professional_data = [];
            userProfile.user_comments = [];

            return userProfile.save(userProfile);
          })
          .then(user_profile => {
            res
              .status(201)
              .json({
                message: 'user profile created',
                id: user_profile._id,
                position: user_profile.position
              });
          }).catch(err => next(err));
        }else{
            updates( req, res );
        }
        }).catch(err => next(err));
      }
      
    }
var updates = (req, res)=> {
    if (!ObjectId.isValid(req._id))
        return res.status(400).send(`No record with given id : ${req._id}`);

        user_profile.findOne({user: req._id}) // We are temporary adding a user as the author
        .then(userPro => {
            // if(!userPro)
            var u_profile = new user_profile({
                userName:req.body.userName,
                position: req.body.position,
                office: req.body.office,
                gender:req.body.gender,
                birthday: (req.body.birthday.year+ "-" + req.body.birthday.month+"-" + req.body.birthday.day),
                profile_img: req.body.profile_img,
                about: req.body.about
            });
            u_profile.user = userPro.user;
            u_profile.professional_data = userPro.professional_data;
            u_profile.user_comments = userPro.user_comments;
            u_profile._id = userPro._id;
            user_profile.findByIdAndUpdate(userPro._id , u_profile)
            .then(r => {
            return res.status(201).json({ message: 'User profile Updated' });
            });
        }).catch(err => next(err));
}

module.exports.getProfiles = (req, res) => {
    // res.send(req._id);
    // console.log(req._id);
    user_profile.find().populate('user')
        .then(results => {
            if(results){
        return res.status(200).json({status: true, userProfiles : results.map(r => {
                return {
                    id: r.id,
                    userName:r.userName,
                    position: r.position,
                    office: r.office,
                    gender:r.gender,
                    birthday: r.birthday,
                    about: r.about,
                    profile_img: r.profile_img,
                    professional_data: r.professional_data,
                    user_comments: r.user_comments,
                    user:
                    (r.user && { id: r.user._id, fullName: r.user.fullName, email: r.user.email, password: r.user.password }) || null
                };
                })});
        } else {
            const error = new Error('no user profiles found');
            error.status = 404;
            // throw error;
            return res.status(404).json({ status: false, message: error });
            }
        })
        .catch(err => next(err));
}
module.exports.deleteProfile = (req, res, next) => {
    deletePro(req, res, next);
}

var deletePro = (req, res, next) => {  // not check
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

    deleteComments(req, res, next);
    deleteData(req, res, next);

    userProfile.findOneAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { 
            error = 'Error in userProfile Delete :' + JSON.stringify(err, undefined, 2);
            console.log(error);
            return res.status(201).json({ message: error });
        }});
}
///////////////////////////////////////////////////////////////////// user details from user id

module.exports.getUser = (req, res ,next) => {
    // res.send(req.params.id)
    // console.log(req._id);
    User.findById(req._id)
    .then(user => {
            // console.log(user.id);
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' + req._id });
            else
            return res.status(200).json({ status: true, user : _.pick(user,['fullName','email']) });
        }
    ).catch(err => next(err));
}

module.exports.deleteUser = (req, res, next) => {    // not check
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

    deleteComments(req, res, next);
    deleteData(req, res, next);
    deletePro(req, res, next);
        
    User.findByIdAndDelete(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { error = 'Error in user Delete :' + JSON.stringify(err, undefined, 2);
        console.log(error);
        return res.status(201).json({ message: error });
    }});

}
module.exports.deleteUsers = (req, res, next) => {    // not check

    res.send('not yet code');
    // if (!ObjectId.isValid(req.params.id))
    // return res.status(400).send(`No record with given id : ${req.params.id}`);

    // deleteComments(req, res, next);
    // deleteData(req, res, next);
    // deletePro(req, res, next);
        
    // User.findByIdAndDelete(req.params.id, (err, doc) => {
    //     if (!err) { res.send(doc); }
    //     else { error = 'Error in user Delete :' + JSON.stringify(err, undefined, 2);
    //     console.log(error);
    //     return res.status(201).json({ message: error });
    // }});

}
////////////////////////////////////////////////////////////////////   professional_data

module.exports.saveProfessionalData = (req, res, next) => { 
    // console.log(req._id);
    // res.send("KK")
    user_professional_data.find({user : req._id})
    .then(results => {
        // var s = results.length;
        // console.log(s)
        if(!(results.length > 0)){   
            // res.send(results)                                                                                
    user_profile.findOne({user: req._id})
        .populate('user', 'professional_data')
        .then(
            r => {
            if (r) {
                const errors = validationResult(req);
    
                if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                } else {
                    
                User.findById(req._id) // We are temporary adding a user as the author
                    .then(user => {
                    var professional_data = new user_professional_data({
                        cv: req.body.cv,
                    });
                    professional_data.skills.push (req.body.skills);
                    professional_data.languages.push (req.body.languages);
                    professional_data.qualifications.push (req.body.qualifications);
                    // res.send(r._id)
                    professional_data.user = user._id;
                    user_professional_data.create(professional_data)
                        .then(job_detail => { 
                            // console.log(job_detail);
                        r.professional_data.push(job_detail);
                        return r.save();
                        })
                        .then(r => {
                        return res.status(201).json({ message: 'data was added' });
                        });
                    });
                }
            } else {
                const error = new Error('no user profile found to add data');
                error.status = 404;
                return res.status(404).json({ status: false, message: error });
                throw error;
            }
            },
            err => {
            const error = new Error('invalid user profile id');
            error.status = 400;
            return res.status(404).json({ status: false, message: error });
            throw error;
            }
            
        ).catch(err => next(err));
    }else{
        updateData(req, res);
    }}).catch(err => next(err));
};


module.exports.getProfessionalData = (req, res ,next) => {

    // deleteData(req, res, next);
    // res.send(req._id)
    // console.log("ddfs");
    user_professional_data.find({user : req._id})
    .populate('user')
    .then(results => {
        if(results){
            res.status(200).json({ status:true,
            results: results.map(r => {
            return {
                id: r.id,
                cv: r.cv,
                skills: r.skills,
                languages: r.languages,
                qualifications: r.qualifications,
                user:
                (r.user && { fullName: r.user.fullName, email: r.user.email }) || null
            };
            })
        });
    }else{
        const error = new Error('no any data found');
        error.status = 404;
        // throw error;
        return res.status(404).json({ status: false, message: error });
    }
        })
        .catch(err => next(err));
}

module.exports.updateProfessionalData = (req, res, next) => {
    updateData(req, res);
}

var updateData = (req, res , next)=> {
    if (!ObjectId.isValid(req._id))
    return res.status(400).send(`No record with given id : ${req._id}`);

    user_professional_data.findOne({user: req._id}) // We are temporary adding a user as the author
    .then(profData => {
        // res.send(profData.id);
        // if(!userPro)
        var u_p_data = new user_professional_data({
            _id:profData.id,
            cv:req.body.cv
        });
        u_p_data.skills = [] ;
        u_p_data.languages = [];
        u_p_data.qualifications = [];
        u_p_data.user = profData.user;
        u_p_data.skills.push(req.body.skills);
        u_p_data.languages.push(req.body.languages);
        u_p_data.qualifications.push(req.body.qualifications);
        // res.send(u_p_data);
        user_professional_data.findOneAndUpdate({_id: profData.id} , u_p_data)
        .then(r => {
        return res.status(201).json({ message: 'User profile Updated' + " id:"+ r.id });
        });
    }).catch(err => next(err));
}

var deleteData = (req, res , next)=> {                
    if (!ObjectId.isValid(req._id))
    return res.status(400).send(`No record with given id : ${req._id}`);
// /
    user_professional_data.find({user : req._id})
        .populate('user')
        .then(results => {
            if(results){
                user_profile.findOne({user: req._id}).then(pr =>{
                results: results.map(r => {
                    user_professional_data.findByIdAndRemove({_id: r.id}, (err, doc) => {
                        if (!err) { 
                            // console.log(pr.professional_data)
                            pr.professional_data.remove(r.id);
                            pr.save();
                            // console.log(pr.professional_data)
                            var msg = {message: [{"User profile Updated &":""}, {"id":r.id}, doc ]};
                            return res.send(msg); 
                        }else {
                            error = 'Error in user Delete :' + JSON.stringify(err, undefined, 2);
                            return res.status(201).json({ message: error });
                        }  
                    }).catch(err => next(err));        
                }).catch(err => next(err));
                })
        }else{
            const error = new Error('no any data found');
            error.status = 404;
            // throw error;
            return res.status(404).json({ status: false, message: error });
        }
        }).catch(err => next(err));
}

// /////////////////////////////////////////////////////////////////////// comments

module.exports.saveUserComments = (req, res, next) => {  
    // console.log(req._id);
    // res.send("KK");

    user_profile.findOne({user: req._id})
        .populate('user', 'user_comments')
        .then(
            r => {
            if (r) {
                const errors = validationResult(req);
    
                if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                } else {
                    
                User.findById(req._id) // We are temporary adding a user as the author
                    .then(user => {
                    var comments = new user_comments({
                        comment: req.body.comment,
                        time: req.body.time
                    });
                    // res.send(r._id)
                    comments.user = user._id;
                    user_comments.create(comments)
                        .then(userComment => { 
                            // console.log(userComment);
                        r.user_comments.push(userComment);
                        return r.save();
                        })
                        .then(r => {
                        return res.status(201).json({ message: 'job details added' });
                        });
                    });
                }
            } else {
                const error = new Error('no user profile found to add job data');
                error.status = 404;
                return res.status(404).json({ status: false, message: error });
                throw error;
            }
            },
            err => {
            const error = new Error('invalid user profile id');
            error.status = 400;
            return res.status(404).json({ status: false, message: error });
            throw error;
            }
        ).catch(err => next(err));
    };


module.exports.getUComments = (req, res ,next) => {

    // deleteData(req, res, next);
    // res.send(req._id)
    user_comments.find({user : req._id})
    .populate('user')
    .then(results => {
        if(results){
            res.status(200).json({ status:true,
            results: results.map(r => {
            return {
                id: r.id,
                comment: r.comment,
                time: r.time,
                user:
                (r.user && { fullName: r.user.fullName, email: r.user.email }) || null
            };
            })
        });
    }else{
        const error = new Error('no any data found');
        error.status = 404;
        // throw error;
        return res.status(404).json({ status: false, message: error });
    }
        })
        .catch(err => next(err));
}

module.exports.deleteUComments = (req, res, next) => {
    deleteComments( req, res, next );
}

var deleteComments = (req, res ,next)=> {
    if (!ObjectId.isValid(req._id))
    return res.status(400).send(`No record with given id : ${req._id}`);

    user_comments.find({user : req._id})
        .populate('user')
        .then(results => {
            // console.log(results.length);
            if(results.length > 0){
                var re = {};
                var cmtId = {};
                user_profile.findOne({user: req._id}).then(pr =>{
                    cmtId = pr.user_comments;
                    results.map(r => {
                        re = r;    
                        cmtId = cmtId.remove(r.id);
                    });
                    // console.log(cmtId);
                    pr.user_comments = cmtId;
                    pr.save().then(a =>{
                        user_comments.deleteMany({user: re.user}, (err, doc) => {
                        if (!err) { 
                            msg = {message: [{"User profile Updated &":""}, {"id":re.id}, doc ]};
                            return res.send(msg);
                        }else { 
                            error = 'Error in user Delete :' + JSON.stringify(err, undefined, 2);
                            return res.status(201).json({ message: error });
                        }  
                        }).catch(err => next(err));
                    }).catch(err => next(err));
                }).catch(err => next(err));
        }else{
            const error = new Error('no any data found');
            error.status = 404;
            // throw error;
            return res.status(404).json({ status: false, message: error });
        }
        }).catch(err => next(err));
}
///////////////////////////////////////////////////////////////////                                   ////chek delete

// module.exports.deleteProfile = (req, res, next) => {
//     if (!ObjectId.isValid(req.params.id))
//     return res.status(400).send(`No record with given id : ${req.params.id}`);

//     deleteComments(req, res, next);
//     deleteData(req, res, next);

//     userProfile.findOneAndRemove(req.params.id, (err, doc) => {
//         if (!err) { res.send(doc); }
//         else { 
//             error = 'Error in userProfile Delete :' + JSON.stringify(err, undefined, 2);
//             console.log(error);
//             return res.status(201).json({ message: error });
//         }});

//     User.findByIdAndDelete(req.params.id, (err, doc) => {
//         if (!err) { res.send(doc); }
//         else { error = 'Error in user Delete :' + JSON.stringify(err, undefined, 2);
//         console.log(error);
//         return res.status(201).json({ message: error });
//     }});

// }
// ///////////////////////////////////////////////////////////////
    
    // module.exports.getUsers_withJobDe = (req, res) => {
    //     jobDetails.find().populate('user')
    //         .then(results => {
    //             if(results){
    //         res.status(200).json({ status:true,
    //             results: results.map(r => {
    //             return {
    //                 id: r.id,
    //                 skills: r.skills,
    //                 languages: r.languages,
    //                 codifications: r.codifications,
    //                 user:
    //                 (r.user && { id: r.user._id, fullName: r.user.fullName, email: r.user.email, password: r.user.password }) || null
    //             };
    //             })
    //         });
    //     }else{
    //             const error = new Error('no jobData found');
    //             error.status = 404;
    //             // throw error;
    //             return res.status(404).json({ status: false, message: error });
    //     }
    //         })
    //         .catch(err => next(err));
    // } 

    

    // module.exports.getUser_withJobDe = (req, res, next) => {
    //     jobDetails.findById(req.params.id)
    //         .populate('user')
    //         .then(
    //         r => {
    //             if (r) {
    //            return res.status(200).json({ status:true,jobDetails : _.pick(r,['id','skills','languages','colifications',
    //             'user'])});
    //             } else {
    //             const error = new Error('no jobdata found');
    //             error.status = 404;
    //             return res.status(404).json({ status: false, message: error });
    //             throw error;
    //             }
    //         },
    //         err => {
    //             const error = new Error('invalid jobdata id');
    //             error.status = 400;
    //             return res.status(404).json({ status: false, message: error });
    //             throw error;
    //         }
    //         )
    //         .catch(err => next(err));
    //     };


    // module.exports.saveJobdata = (req, res, next) => {  //set userProfile :id
    //     userProfile.findById(req.params.id)
    //         .populate('user', 'jobDetails.user')
    //         .then(
    //             r => {
    //             if (r) {
    //                 const errors = validationResult(req);
        
    //                 if (!errors.isEmpty()) {
    //                 res.status(422).json({ errors: errors.array() });
    //                 } else {

    //                 User.findOne() // We are tempory adding a user as the author
    //                     .then(user => {
    //                     var jobdetails = new jobDetails({
    //                         cv: req.body.cv,
    //                         skills: req.body.skills,
    //                         languages: req.body.languages,
    //                         colifications: req.body.colifications
    //                     });

    //                     jobdetails.user = user._id;
    //                     jobDetails.create(jobdetails)
    //                         .then(jobdetail => {
    //                         r.jobdata.push(jobdetail);
    //                         return r.save();
    //                         })
    //                         .then(r => {
    //                         return res.status(201).json({ message: 'jobdetails added' });
    //                         });
    //                     });
    //                 }
    //             } else {
    //                 const error = new Error('no userprofile found to add job data');
    //                 error.status = 404;
    //                 return res.status(404).json({ status: false, message: error });
    //                 throw error;
    //             }
    //             },
    //             err => {
    //             const error = new Error('invalid userprofile id');
    //             error.status = 400;
    //             return res.status(404).json({ status: false, message: error });
    //             throw error;
    //             }
    //         )
        
    //         .catch(err => next(err));
    //     };

   

  
    // module.exports.jobDetailsUpdate = (req, res) => {
      
    //     if (!ObjectId.isValid(req.params.id))
    //     return res.status(400).send(`No record with given id : ${req.params.id}`);

    //     jobDetails.findById(req.params.id)
    //     .then(
    //         r => {
    //         if (r) {
    //             const errors = validationResult(req);
    //             if (!errors.isEmpty()) {
    //             res.status(422).json({ errors: errors.array() });
    //             } else {

    //             var query = { user: r.user+"" };
    //             userProfile.findOne(query)
    //               .then(item1 => {
    //                 var jobdetails ={
    //                     cv: req.body.cv,
    //                     skills: req.body.skills,
    //                     languages: req.body.languages,
    //                     colifications: req.body.colifications
    //                 };
    //                 // item1 = JSON.parse(item1);
    //                 jobdetails.user = r.user;
    //                 jobDetails.findByIdAndUpdate(req.params.id , jobdetails)
    //                     .then(jobdetail => {
    //                         item1.jobdata.push(jobdetail);
    //                     return item1.save();
    //                     })
    //                     .then(r => {
    //                     return res.status(201).json({ message: 'jobdetails added' });
    //                     });
    //                 });
    //             }
    //         } else {
    //             const error = new Error('no jobdetails found');
    //             error.status = 404;
    //             return res.status(201).json({ message: error });
    //             throw error;
    //         }
    //         },
    //         err => {
    //         const error = new Error('invalid jobdetails id');
    //         error.status = 400;
    //         return res.status(201).json({ message: error });
    //         throw error;
    //         }
    //     )
    
    //     .catch(err => next(err));
        
    //     };

//     module.exports.deletejobdata = (req, res) => {
//         if (!ObjectId.isValid(req.params.id))
//             return res.status(400).send(`No record with given id : ${req.params.id}`);
    
//             jobDetails.findByIdAndRemove(req.params.id, (err, doc) => {
//             if (!err) { res.send(doc); }
//             else { 
//             error = 'Error in jobDetails Delete :' + JSON.stringify(err, undefined, 2);
//             console.log(error);
//             return res.status(201).json({ message: error });
//          }
//         });
//         };

//     module.exports.deleteProfile = (req, res, next) => {
//         if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send(`No record with given id : ${req.params.id}`);
  
//         User.findByIdAndDelete(req.params.id, (err, doc) => {
//             if (!err) { res.send(doc); }
//             else { error = 'Error in user Delete :' + JSON.stringify(err, undefined, 2);
//             console.log(error);
//             return res.status(201).json({ message: error });
//         }});
//         userProfile.findOneAndRemove(req.params.id, (err, doc) => {
//             if (!err) { res.send(doc); }
//             else { 
//                 error = 'Error in userProfile Delete :' + JSON.stringify(err, undefined, 2);
//                 console.log(error);
//                 return res.status(201).json({ message: error });
//             }});
//         jobDetails.findOneAndRemove(req.params.id, (err, doc) => {
//             if (!err) { res.send(doc); }
//             else { 
//             error = 'Error in jobDetails Delete :' + JSON.stringify(err, undefined, 2);
//             console.log(error);
//             return res.status(201).json({ message: error });
//          }
//     }).catch(err => next(err));
// }


// module.exports.getUser = (req, res, next) => {
//     var query = { user: req.params.id+"" };
//     userProfile.findOne(query)
//         .populate('user', 'jobDetails.user')
//         .then(
//         r => {
//             if (r) {

//             return res.status(200).json({status: true, userProfile : _.pick(r,['id','userName','position','office',
//                             'gender','birthday','about','profile_img','jobdata','user'])});
//             } else {
//             const error = new Error('no userprofile found');
//             error.status = 404;
//             // throw error;
//             return res.status(404).json({ status: false, message: error });
//             }_id
//         },
//         err => {
//             const error = new Error('invalid userprofile id');
//             error.status = 400;
//             return res.status(404).json({ status: false, message: error });
//             // throw error;
//         }
//         )
//         .catch(err => next(err));
//     };
