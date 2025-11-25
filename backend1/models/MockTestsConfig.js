// server/models/MockTestsConfig.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Hum pura mock-test ka structure ek hi "tree" object me store karenge.
 * Is se schema simple rahega aur admin UI easily update karega.
 */

const MockTestsConfigSchema = new Schema(
  {
    tree: {
      type: Schema.Types.Mixed,
      default: {
        previousYear: {
          paperWise: {},   // { [examName]: { exams: [ { id, yearLabel, durationMinutes, totalMarks, declaration } ] } }
          topicWise: {},   // { [subject]: { topics: [ { id, title, topic, description, durationMinutes } ] } }
        },
        fullTests: [],     // [ { id, name, description, durationMinutes, totalMarks } ]
        seriesTests: [],   // [ { id, name, description, durationMinutes, totalMarks } ]
        moduleTests: [],   // [ { id, name, description, durationMinutes, totalMarks } ]
      },
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.MockTestsConfig ||
  mongoose.model('MockTestsConfig', MockTestsConfigSchema);
