const express = require('express');
const router = express.Router();
const hierarchyController = require('../controllers/hierarchyController');
const { adminAuth } = require('../middleware/authMiddleware');

// Exam Category routes
router.get('/exam-categories', adminAuth, hierarchyController.getExamCategories);
router.post('/exam-categories', adminAuth, hierarchyController.createExamCategory);
router.put('/exam-categories/:id', adminAuth, hierarchyController.updateExamCategory);
router.delete('/exam-categories/:id', adminAuth, hierarchyController.deleteExamCategory);

// Exam Year routes
router.get('/exam-years', adminAuth, hierarchyController.getExamYears);
router.post('/exam-years', adminAuth, hierarchyController.createExamYear);
router.put('/exam-years/:id', adminAuth, hierarchyController.updateExamYear);
router.delete('/exam-years/:id', adminAuth, hierarchyController.deleteExamYear);

// Exam Slot routes
router.get('/exam-slots', adminAuth, hierarchyController.getExamSlots);
router.post('/exam-slots', adminAuth, hierarchyController.createExamSlot);
router.put('/exam-slots/:id', adminAuth, hierarchyController.updateExamSlot);
router.delete('/exam-slots/:id', adminAuth, hierarchyController.deleteExamSlot);

// Topic Category routes
router.get('/topic-categories', adminAuth, hierarchyController.getTopicCategories);
router.post('/topic-categories', adminAuth, hierarchyController.createTopicCategory);
router.put('/topic-categories/:id', adminAuth, hierarchyController.updateTopicCategory);
router.delete('/topic-categories/:id', adminAuth, hierarchyController.deleteTopicCategory);

// Topic Test Group routes
router.get('/topic-test-groups', adminAuth, hierarchyController.getTopicTestGroups);
router.post('/topic-test-groups', adminAuth, hierarchyController.createTopicTestGroup);
router.put('/topic-test-groups/:id', adminAuth, hierarchyController.updateTopicTestGroup);
router.delete('/topic-test-groups/:id', adminAuth, hierarchyController.deleteTopicTestGroup);

module.exports = router;
