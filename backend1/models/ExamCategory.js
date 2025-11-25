const mongoose = require('mongoose');
const { Schema } = mongoose;

const examCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    shortCode: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String },
    color: { type: String },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExamCategory', examCategorySchema);
