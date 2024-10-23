const mongoose = require('mongoose')

const formSchema = new mongoose.Schema({
  applicationId: {
    type: Number,
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
  mobileNumber: { 
    type: String,
    required: true,
    unique: true
   },
  email: {
    type: String,
    required: true,
    unique: true
  },
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
  aadhar: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' },
  applicationstatus: {
    status: {
      type: String,
      enum: ['Not Checked', 'Approved', 'Rejected'],
      default: 'Not Checked'
    },
    OfficerName: {
      type: String,
      default:''
    }
  },
  admitcard: {
    status: {
      type: String,
      enum: ['Not Checked', 'Approved', 'Rejected'],
      default: 'Not Checked'
    },
    OfficerName: {
      type: String,
      default:''
    }
  },
  interviewoutcome:{
    date:{
      type:String,
      default:''
    },
    time:{
      type:String,
      default:''
    },
    OfficerName: {
      type: String,
      default:''
    }
  },
  selectionletter:{
    status: {
      type: String,
      enum: ['Not Checked', 'Approved', 'Rejected'],
      default: 'Not Checked'
    },
    OfficerName: {
      type: String,
      default:''
    }
  },
  confirmationletter:{
    status: {
      type: String,
      enum: ['Not Checked', 'Approved', 'Rejected'],
      default: 'Not Checked'
    },
    OfficerName: {
      type: String,
      default:''
    }
  }
});

const FormData = mongoose.model('UserFormData', formSchema);

module.exports = {
  FormData
}