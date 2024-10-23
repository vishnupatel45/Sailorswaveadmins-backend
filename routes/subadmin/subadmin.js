const express = require('express')
const subadminroute = express.Router()
const {HandileLoginsubadmin,HandileCreateSubadmin,HandileDeleteById} = require('../../Controlers/subadmin/subadmin')

subadminroute.route("/mainsubadmin").post(HandileCreateSubadmin) // create a new subadmin

subadminroute.route('/loginmainsubadmin').post(HandileLoginsubadmin) //login for subadmin

subadminroute.route("/mainsubadmin/:id").delete(HandileDeleteById) //delete subadmin by id

module.exports = {
    subadminroute
}