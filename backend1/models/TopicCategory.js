const mongoose = require('mongoose');
const { Schema} = mongoose;

const topicCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    section: { 
      type: String, 
      enum: ['VARC', 'DILR', 'QA', 'GENERAL'],
      default: 'GENERAL'
    },
    description: { type: String },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TopicCategory', topicCategorySchema);
