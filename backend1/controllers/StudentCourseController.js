const Course = require("../models/course/Course");
const Subject = require("../models/course/Subject");
const Chapter = require("../models/course/Chapter");
const Topic = require("../models/course/Topic");
const Test = require("../models/course/Test");
const VideoContent = require("../models/course/VideoContent");
const MockTestSeries = require("../models/MockTestSeries");
const MockTest = require("../models/MockTest");
const User = require("../models/UserSchema");

// Helper function to check if student has access to course
const checkCourseAccess = async (userId, courseId) => {
  try {
    // Special case for admin dev user in development
    if (process.env.NODE_ENV === 'development' && userId === '507f1f77bcf86cd799439011') {
      console.log('🔧 Admin dev user detected, granting course access');
      const course = await Course.findById(courseId);
      if (!course || !course.published) {
        return { hasAccess: false, message: "Course not available" };
      }
      return { hasAccess: true, course };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { hasAccess: false, message: "User not found" };
    }

    // Check if user is enrolled and has unlocked the course
    const enrollment = user.enrolledCourses.find(
      (course) => course.courseId.toString() === courseId && course.status === "unlocked"
    );

    if (!enrollment) {
      return { hasAccess: false, message: "Course not unlocked or not enrolled" };
    }

    // Check if course is published
    const course = await Course.findById(courseId);
    if (!course || !course.published) {
      return { hasAccess: false, message: "Course not available" };
    }

    return { hasAccess: true, course };
  } catch (error) {
    console.error("Error checking course access:", error);
    return { hasAccess: false, message: "Access check failed" };
  }
};

// Get course subjects for students
exports.getStudentCourseSubjects = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check course access
    const accessCheck = await checkCourseAccess(userId, courseId);
    if (!accessCheck.hasAccess) {
      return res.status(403).json({
        success: false,
        message: accessCheck.message
      });
    }

    // Get subjects for the course
    const subjects = await Subject.find({ courseId }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      subjects,
      course: accessCheck.course
    });
  } catch (error) {
    console.error("Error fetching student course subjects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course subjects"
    });
  }
};

// Get chapters for a subject (with course access check)
exports.getStudentSubjectChapters = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.id;

    // Get subject and its course
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    // Check course access
    const accessCheck = await checkCourseAccess(userId, subject.courseId);
    if (!accessCheck.hasAccess) {
      return res.status(403).json({
        success: false,
        message: accessCheck.message
      });
    }

    // Get chapters for the subject
    const chapters = await Chapter.find({ subjectId }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      chapters,
      subject
    });
  } catch (error) {
    console.error("Error fetching student subject chapters:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subject chapters"
    });
  }
};

// Get topics for a chapter (with course access check)
exports.getStudentChapterTopics = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user.id;

    // Get chapter and its course
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found"
      });
    }

    // Check course access
    const accessCheck = await checkCourseAccess(userId, chapter.courseId);
    if (!accessCheck.hasAccess) {
      return res.status(403).json({
        success: false,
        message: accessCheck.message
      });
    }

    // Get topics for the chapter
    const topics = await Topic.find({ chapterId }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      topics,
      chapter
    });
  } catch (error) {
    console.error("Error fetching student chapter topics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chapter topics"
    });
  }
};

// Get tests for a topic (with course access check)
exports.getStudentTopicTests = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user.id;

    // Get topic and its course
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found"
      });
    }

    // Check course access
    const accessCheck = await checkCourseAccess(userId, topic.courseId);
    if (!accessCheck.hasAccess) {
      return res.status(403).json({
        success: false,
        message: accessCheck.message
      });
    }

    // Get tests for the topic
    const tests = await Test.find({ topicId }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      tests,
      topic
    });
  } catch (error) {
    console.error("Error fetching student topic tests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch topic tests"
    });
  }
};

// Get complete course structure for students (optimized single call)
exports.getStudentCourseStructure = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check course access
    const accessCheck = await checkCourseAccess(userId, courseId);
    if (!accessCheck.hasAccess) {
      return res.status(403).json({
        success: false,
        message: accessCheck.message
      });
    }

    // Get complete course structure
    const subjects = await Subject.find({ courseId }).sort({ order: 1 });
    const chapters = await Chapter.find({ courseId }).sort({ order: 1 });
    const topics = await Topic.find({ courseId }).sort({ order: 1 });

    // Fix: Use correct field names from Test model schema
    const tests = await Test.find({ course: courseId }).sort({ title: 1 });

    console.log('🔍 DEBUG: Checking for tests in course:', courseId);
    console.log('📊 Subjects found:', subjects.length);
    console.log('📊 Chapters found:', chapters.length);
    console.log('📊 Topics found:', topics.length);
    console.log('📊 Tests found:', tests.length);

    // Check for tests associated with different entities
    const allTests = await Test.find({}).limit(20);
    console.log('🧪 Sample tests in database:');
    allTests.forEach((test, i) => {
      console.log(`  Test ${i}: ${test.title} | Course: ${test.course} | Chapter: ${test.chapter} | Topic: ${test.topic}`);
    });

    // Check for tests that might be associated directly with chapters
    const chaptersWithTests = await Test.find({
      $or: [
        { course: courseId },
        { chapter: { $in: chapters.map(c => c._id) } }
      ]
    });
    console.log('🧪 Tests associated with this course or its chapters:', chaptersWithTests.length);
    chaptersWithTests.forEach((test, i) => {
      console.log(`  Test ${i}: ${test.title} | Course: ${test.course} | Chapter: ${test.chapter} | Topic: ${test.topic}`);
    });

    // Organize the structure
    const courseStructure = subjects.map(subject => ({
      ...subject.toObject(),
      chapters: chapters
        .filter(chapter => chapter.subjectId.toString() === subject._id.toString())
        .map(chapter => ({
          ...chapter.toObject(),
          topics: topics
            .filter(topic => topic.chapterId.toString() === chapter._id.toString())
            .map(topic => ({
              ...topic.toObject(),
              tests: tests.filter(test => test.topic && test.topic.toString() === topic._id.toString())
            }))
        }))
    }));

    // Also check for tests that might be directly associated with chapters (if no topics exist)
    courseStructure.forEach(subject => {
      subject.chapters.forEach(chapter => {
        if (chapter.topics.length === 0) {
          // If no topics, attach tests directly to chapter
          const chapterTests = tests.filter(test => test.chapter && test.chapter.toString() === chapter._id.toString());
          if (chapterTests.length > 0) {
            // Create a default topic for chapter-level tests
            chapter.topics.push({
              _id: `${chapter._id}_tests`,
              name: `${chapter.name} Tests`,
              chapterId: chapter._id,
              tests: chapterTests,
              createdAt: chapter.createdAt,
              updatedAt: chapter.updatedAt
            });
          }
        }
      });
    });

    res.status(200).json({
      success: true,
      course: accessCheck.course,
      structure: courseStructure
    });
  } catch (error) {
    console.error("Error fetching student course structure:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course structure"
    });
  }
};

// Get comprehensive course content for students (videos, mock tests, full structure)
exports.getComprehensiveCourseContent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    console.log(`📚 Fetching comprehensive course content for course: ${courseId}, user: ${userId}`);

    // Check course access
    const accessCheck = await checkCourseAccess(userId, courseId);
    if (!accessCheck.hasAccess) {
      return res.status(403).json({
        success: false,
        message: accessCheck.message
      });
    }

    const course = accessCheck.course;

    // 1. Get Recorded Video Classes
    const videoContent = await VideoContent.find({ courseId })
      .sort({ serialNumber: 1 })
      .lean();

    console.log(`🎥 Found ${videoContent.length} video lectures for course`);

    // Group videos by topic if available
    const groupedVideos = {};
    videoContent.forEach(video => {
      const topicKey = video.topicName || 'General';
      if (!groupedVideos[topicKey]) {
        groupedVideos[topicKey] = [];
      }
      groupedVideos[topicKey].push(video);
    });

    // 2. Get Mock Tests (from MockTestSeries that might be linked to this course)
    // Also get all published mock test series that students can access
    const mockTestSeries = await MockTestSeries.find({
      isActive: true,
      isPublished: true
    }).lean();

    // Get mock tests within each series
    const mockTestsWithTests = await Promise.all(
      mockTestSeries.map(async (series) => {
        const tests = await MockTest.find({
          seriesId: series._id,
          isActive: true,
          isPublished: true
        }).sort({ testNumber: 1 }).lean();
        return {
          ...series,
          tests
        };
      })
    );

    console.log(`📝 Found ${mockTestSeries.length} mock test series`);

    // 3. Get Full Course Structure (Subjects -> Chapters -> Topics -> Tests)
    const subjects = await Subject.find({ courseId }).sort({ order: 1 }).lean();
    const chapters = await Chapter.find({ courseId }).sort({ order: 1 }).lean();
    const topics = await Topic.find({ courseId }).sort({ order: 1 }).lean();
    const tests = await Test.find({ course: courseId }).sort({ title: 1 }).lean();

    console.log(`📊 Course Structure: ${subjects.length} subjects, ${chapters.length} chapters, ${topics.length} topics, ${tests.length} tests`);

    // Organize the hierarchical structure
    const fullCourseStructure = subjects.map(subject => ({
      ...subject,
      chapters: chapters
        .filter(chapter => chapter.subjectId && chapter.subjectId.toString() === subject._id.toString())
        .map(chapter => ({
          ...chapter,
          topics: topics
            .filter(topic => topic.chapterId && topic.chapterId.toString() === chapter._id.toString())
            .map(topic => ({
              ...topic,
              tests: tests.filter(test => test.topic && test.topic.toString() === topic._id.toString()),
              videos: videoContent.filter(v => v.topicName === topic.name)
            })),
          // Also attach tests directly to chapters if they don't have topics
          directTests: tests.filter(test => test.chapter && test.chapter.toString() === chapter._id.toString() && !test.topic)
        }))
    }));

    // 4. Calculate progress stats
    const totalVideos = videoContent.length;
    const totalTests = tests.length;
    const totalMockTests = mockTestsWithTests.reduce((acc, series) => acc + series.tests.length, 0);

    res.status(200).json({
      success: true,
      course: {
        _id: course._id,
        name: course.name,
        description: course.description,
        courseType: course.courseType,
        thumbnail: course.thumbnail,
        overview: course.overview
      },
      recordedClasses: {
        totalVideos,
        videos: videoContent,
        groupedByTopic: groupedVideos
      },
      mockTests: {
        totalSeries: mockTestSeries.length,
        totalTests: totalMockTests,
        series: mockTestsWithTests
      },
      fullCourseContent: {
        totalSubjects: subjects.length,
        totalChapters: chapters.length,
        totalTopics: topics.length,
        totalTests,
        structure: fullCourseStructure
      },
      stats: {
        totalVideos,
        totalTests,
        totalMockTests,
        totalContent: totalVideos + totalTests + totalMockTests
      }
    });

  } catch (error) {
    console.error("Error fetching comprehensive course content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course content",
      error: error.message
    });
  }
};
