const mongoose = require('mongoose');

const SubadminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' },  // Reference to GridFS file
    checklist: {
      MyApplication: { type: Boolean, default: false },
      AdmitCard: { type: Boolean, default: false },
      InterviewFeedback: { type: Boolean, default: false },
      SelectionLetter: { type: Boolean, default: false },
      ConfirmationLetter: { type: Boolean, default: false },
      Financials:{type:Boolean,default:false}
    }
  });
  
  
  const Subadmin = mongoose.model('Subadmin', SubadminSchema);

  module.exports = {
    Subadmin
  }