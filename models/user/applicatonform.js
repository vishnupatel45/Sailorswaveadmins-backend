const mongoose = require('mongoose')

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

  module.exports= {
    FormData
  }