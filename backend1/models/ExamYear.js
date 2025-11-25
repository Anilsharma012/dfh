const mongoose = require('mongoose');
const { Schema } = mongoose;

const examYearSchema = new Schema(
  {
    examCategoryId: { type: Schema.Types.ObjectId, ref: 'ExamCategory', required: true },
    label: { type: String, required: true },
    description: { type: String },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

examYearSchema.index({ examCategoryId: 1, label: 1 }, { unique: true });

module.exports = mongoose.model('ExamYear', examYearSchema);
