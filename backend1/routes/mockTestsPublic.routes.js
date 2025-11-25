// // server/routes/mockTestsPublic.routes.js
// const express = require('express');
// const router = express.Router();
// const MockTestsConfig = require('../models/MockTestsConfig');

// async function getConfigDoc() {
//   let doc = await MockTestsConfig.findOne();
//   if (!doc) {
//     doc = new MockTestsConfig();
//     await doc.save();
//   }
//   return doc;
// }

// // Student side: GET /api/mock-tests/tree
// router.get('/tree', async (req, res) => {
//   try {
//     const doc = await getConfigDoc();
//     return res.json({ success: true, data: doc.tree });
//   } catch (err) {
//     console.error('GET /mock-tests/tree error:', err);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to load mock tests tree',
//     });
//   }
// });

// module.exports = router;
