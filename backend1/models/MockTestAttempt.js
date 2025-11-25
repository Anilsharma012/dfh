// backend/models/MockTestAttempt.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionResponseSchema = new Schema(
  {
    questionId: { type: Schema.Types.ObjectId, ref: 'MockTestQuestion', required: true },
    chosenOptionIds: [{ type: String }],
    typedAnswer: { type: String },
    isCorrect: { type: Boolean, default: false },
    timeSpentSeconds: { type: Number, default: 0 },
    visitedCount: { type: Number, default: 0 },
    markedForReview: { type: Boolean, default: false }
  },
  { _id: false }
);

const sectionWiseStatsSchema = new Schema(
  {
    section: { type: String, required: true },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    attempted: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
    unattempted: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 }
  },
  { _id: false }
);

const mockTestAttemptSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    testPaperId: { type: Schema.Types.ObjectId, ref: 'MockTest', required: true },
    seriesId: { type: Schema.Types.ObjectId, ref: 'MockTestSeries' },

    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    
    status: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED'],
      default: 'NOT_STARTED'
    },

    totalScore: { type: Number, default: 0 },
    totalMaxScore: { type: Number, default: 0 },
    totalTimeTakenSeconds: { type: Number, default: 0 },

    responses: [questionResponseSchema],
    sectionWiseStats: [sectionWiseStatsSchema],

    rank: { type: Number },
    percentile: { type: Number }
  },
  { timestamps: true }
);

mockTestAttemptSchema.index({ userId: 1, testPaperId: 1 });

module.exports = mongoose.model('MockTestAttempt', mockTestAttemptSchema);
