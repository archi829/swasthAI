const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    file_path: { type: String, required: true },
    date_of_visit: { type: String, required: true },
    hospital_name: { type: String },
    uploaded_at: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

module.exports = mongoose.model('Document', documentSchema); 