const mongoose = require('mongoose');

// Define the schema for the application form
const ApplicationSchema = new mongoose.Schema({
  applicationId:{
    type: Number,
  },
  applicationstatus:{
    type:Boolean
  },
  applyFor: {
    type: String,
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male'
  },
  mobileNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  houseNo: {
    type: String,
    required: true
  },
  postOffice: {
    type: String,
    required: true
  },
  policeStation: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  postalCode: {
    type: Number,
    required: true
  },
  tenthschool: {            // Updated to match formData
    type: String,
    required: true
  },
  tenthyear: {             // Updated to match formData
    type: Number,
    required: true
  },
  tenthpercentage: {        // Updated to match formData
    type: Number,
    required: true
  },
  twelfthschool: {          // Updated to match formData
    type: String,
    required: true
  },
  twelfthyear: {            // Updated to match formData
    type: Number,
    required: true
  },
  twelfthpercentage: {
    type: Number,
    required: true // or default: 0, or any other default value
  },
  degreeschool: {           // Updated to match formData
    type: String,
    required: true
  },
  degreeyear: {             // Updated to match formData
    type: Number,
    required: true
  },
  degreepercentage: {        // Updated to match formData
    type: Number,
    required: true
  },
  passport:{
    type:String,
    required:false
  },
  class10th:{
    type:String,
    required:false
  },
  aadhar:{
    type:String,
    required:false
  }
}, { timestamps: true });
const Candidate = mongoose.model('Application', ApplicationSchema);

module.exports = { Candidate };