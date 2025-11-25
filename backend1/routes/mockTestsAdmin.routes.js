// // server/routes/mockTestsAdmin.routes.js
// const express = require('express');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
// const MockTestsConfig = require('../models/MockTestsConfig');

// // helper: config doc lao ya naya banao
// async function getConfigDoc() {
//   let doc = await MockTestsConfig.findOne();
//   if (!doc) {
//     doc = new MockTestsConfig();
//     await doc.save();
//   }
//   return doc;
// }

// // ---------------------- GET TREE (admin) ----------------------
// router.get('/tree', async (req, res) => {
//   try {
//     const doc = await getConfigDoc();
//     return res.json({ success: true, data: doc.tree });
//   } catch (err) {
//     console.error('GET /admin/mock-tests/tree error:', err);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to load mock tests tree',
//     });
//   }
// });

// // ---------------------- PREVIOUS YEAR – PAPER WISE ----------------------

// // Add exam category
// router.post('/previous-year/paper-wise/exam', async (req, res) => {
//   try {
//     const { examName } = req.body;
//     if (!examName) {
//       return res
//         .status(400)
//         .json({ success: false, message: 'examName required' });
//     }

//     const doc = await getConfigDoc();
//     const tree = doc.tree || {};
//     tree.previousYear = tree.previousYear || {};
//     tree.previousYear.paperWise = tree.previousYear.paperWise || {};

//     if (!tree.previousYear.paperWise[examName]) {
//       tree.previousYear.paperWise[examName] = { exams: [] };
//     }

//     doc.tree = tree;
//     doc.markModified('tree');
//     await doc.save();

//     return res.json({ success: true, data: doc.tree });
//   } catch (err) {
//     console.error('POST add exam error:', err);
//     return res
//       .status(500)
//       .json({ success: false, message: 'Failed to create exam category' });
//   }
// });

// // Add year/slot inside exam
// router.post(
//   '/previous-year/paper-wise/exam/:examName/year',
//   async (req, res) => {
//     try {
//       const { examName } = req.params;
//       const { yearLabel, durationMinutes, totalMarks, declaration } = req.body;

//       if (!yearLabel) {
//         return res
//           .status(400)
//           .json({ success: false, message: 'yearLabel required' });
//       }

//       const doc = await getConfigDoc();
//       const tree = doc.tree || {};
//       tree.previousYear = tree.previousYear || {};
//       tree.previousYear.paperWise = tree.previousYear.paperWise || {};
//       const examConfig =
//         tree.previousYear.paperWise[examName] || { exams: [] };

//       const newYear = {
//         id: uuidv4(),
//         yearLabel,
//         durationMinutes: Number(durationMinutes) || 0,
//         totalMarks: Number(totalMarks) || 0,
//         declaration: declaration || '',
//       };

//       examConfig.exams.push(newYear);
//       tree.previousYear.paperWise[examName] = examConfig;

//       doc.tree = tree;
//       doc.markModified('tree');
//       await doc.save();

//       return res.json({ success: true, data: doc.tree });
//     } catch (err) {
//       console.error('POST add year error:', err);
//       return res
//         .status(500)
//         .json({ success: false, message: 'Failed to add year/slot' });
//     }
//   }
// );

// // ---------------------- PREVIOUS YEAR – TOPIC WISE ----------------------

// // Add subject
// router.post('/previous-year/topic-wise/subject', async (req, res) => {
//   try {
//     const { subject } = req.body;
//     if (!subject) {
//       return res
//         .status(400)
//         .json({ success: false, message: 'subject required' });
//     }

//     const doc = await getConfigDoc();
//     const tree = doc.tree || {};
//     tree.previousYear = tree.previousYear || {};
//     tree.previousYear.topicWise = tree.previousYear.topicWise || {};

//     if (!tree.previousYear.topicWise[subject]) {
//       tree.previousYear.topicWise[subject] = { topics: [] };
//     }

//     doc.tree = tree;
//     doc.markModified('tree');
//     await doc.save();

//     return res.json({ success: true, data: doc.tree });
//   } catch (err) {
//     console.error('POST add subject error:', err);
//     return res
//       .status(500)
//       .json({ success: false, message: 'Failed to add subject' });
//   }
// });

// // Add topic test
// router.post(
//   '/previous-year/topic-wise/subject/:subject/topic',
//   async (req, res) => {
//     try {
//       const { subject } = req.params;
//       const { title, topic, description, durationMinutes } = req.body;

//       if (!title) {
//         return res
//           .status(400)
//           .json({ success: false, message: 'title required' });
//       }

//       const doc = await getConfigDoc();
//       const tree = doc.tree || {};
//       tree.previousYear = tree.previousYear || {};
//       tree.previousYear.topicWise = tree.previousYear.topicWise || {};
//       const subjConfig =
//         tree.previousYear.topicWise[subject] || { topics: [] };

//       const newTopic = {
//         id: uuidv4(),
//         title,
//         topic: topic || '',
//         description: description || '',
//         durationMinutes: Number(durationMinutes) || 0,
//       };

//       subjConfig.topics.push(newTopic);
//       tree.previousYear.topicWise[subject] = subjConfig;

//       doc.tree = tree;
//       doc.markModified('tree');
//       await doc.save();

//       return res.json({ success: true, data: doc.tree });
//     } catch (err) {
//       console.error('POST add topic error:', err);
//       return res
//         .status(500)
//         .json({ success: false, message: 'Failed to add topic test' });
//     }
//   }
// );

// // ---------------------- SIMPLE TEST TYPES (FULL / SERIES / MODULE) ----------------------

// function ensureArrays(tree) {
//   tree.fullTests = tree.fullTests || [];
//   tree.seriesTests = tree.seriesTests || [];
//   tree.moduleTests = tree.moduleTests || [];
// }

// router.post('/full-tests', async (req, res) => {
//   try {
//     const { name, description, durationMinutes, totalMarks } = req.body;
//     if (!name) {
//       return res
//         .status(400)
//         .json({ success: false, message: 'name required' });
//     }

//     const doc = await getConfigDoc();
//     const tree = doc.tree || {};
//     ensureArrays(tree);

//     tree.fullTests.push({
//       id: uuidv4(),
//       name,
//       description: description || '',
//       durationMinutes: Number(durationMinutes) || 0,
//       totalMarks: Number(totalMarks) || 0,
//     });

//     doc.tree = tree;
//     doc.markModified('tree');
//     await doc.save();

//     return res.json({ success: true, data: doc.tree });
//   } catch (err) {
//     console.error('POST full-tests error:', err);
//     return res
//       .status(500)
//       .json({ success: false, message: 'Failed to create full test' });
//   }
// });

// router.post('/series-tests', async (req, res) => {
//   try {
//     const { name, description, durationMinutes, totalMarks } = req.body;
//     if (!name) {
//       return res
//         .status(400)
//         .json({ success: false, message: 'name required' });
//     }

//     const doc = await getConfigDoc();
//     const tree = doc.tree || {};
//     ensureArrays(tree);

//     tree.seriesTests.push({
//       id: uuidv4(),
//       name,
//       description: description || '',
//       durationMinutes: Number(durationMinutes) || 0,
//       totalMarks: Number(totalMarks) || 0,
//     });

//     doc.tree = tree;
//     doc.markModified('tree');
//     await doc.save();

//     return res.json({ success: true, data: doc.tree });
//   } catch (err) {
//     console.error('POST series-tests error:', err);
//     return res
//       .status(500)
//       .json({ success: false, message: 'Failed to create series test' });
//   }
// });

// router.post('/module-tests', async (req, res) => {
//   try {
//     const { name, description, durationMinutes, totalMarks } = req.body;
//     if (!name) {
//       return res
//         .status(400)
//         .json({ success: false, message: 'name required' });
//     }

//     const doc = await getConfigDoc();
//     const tree = doc.tree || {};
//     ensureArrays(tree);

//     tree.moduleTests.push({
//       id: uuidv4(),
//       name,
//       description: description || '',
//       durationMinutes: Number(durationMinutes) || 0,
//       totalMarks: Number(totalMarks) || 0,
//     });

//     doc.tree = tree;
//     doc.markModified('tree');
//     await doc.save();

//     return res.json({ success: true, data: doc.tree });
//   } catch (err) {
//     console.error('POST module-tests error:', err);
//     return res
//       .status(500)
//       .json({ success: false, message: 'Failed to create module test' });
//   }
// });

// // delete simple tests
// router.delete('/full-tests/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const doc = await getConfigDoc();
//     const tree = doc.tree || {};
//     ensureArrays(tree);

//     tree.fullTests = tree.fullTests.filter((t) => t.id !== id);
//     doc.tree = tree;
//     doc.markModified('tree');
//     await doc.save();

//     return res.json({ success: true, data: doc.tree });
//   } catch (err) {
//     console.error('DELETE full-tests error:', err);
//     return res
//       .status(500)
//       .json({ success: false, message: 'Failed to delete full test' });
//   }
// });

// router.delete('/series-tests/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const doc = await getConfigDoc();
//     const tree = doc.tree || {};
//     ensureArrays(tree);

//     tree.seriesTests = tree.seriesTests.filter((t) => t.id !== id);
//     doc.tree = tree;
//     doc.markModified('tree');
//     await doc.save();

//     return res.json({ success: true, data: doc.tree });
//   } catch (err) {
//     console.error('DELETE series-tests error:', err);
//     return res
//       .status(500)
//       .json({ success: false, message: 'Failed to delete series test' });
//   }
// });

// router.delete('/module-tests/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const doc = await getConfigDoc();
//     const tree = doc.tree || {};
//     ensureArrays(tree);

//     tree.moduleTests = tree.moduleTests.filter((t) => t.id !== id);
//     doc.tree = tree;
//     doc.markModified('tree');
//     await doc.save();

//     return res.json({ success: true, data: doc.tree });
//   } catch (err) {
//     console.error('DELETE module-tests error:', err);
//     return res
//       .status(500)
//       .json({ success: false, message: 'Failed to delete module test' });
//   }
// });

// module.exports = router;
