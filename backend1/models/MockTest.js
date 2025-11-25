// backend/models/MockTest.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const sectionSchema = new Schema(
  {
    name: { type: String, required: true },       // VARC / DILR / QA
    duration: { type: Number, required: true },   // minutes
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'MockTestQuestion' }]
  },
  { _id: false }
);

const instructionsSchema = new Schema(
  {
    general: [{ type: String }],
    // section name → string[] instructions
    sectionSpecific: {
      type: Map, 
      of: [String]
    }
  },
  { _id: false }
);

const mockTestSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    seriesId: { type: Schema.Types.ObjectId, ref: 'MockTestSeries', required: true },
    testNumber: { type: Number, default: 1 },

    duration: { type: Number, required: true }, // total test duration in minutes
    totalQuestions: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },

    sections: [sectionSchema],
    instructions: instructionsSchema,

    isFree: { type: Boolean, default: false },
    price: { type: Number, default: null }, // Price in INR if paid test
    difficulty: { type: String, default: 'Medium' },

    isActive: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },

    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },

    // Test Type and Category
    testType: {
      type: String,
      enum: ['previousYear', 'full', 'series', 'module', 'sessional', 'other'],
      default: 'full'
    },
    paperType: {
      type: String,
      enum: ['paperWise', 'topicWise'],
      default: null
    },

    // Previous Year Papers - Paper Wise Mapping
    previousYearExamCategoryId: { type: Schema.Types.ObjectId, ref: 'ExamCategory' },
    previousYearExamYearId: { type: Schema.Types.ObjectId, ref: 'ExamYear' },
    previousYearExamSlotId: { type: Schema.Types.ObjectId, ref: 'ExamSlot' },

    // Previous Year Papers - Topic Wise Mapping
    topicCategoryId: { type: Schema.Types.ObjectId, ref: 'TopicCategory' },
    topicTestGroupId: { type: Schema.Types.ObjectId, ref: 'TopicTestGroup' },

    // Legacy fields for backward compatibility
    exam: { type: String },
    yearLabel: { type: String },
    subject: { type: String },
    topic: { type: String },
    sessionYear: { type: String },

    // Visibility and Access Control
    visibility: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT'
    },

    // Scheduling (for series tests)
    liveFrom: { type: Date },
    liveTill: { type: Date },
    orderIndex: { type: Number, default: 0 },

    // Marks Configuration
    negativeMarkPerQuestion: { type: Number, default: -1 },
    sectionTimeConfig: {
      hasSectionWiseTime: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MockTest', mockTestSchema);
