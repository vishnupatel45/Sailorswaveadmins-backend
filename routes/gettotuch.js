const express = require('express')
const routes = express.Router()
const {HandileAdduser} = require('../controlers/gettoTuch')

routes.route('/').post(HandileAdduser)

module.exports =  {routes}
