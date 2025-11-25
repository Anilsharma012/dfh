const express = require('express');
const router = express.Router();
const {
  createSeries,
  getAllSeries,
  deleteSeries,
  createTest,
  getTests,
  deleteTest,
  updateTest,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestions,
  bulkUploadQuestions,
  toggleSeriesPublication,
  toggleTestPublication,
  getTestAnalytics
} = require('../controllers/AdminMockTestController');
const { adminAuth } = require('../middleware/authMiddleware');

// Admin routes for mock test management
router.post('/series', adminAuth, createSeries);
router.get('/series', adminAuth, getAllSeries);
router.delete('/series/:id', adminAuth, deleteSeries);
router.put('/series/:seriesId/publish', adminAuth, toggleSeriesPublication);

router.post('/test', adminAuth, createTest);
router.get('/tests', adminAuth, getTests);
router.put('/tests/:id', adminAuth, updateTest);
router.delete('/tests/:id', adminAuth, deleteTest);
router.put('/test/:testId/publish', adminAuth, toggleTestPublication);
router.get('/test/:testId/analytics', adminAuth, getTestAnalytics);

router.post('/question', adminAuth, createQuestion);
router.get('/questions', adminAuth, getQuestions);
router.put('/question/:id', adminAuth, updateQuestion);
router.delete('/question/:id', adminAuth, deleteQuestion);
router.post('/questions/bulk', adminAuth, bulkUploadQuestions);

module.exports = router;
