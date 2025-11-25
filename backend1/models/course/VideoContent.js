const mongoose = require("mongoose");

const videoContentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    topicName: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: Number,
      required: true,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

videoContentSchema.index({ courseId: 1, serialNumber: 1 });

module.exports = mongoose.model("VideoContent", videoContentSchema);
