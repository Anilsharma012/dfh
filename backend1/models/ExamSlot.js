const mongoose = require('mongoose');
const { Schema } = mongoose;

const examSlotSchema = new Schema(
  {
    examYearId: { type: Schema.Types.ObjectId, ref: 'ExamYear', required: true },
    label: { type: String, required: true },
    description: { type: String },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

examSlotSchema.index({ examYearId: 1, label: 1 }, { unique: true });

module.exports = mongoose.model('ExamSlot', examSlotSchema);
