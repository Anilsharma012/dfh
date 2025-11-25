const express = require('express');
const router = express.Router();
const {
  getPublishedSeries,
  getTestsInSeries,
  getTestDetails,
  startTestAttempt,
  getAttemptData,
  saveResponse,
  syncProgress,
  transitionSection,
  submitTest,
  getTestHistory,
  getMockTestTree,
  getAttemptReview
} = require('../controllers/MockTestController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');

// Student routes for mock tests

// Student dashboard ke Mock Tests page ke liye:
router.get('/tree', optionalAuth, getMockTestTree);

router.get('/series', getPublishedSeries);
router.get('/series/:seriesId/tests', optionalAuth, getTestsInSeries);
router.get('/test/:testId/details', optionalAuth, getTestDetails);
router.post('/test/:testId/start', authMiddleware, startTestAttempt);
router.get('/attempt/:attemptId', authMiddleware, getAttemptData);
router.put('/attempt/:attemptId/response', authMiddleware, saveResponse);

// Session persistence endpoints
router.post('/attempt/:attemptId/sync', authMiddleware, syncProgress);
router.post('/attempt/:attemptId/transition-section', authMiddleware, transitionSection);

router.post('/attempt/:attemptId/submit', authMiddleware, submitTest);
router.get('/attempt/:attemptId/review', authMiddleware, getAttemptReview);
router.get('/history', authMiddleware, getTestHistory);

module.exports = router;
