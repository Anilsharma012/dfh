const express = require("express");
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  toggleLock,
  togglePublish,
  getPublishedCourses,
  getPublishedCourseById,
  upsertCourseOverview
} = require("../controllers/CourseController");

const {
  addVideoContent,
  getVideosByCourse,
  updateVideoContent,
  deleteVideoContent,
  toggleVideoFreeStatus,
  bulkUploadVideos
} = require("../controllers/VideoContentController");

// ✅ Auth & Permission Middleware
const { authMiddleware } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionMiddleware");

// ✅ Multer setup
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ CREATE course with thumbnail
router.post(
  "/",
  authMiddleware,
  checkPermission("course_create"),
  upload.single("thumbnail"),
  createCourse
);

// ✅ PUBLIC routes first (before parameter routes that can match anything)
// ✅ GET published courses for student LMS (no auth needed)
router.get("/student/published-courses", getPublishedCourses);
router.get("/student/published-courses/:id", getPublishedCourseById);

// ✅ READ all courses or by ID (ADMIN - after public routes)
router.get("/", authMiddleware, checkPermission("course_read"), getCourses);

router.get(
  "/:id",
  authMiddleware,
  checkPermission("course_read"),
  getCourseById
);

// ✅ UPDATE course with optional thumbnail
router.put(
  "/:id/overview",
  authMiddleware,
  checkPermission("course_update"),
  upsertCourseOverview
);

router.put(
  "/:id",
  authMiddleware,
  checkPermission("course_update"),
  upload.single("thumbnail"),
  updateCourse
);

// ✅ DELETE course
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("course_delete"),
  deleteCourse
);

// ✅ TOGGLE lock/unlock
router.put(
  "/toggle-lock/:id",
  authMiddleware,
  checkPermission("course_update"),
  toggleLock
);

// ✅ TOGGLE publish/unpublish
router.put(
  "/toggle-publish/:id",
  authMiddleware,
  checkPermission("course_update"),
  togglePublish
);

// ======================================
// ✅ VIDEO CONTENT ROUTES
// ======================================

// ✅ ADD single video to course (supports both file upload and URL)
router.post(
  "/:courseId/videos",
  authMiddleware,
  checkPermission("course_update"),
  upload.single("videoFile"),
  addVideoContent
);

// ✅ BULK upload videos to course
router.post(
  "/videos/bulk-upload",
  authMiddleware,
  checkPermission("course_update"),
  bulkUploadVideos
);

// ✅ GET all videos for a course (with optional topic filter)
router.get("/:courseId/videos", getVideosByCourse);

// ✅ UPDATE video content (supports file upload or URL update)
router.put(
  "/videos/:videoId",
  authMiddleware,
  checkPermission("course_update"),
  upload.single("videoFile"),
  updateVideoContent
);

// ✅ DELETE video content
router.delete(
  "/videos/:videoId",
  authMiddleware,
  checkPermission("course_update"),
  deleteVideoContent
);

// ✅ TOGGLE video Free/Paid status
router.put(
  "/videos/:videoId/toggle-free",
  authMiddleware,
  checkPermission("course_update"),
  toggleVideoFreeStatus
);

module.exports = router;
