// backend/models/MockTestQuestion.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const optionSchema = new Schema(
  {
    label: { type: String }, // A/B/C/D
    value: { type: String }
  },
  { _id: false }
);

const marksSchema = new Schema(
  {
    positive: { type: Number, default: 3 },
    negative: { type: Number, default: -1 }
  },
  { _id: false }
); 

const mockTestQuestionSchema = new Schema(
  {
    testPaperId: { type: Schema.Types.ObjectId, ref: 'MockTest', required: true },
    sequenceNumber: { type: Number, required: true },
    
    section: { 
      type: String, 
      enum: ['VARC', 'DILR', 'QA', 'GENERAL'],
      required: true
    },
    
    questionType: { 
      type: String, 
      enum: ['SINGLE_CORRECT_MCQ', 'MULTI_CORRECT_MCQ', 'TITA', 'NUMERIC'],
      default: 'SINGLE_CORRECT_MCQ'
    },
    
    questionText: { type: String, required: true },
    passage: { type: String },
    images: [{ type: String }],

    options: [optionSchema],
    correctOptionIds: [{ type: String }],
    numericAnswer: { type: Number },
    textAnswer: { type: String },

    marks: { type: marksSchema, default: () => ({}) },
    difficulty: { 
      type: String, 
      enum: ['EASY', 'MEDIUM', 'HARD'],
      default: 'MEDIUM'
    },
    
    timeSuggestionSeconds: { type: Number },
    topicTag: { type: String },
    subTopicTag: { type: String },
    tags: [{ type: String }],
    
    explanation: { type: String },

    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

mockTestQuestionSchema.index({ testPaperId: 1, sequenceNumber: 1 }, { unique: true });

module.exports = mongoose.model('MockTestQuestion', mockTestQuestionSchema);
