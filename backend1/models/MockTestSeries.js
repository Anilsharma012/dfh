// backend/models/MockTestSeries.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const enrolledStudentSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    purchaseDate: { type: Date },
    expiryDate: { type: Date }
  },
  { _id: false }
);

const mockTestSeriesSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, default: 'GENERAL' }, // CAT / SNAP / etc.
    freeTests: { type: Number, default: 0 },
    price: { type: Number, default: 0 }, // in ₹
    validity: { type: Number, default: 0 }, // days
    tags: [{ type: String }],

    isActive: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },

    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    enrolledStudents: [enrolledStudentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('MockTestSeries', mockTestSeriesSchema);
 