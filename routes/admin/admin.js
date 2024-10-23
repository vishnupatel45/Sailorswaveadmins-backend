const express = require('express');
const adminroute = express.Router();
const {HandileGetAdmin,HandileGetadminById,HandileDeleteadminById,HandileCreateadmin,HandileUpdateadminById} = require('../../Controlers/admin/admin');
const { upload } = require('../../utils/adminfiles');

adminroute.route('/subadmin').get(HandileGetAdmin)

adminroute.route('/subadmin/:id').get(HandileGetadminById );

adminroute.route('/subadmin/:id').delete(HandileDeleteadminById);

adminroute.route('/subadmin/:id').put(upload.single('file'),HandileUpdateadminById);

adminroute.route("/subadmincreate").post(upload.single('file'),HandileCreateadmin);

module.exports = {
    adminroute
}