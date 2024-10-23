const express = require('express');
const userRoute = express.Router();
const {HandileUpdateuser, HandilePostuser,HandileGetuser} = require('../../Controlers/user/user')
const {HandleGetFileByID} = require('../../Controlers/Filebyid/filebyid')
const {upload} = require('../../utils/adminfiles')

const userfiles = [
    { name: 'passport', maxCount: 1 },
    { name: 'class10th', maxCount: 1 },
    { name: 'aadhar', maxCount: 1 }
]
userRoute.route('/userformsubmit').post(upload.fields(userfiles),HandilePostuser) //use to upload files and details of user

userRoute.route('/candidates').get(HandileGetuser) //Get the all the users

userRoute.route('/candidate/:id').patch(HandileUpdateuser) //use to updated the user based on the id

userRoute.route('/fileById/:id').get(HandleGetFileByID) //Get any file with photoID (base 64 value)

module.exports = {userRoute};