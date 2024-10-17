const express = require('express');
const applicationroute = express.Router();
const { Postapplicationform,Getapplicationform } = require('../controlers/application');

applicationroute.route('/').post(Postapplicationform).get(Getapplicationform)

module.exports = { applicationroute };