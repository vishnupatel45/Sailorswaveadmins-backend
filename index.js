const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const { GridFsStorage } = require('multer-gridfs-storage');
const { GridFSBucket } = require('mongodb');
const { FormData } = require('./models/user/applicatonform.js')
const { Subadmin } = require('./models/admin/subadmin.js')
// const { upload } = require('./utils/adminfiles.js')
const { mainSubadmin } = require('./models/subadmin/mainsubadmin.js')

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
    candidate.applicationstatus = true;
    res.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).send('Error fetching candidate.');
  }
});

//........................sub admin routes........................
app.get('/subadmin', async (req, res) => {
  try {
    // Use the Subadmin model directly
    const subadmin = await Subadmin.find();
    if (!subadmin) {
      return res.status(404).send('Subadmin not found.');
    }
    res.json(subadmin);
  } catch (error) {
    console.error('Error fetching subadmin:', error);
    res.status(500).send('Error fetching subadmin.');
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
  } catch (error) {
    console.error('Error fetching subadmin:', error);
    res.status(500).send('Error fetching subadmin.');
  }
});

// subadmin crud operation
app.delete('/subadmin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Subadmin.findByIdAndDelete(id);
    res.status(200).json({ message: 'Subadmin deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subadmin', error });
  }
});

app.put('/subadmin/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;

    const { name, number, email, password, MyApplication, AdmitCard, InterviewFeedback, SelectionLetter, ConfirmationLetter, Financials } = req.body;

    const updatedData = {
      name,
      number,
      email,
      password,
      checklist: {
        MyApplication: MyApplication === 'true',
        AdmitCard: AdmitCard === 'true',
        InterviewFeedback: InterviewFeedback === 'true',
        SelectionLetter: SelectionLetter === 'true',
        ConfirmationLetter: ConfirmationLetter === 'true',
        Financials: Financials === 'true',
      }
    };

    if (req.file) {
      updatedData.photoId = new mongoose.Types.ObjectId(req.file.id);
    }

    const updatedSubadmin = await Subadmin.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedSubadmin) {
      return res.status(404).json({ message: 'Subadmin not found.' });
    }

    res.status(200).json({ message: 'Subadmin updated successfully.', updatedSubadmin });
  } catch (error) {
    console.error('Error updating subadmin:', error);
    res.status(500).json({ message: 'Error updating subadmin', error });
  }
});

app.post("/subadmincreate", upload.single('file'), async (req, res) => {
  try {
    const { name, email, number, password, MyApplication, AdmitCard, InterviewFeedback, SelectionLetter, ConfirmationLetter, Financialsletter } = req.body;

    if (!name || !email || !number || !password || !req.file) {
      return res.status(400).send("All fields are required, including the file.");
    }

    // Create a new subadmin entry with checklist fields
    const newSubadmin = new Subadmin({
      name,
      number,
      email,
      password,
      photoId: new mongoose.Types.ObjectId(req.file.id),  // Ensure using Mongoose's ObjectId
      checklist: {
        MyApplication: MyApplication === 'true',  // Convert string to boolean
        AdmitCard: AdmitCard === 'true',
        InterviewFeedback: InterviewFeedback === 'true',
        SelectionLetter: SelectionLetter === 'true',
        ConfirmationLetter: ConfirmationLetter === 'true',
        Financials: Financialsletter === 'true'
      }
    });

    // Save subadmin to the database
    await newSubadmin.save();
    res.status(200).json({ message: 'Subadmin created successfully', subadmin: newSubadmin });
  } catch (err) {
    console.error('Error creating subadmin:', err);
    res.status(500).send("Server error. Could not create subadmin.");
  }
});

// ....................mainsubadmin......................
app.post('/loginmainsubadmin', async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body;
    if (adminEmail && adminPassword) {
      const Mainsubadmin = await mainSubadmin.findOne({ adminEmail });
      if (Mainsubadmin && Mainsubadmin.adminPassword === adminPassword) {
        res.status(200).json({ message: 'Mainsubadmin found', mainsubadmin: Mainsubadmin });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      res.status(400).send("Email and password are required");
    }
  } catch (error) {
    console.error('Error fetching mainsubadmin:', error);
  }
})

app.post("/mainsubadmin", async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body;
    const admins = new mainSubadmin({
      adminEmail, adminPassword
    })
    await admins.save()
    res.status(200).json({ message: 'MainSubadmin created successfully', Mainsubadmin: admins });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ message: 'Validation failed', error: error.message });
  }
})

app.delete("/mainsubadmin/:id", async (req, res) => {
  try {
    const _id = req.params.id
    const admins = await mainSubadmin.findByIdAndDelete(_id);
    res.status(200).json({ message: 'MainSubadmin deleted successfully', admins })
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ message: 'Validation failed', error: error.message });
  }
})



// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Sailors API');
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
