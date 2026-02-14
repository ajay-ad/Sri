const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  tabTitle: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  images: { type: [String], default: [] }, 
  text: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('History', HistorySchema);