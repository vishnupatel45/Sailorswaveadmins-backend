const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const { GridFsStorage } = require('multer-gridfs-storage');
const { GridFSBucket } = require('mongodb');


// Initialize Express app
const app = express();
const PORT = 7001;
const mongoURI = 'mongodb://localhost:27017/Sailors';

// DB Connection using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize GridFSBucket after connection is open
let gfsBucket;
conn.once('open', () => {
  gfsBucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
  console.log('GridFSBucket initialized');
});

// Define Mongoose schema and model for form data
const formSchema = new mongoose.Schema({
  applicationId: {
    type: Number,
  },
  applicationstatus: {
    type: Boolean
  },
  applyFor: { type: String, required: true },
  candidateName: { type: String, required: true },
  fatherName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male'
  },

  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  houseNo: { type: String },
  postOffice: { type: String },
  policeStation: { type: String },
  district: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  tenthschool: { type: String },
  tenthyear: { type: String },
  tenthpercentage: { type: String },
  twelfthschool: { type: String },
  twelfthyear: { type: String },
  twelfthpercentage: { type: String },
  degreeschool: { type: String },
  degreeyear: { type: String },
  degreepercentage: { type: String },
  passport: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' },
  class10th: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' },
  aadhar: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' }
});
const FormData = mongoose.model('UserFormData', formSchema);

const SubadminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' }  // Reference to GridFS file
});

const Subadmin = mongoose.model('Subadmin', SubadminSchema);


// Multer GridFS Storage configuration
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'  // Bucket name should match the one used in GridFSBucket
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

//////////////////////////////creating subadmin///////////////////////
app.post("/subadmincreate", upload.single('file'), async (req, res) => {
  try {
    const { name, email, number, password } = req.body;

    if (!name || !email || !number || !password || !req.file) {
      return res.status(400).send("All fields are required, including the file.");
    }

    // Create a new subadmin entry
    const newSubadmin = new Subadmin({
      name,
      number,
      email,
      password,
      photoId: new mongoose.Types.ObjectId(req.file.id)  // Ensure using Mongoose's ObjectId
    });

    // Save subadmin to the database
    await newSubadmin.save();
    res.status(200).json({ message: 'Subadmin created successfully', subadmin: newSubadmin });
  } catch (err) {
    console.error('Error creating subadmin:', err);
    res.status(500).send("Server error. Could not create subadmin.");
  }
});



// Get file by ID
app.get('/fileById/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const file = await conn.db.collection('uploads.files').findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (!file) {
      return res.status(404).send('File not found.');
    }

    const downloadStream = gfsBucket.openDownloadStream(file._id);
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error fetching file by id:', error);
    res.status(500).send('Error fetching file.');
  }
});


/////////////////////it can be or can not be used//////////////////
app.patch('/candidate/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const candidate = await FormData.find({ applicationId: id });
    console.log('Candidate:', candidate); // Add this line to log the candidate objec
    if (!candidate) {
      return res.status(404).send('candidate not found');
    }
    candidate.applicationstatus=true; 
    res.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).send('Error fetching candidate.');
  }
});

app.get('/candidates', async (req, res) => {
  try {
    const candidates = await FormData.find({});
    if (!candidates || candidates.length === 0) {
      return res.status(404).send('No candidates found');
    }

    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).send('Error fetching candidates');
  }
});


// Post route for form submission
app.post('/userformsubmit', upload.fields([
  { name: 'passport', maxCount: 1 },
  { name: 'class10th', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 }
]), async (req, res) => {
  try {
    let applicationId;
    let exists = true;

    // Generate a unique application ID
    while (exists) {
      applicationId = Math.floor(1000000000 + Math.random() * 9000000000);
      exists = await FormData.exists({ applicationId: applicationId });
    }
    const {
      applyFor, candidateName, fatherName, dob, gender, mobileNumber,
      email, houseNo, postOffice, policeStation, district, city, state,
      postalCode, tenthschool, tenthyear, tenthpercentage, twelfthschool,
      twelfthyear, twelfthpercentage, degreeschool, degreeyear, degreepercentage
    } = req.body;

    // Check if all required fields are filled
    if (!tenthschool || !mobileNumber || !degreepercentage || !degreeyear || !degreeschool || !twelfthyear ||
      !twelfthpercentage || !twelfthschool || !tenthpercentage || !tenthyear || !applyFor || !candidateName ||
      !fatherName || !dob || !gender || !mobileNumber || !email || !houseNo || !postOffice || !policeStation ||
      !district || !city || !state || !postalCode || !req.files['passport'] || !req.files['class10th'] || !req.files['aadhar']) {
      return res.status(400).send('Please fill all the fields.');
    }

    const newFormData = new FormData({
      applicationId: applicationId, applicationstatus: false,
      applyFor, candidateName, fatherName, dob, gender, mobileNumber, email, houseNo, postOffice, policeStation, district,
      city, state, postalCode, tenthschool, tenthyear, tenthpercentage, twelfthschool, twelfthyear, twelfthpercentage,
      degreeschool, degreeyear, degreepercentage,
      passport: new mongoose.Types.ObjectId(req.files['passport'][0].id),
      class10th: new mongoose.Types.ObjectId(req.files['class10th'][0].id),
      aadhar: new mongoose.Types.ObjectId(req.files['aadhar'][0].id)
    });

    // Save to the database
    await newFormData.save();
    res.status(200).json({ message: 'Form submitted successfully', data: newFormData });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Error submitting form.');
  }
});

app.get('/subadmin/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Use the Subadmin model directly
    const subadmin = await Subadmin.findById(id);
    if (!subadmin) {
      return res.status(404).send('Subadmin not found.');
    }
    res.json(subadmin);
  } catch(error) {
    console.error('Error fetching subadmin:', error);
    res.status(500).send('Error fetching subadmin.');
  }
});


// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Sailors API');
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on this port and  http://localhost:${PORT}`));
