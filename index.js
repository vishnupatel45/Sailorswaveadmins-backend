const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { FormData } = require('./models/user/applicatonform.js')
const { Subadmin } = require('./models/admin/subadmin.js')
const { upload } = require('./utils/adminfiles.js')
const { mainSubadmin } = require('./models/subadmin/mainsubadmin.js');
const { userRoute } = require('./routes/user/user.js');
const { adminroute } = require('./routes/admin/admin.js');
const { subadminroute } = require('./routes/subadmin/subadmin.js');
const {HandileDBconnection} = require('./connections/dbconnect.js')


// Initialize Express app
const app = express();
const PORT = 7001;

// Middleware
app.use(cors());
app.use(express.json());

HandileDBconnection('mongodb://localhost:27017/Sailors')

//routes
app.get('/', (req, res) => {res.send('Welcome to Sailors API')});
app.use('/',userRoute)
app.use('/',adminroute)
app.use('/',subadminroute)


// Start the server
app.listen(PORT, () => console.log(`Server is running on this port and  http://localhost:${PORT}`));
