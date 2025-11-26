const express = require('express');
const router = express.Router();

const Course = require('../models/course/Course');
const Enrollment = require('../models/Enrollment');
const SubjectProgress = require('../models/SubjectProgress');
const Batch = require('../models/Batch');
const Session = require('../models/Session');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * Rotate an array so that it starts from `start` element.
 */
const rotate = (arr, start) => {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const idx = Math.max(0, arr.findIndex((x) => x === start));
  return arr.slice(idx).concat(arr.slice(0, idx));
};

/**
 * Decide which subject (A/B/C/D) the student should work on next.
 */
const getNextSubject = async (enrollment, course) => {
  const subjects = Array.isArray(course.subjects) && course.subjects.length
    ? course.subjects
    : ['A', 'B', 'C', 'D'];

  const order = rotate(subjects, course.startSubject || 'A');

  const doneList = await SubjectProgress.find({
    enrollmentId: enrollment._id,
    status: 'done',
  }).lean();

  const doneSet = new Set(doneList.map((d) => d.subject));
  const pending = order.find((s) => !doneSet.has(s));

  return pending || order[0];
};

/**
 * GET /api/student/next-step
 *
 * Returns the "next step" for the logged-in student:
 * - enrollment + course info
 * - nextSubject
 * - few upcoming sessions for that subject
 * - simple validity meta
 */
router.get('/student/next-step', authMiddleware, async (req, res) => {
  try {
    const user = req.user || {};
    const userId = user.id || user._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const { courseId: courseIdFromQuery } = req.query;

    let enrollmentQuery = { userId };
    if (courseIdFromQuery) {
      enrollmentQuery.courseId = courseIdFromQuery;
    }

    // Most recent active enrollment
    let enrollment = await Enrollment.findOne(enrollmentQuery).sort({ updatedAt: -1 });
    if (!enrollment && !courseIdFromQuery) {
      // fallback: any enrollment for user
      enrollment = await Enrollment.findOne({ userId }).sort({ updatedAt: -1 });
    }

    if (!enrollment) {
      return res.json({
        success: true,
        enrollment: null,
        course: null,
        nextSubject: null,
        sessions: [],
        upcomingSessions: [],
        joinable: false,
        validity: null,
        message: 'No active enrollment found for this student',
      });
    }

    const course = await Course.findById(enrollment.courseId);
    if (!course) {
      return res.json({
        success: true,
        enrollment,
        course: null,
        nextSubject: null,
        sessions: [],
        upcomingSessions: [],
        joinable: false,
        validity: null,
        message: 'Course not found for this enrollment',
      });
    }

    const now = new Date();
    const validTill = enrollment.validTill ? new Date(enrollment.validTill) : null;

    let validity = null;
    if (validTill) {
      const diffMs = validTill.getTime() - now.getTime();
      const leftDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      validity = {
        leftDays,
        validTill,
        expired: diffMs < 0,
      };
    }

    const nextSubject = await getNextSubject(enrollment, course);

    // Find a batch that covers this course
    let batch = await Batch.findOne({ courseIds: course._id });
    if (!batch) {
      batch = await Batch.findOne();
    }

    let sessions = [];
    if (batch && nextSubject) {
      sessions = await Session.find({
        batchId: batch._id,
        subject: nextSubject,
      })
        .sort({ startAt: 1 })
        .limit(5)
        .lean();
    }

    const mappedSessions = (sessions || []).map((s) => ({
      id: s._id,
      startAt: s.startAt,
      endAt: s.endAt,
      joinUrl: s.joinUrl,
      recordingUrl: s.recordingUrl || null,
    }));

    // Simple "joinable" flag: if the first session is within 10 minutes before start
    let joinable = false;
    if (mappedSessions.length > 0) {
      const first = mappedSessions[0];
      if (first.startAt) {
        const diffMinutes = (new Date(first.startAt).getTime() - now.getTime()) / (1000 * 60);
        // e.g. allow join from -10 to +120 minutes around the start time
        if (diffMinutes <= 10 && diffMinutes >= -120) {
          joinable = true;
        }
      }
    }

    return res.json({
      success: true,
      enrollment: {
        _id: enrollment._id,
        courseId: enrollment.courseId,
        validTill: enrollment.validTill,
        status: enrollment.status,
      },
      course: {
        _id: course._id,
        name: course.name,
      },
      nextSubject,
      sessions: mappedSessions,
      upcomingSessions: mappedSessions,
      joinable,
      validity,
    });
  } catch (e) {
    console.error('next-step error', e);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate next step',
      error: e.message,
    });
  }
});

/**
 * Update subject progress (keep from original file)
 * PATCH /api/progress/:id
 */
router.patch('/progress/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'done'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const item = await SubjectProgress.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    return res.json({ success: true, item });
  } catch (e) {
    console.error('next-step progress error', e);
    return res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
