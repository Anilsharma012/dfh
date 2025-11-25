const mongoose = require('mongoose');
const { Schema } = mongoose;

const topicTestGroupSchema = new Schema(
  {
    topicCategoryId: { type: Schema.Types.ObjectId, ref: 'TopicCategory', required: true },
    title: { type: String, required: true },
    description: { type: String },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

topicTestGroupSchema.index({ topicCategoryId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('TopicTestGroup', topicTestGroupSchema);
