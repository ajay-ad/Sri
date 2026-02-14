const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  tabTitle: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  images: { type: [String], default: [] },
  text: { type: String, required: true },
  order: { type: Number, default: 0 } // To keep tabs in order
}, { timestamps: true });