// backend/controllers/AdminMockTestController.js
const MockTestSeries = require('../models/MockTestSeries');
const MockTest = require('../models/MockTest');
const MockTestQuestion = require('../models/MockTestQuestion');
const MockTestAttempt = require('../models/MockTestAttempt');
const mongoose = require('mongoose');

// ---------------------------------------------------------------------
// SERIES
// ---------------------------------------------------------------------

// Create new mock test series
const createSeries = async (req, res) => {
  try {
    console.log('🆕 Creating new mock test series');
    const { title, description, category, freeTests, price, validity, tags } = req.body;

    const adminId = req.user?.id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const series = new MockTestSeries({
      title,
      description,
      category: category || 'CAT',
      freeTests: freeTests || 0,
      price: price || 0,
      validity: validity || 365,
      tags: tags || [],
      isPublished: false,
      createdBy: adminId || null,
    });

    await series.save();

    console.log('✅ Mock test series created successfully');
    res.status(201).json({
      success: true,
      message: 'Mock test series created successfully',
      series,
    });
  } catch (error) {
    console.error('❌ Error creating mock test series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mock test series',
      error: error.message,
    });
  }
};

// Get all series for admin
const getAllSeries = async (req, res) => {
  try {
    console.log('📚 Admin fetching all mock test series');
    const { page = 1, limit = 10, category, search } = req.query;

    const filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const series = await MockTestSeries.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await MockTestSeries.countDocuments(filter);

    // Get series with test counts & enrollment count
    const seriesWithCounts = await Promise.all(
      series.map(async (s) => {
        const testCount = await MockTest.countDocuments({ seriesId: s._id });
        const enrolledCount = (s.enrolledStudents || []).length;

        return {
          ...s.toObject(),
          actualTestCount: testCount,
          enrolledCount,
        };
      })
    );

    console.log(`✅ Found ${series.length} mock test series`);
    res.status(200).json({
      success: true,
      series: seriesWithCounts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('❌ Error fetching mock test series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mock test series',
      error: error.message,
    });
  }
};

// Delete series (used by frontend DELETE /series/:id)
const deleteSeries = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑 Deleting series:', id);

    const series = await MockTestSeries.findById(id);
    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Mock test series not found',
      });
    }

    // Find tests under this series
    const tests = await MockTest.find({ seriesId: id }).select('_id');
    const testIds = tests.map((t) => t._id);

    await Promise.all([
      MockTestAttempt.deleteMany({ seriesId: id }),
      MockTestAttempt.deleteMany({ testId: { $in: testIds } }),
      MockTest.deleteMany({ seriesId: id }),
      MockTestSeries.findByIdAndDelete(id),
    ]);

    console.log('✅ Series and related tests/attempts deleted');
    res.status(200).json({
      success: true,
      message: 'Series (and related tests/attempts) deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mock test series',
      error: error.message,
    });
  }
};

// Publish/Unpublish series
const toggleSeriesPublication = async (req, res) => {
  try {
    const { seriesId } = req.params;
    const { publish } = req.body;

    console.log(`📢 ${publish ? 'Publishing' : 'Unpublishing'} series: ${seriesId}`);

    const series = await MockTestSeries.findById(seriesId);
    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Mock test series not found',
      });
    }

    series.isPublished = !!publish;
    series.publishedAt = publish ? new Date() : null;
    await series.save();

    console.log(`✅ Series ${publish ? 'published' : 'unpublished'} successfully`);
    res.status(200).json({
      success: true,
      message: `Series ${publish ? 'published' : 'unpublished'} successfully`,
      series,
    });
  } catch (error) {
    console.error('❌ Error toggling series publication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update series publication status',
      error: error.message,
    });
  }
};

// ---------------------------------------------------------------------
// TESTS
// ---------------------------------------------------------------------

// Create new mock test
const createTest = async (req, res) => {
  try {
    console.log('🆕 Creating new mock test');

    const {
      title,
      description,
      seriesId,
      duration,
      totalQuestions, // frontend se aa raha hai
      sections = [],
      instructions,
      isFree,
      price,
      difficulty,
      positiveMarks = 3,
      negativeMarks = -1,
      // Test Type and Category
      testType,
      paperType,
      // Previous Year Papers - Paper Wise Mapping
      previousYearExamCategoryId,
      previousYearExamYearId,
      previousYearExamSlotId,
      // Topic Wise Mapping
      topicCategoryId,
      topicTestGroupId,
      // Other fields
      visibility,
      liveFrom,
      liveTill,
      orderIndex,
    } = req.body;

    const adminId = req.user?.id;

    if (!title || !seriesId || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Title, seriesId and duration are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(seriesId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid seriesId',
      });
    }

    const series = await MockTestSeries.findById(seriesId);
    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series not found',
      });
    }

    // Next test number inside this series
    const existingTestsCount = await MockTest.countDocuments({ seriesId });
    const testNumber = existingTestsCount + 1;

    // Map frontend sections -> schema sections
    // frontend: [{ name, questions, duration }]
    let computedTotalQuestions = 0;

    const mappedSections = (sections || []).map((sec) => {
      const qCount = sec.totalQuestions || sec.questions || 0;
      const secDuration = sec.duration || 0;
      computedTotalQuestions += qCount;

      return {
        name: sec.name,
        duration: secDuration,
        totalQuestions: qCount,
        totalMarks: qCount * positiveMarks,
        questions: [], // abhi question mapping alag API se karege
      };
    });

    const finalTotalQuestions = totalQuestions || computedTotalQuestions;
    const totalMarks = finalTotalQuestions * positiveMarks;

    const testData = {
      title,
      description,
      seriesId,
      testNumber,
      duration,
      totalQuestions: finalTotalQuestions,
      totalMarks,
      sections: mappedSections,
      instructions,
      isFree: isFree || false,
      price: isFree ? null : (price || null),
      difficulty: difficulty || 'Medium',
      positiveMarks,
      negativeMarks,
      isPublished: true,
      publishedAt: new Date(),
      createdBy: adminId || null,
    };

    // Add test type and category information
    if (testType) testData.testType = testType;
    if (paperType) testData.paperType = paperType;
    
    // Add Previous Year Paper hierarchy
    if (previousYearExamCategoryId) testData.previousYearExamCategoryId = previousYearExamCategoryId;
    if (previousYearExamYearId) testData.previousYearExamYearId = previousYearExamYearId;
    if (previousYearExamSlotId) testData.previousYearExamSlotId = previousYearExamSlotId;
    
    // Add Topic Wise hierarchy
    if (topicCategoryId) testData.topicCategoryId = topicCategoryId;
    if (topicTestGroupId) testData.topicTestGroupId = topicTestGroupId;
    
    // Add other optional fields
    if (visibility) testData.visibility = visibility;
    if (liveFrom) testData.liveFrom = liveFrom;
    if (liveTill) testData.liveTill = liveTill;
    if (orderIndex !== undefined) testData.orderIndex = orderIndex;

    const test = new MockTest(testData);

    await test.save();

    // Update series total tests count (optional)
    await MockTestSeries.findByIdAndUpdate(seriesId, {
      $inc: { totalTests: 1 },
    });

    console.log('✅ Mock test created successfully');
    res.status(201).json({
      success: true,
      message: 'Mock test created successfully',
      test,
    });
  } catch (error) {
    console.error('❌ Error creating mock test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mock test',
      error: error.message,
    });
  }
};

// Get tests for admin (used by frontend GET /tests)
const getTests = async (req, res) => {
  try {
    console.log('📚 Admin fetching tests');
    const { 
      page = 1, 
      limit = 20, 
      seriesId, 
      search, 
      testType,
      examCategoryId, 
      examYearId, 
      examSlotId,
      topicCategoryId,
      topicTestGroupId
    } = req.query;

    const filter = {};
    
    // Filter by series
    if (seriesId && seriesId !== 'all') {
      if (!mongoose.Types.ObjectId.isValid(seriesId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid seriesId',
        });
      }
      filter.seriesId = seriesId;
    }
    
    // Filter by test type (critical for separation)
    if (testType && testType !== 'all') {
      filter.testType = testType;
    }
    
    // Filter by exam hierarchy for previous year papers
    if (examCategoryId && examCategoryId !== 'all') {
      if (mongoose.Types.ObjectId.isValid(examCategoryId)) {
        filter.previousYearExamCategoryId = examCategoryId;
      }
    }
    if (examYearId && examYearId !== 'all') {
      if (mongoose.Types.ObjectId.isValid(examYearId)) {
        filter.previousYearExamYearId = examYearId;
      }
    }
    if (examSlotId && examSlotId !== 'all') {
      if (mongoose.Types.ObjectId.isValid(examSlotId)) {
        filter.previousYearExamSlotId = examSlotId;
      }
    }
    
    // Filter by topic hierarchy for topic-wise tests
    if (topicCategoryId && topicCategoryId !== 'all') {
      if (mongoose.Types.ObjectId.isValid(topicCategoryId)) {
        filter.topicCategoryId = topicCategoryId;
      }
    }
    if (topicTestGroupId && topicTestGroupId !== 'all') {
      if (mongoose.Types.ObjectId.isValid(topicTestGroupId)) {
        filter.topicTestGroupId = topicTestGroupId;
      }
    }
    
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;

    const tests = await MockTest.find(filter)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await MockTest.countDocuments(filter);

    // attach attempt count
    const testsWithStats = await Promise.all(
      tests.map(async (t) => {
        const attemptCount = await MockTestAttempt.countDocuments({ testId: t._id });
        return {
          ...t.toObject(),
          attemptCount,
        };
      })
    );

    console.log(`✅ Found ${tests.length} tests`);
    res.status(200).json({
      success: true,
      tests: testsWithStats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('❌ Error fetching tests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tests',
      error: error.message,
    });
  }
};

// Delete test (used by frontend DELETE /tests/:id)
const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑 Deleting test:', id);

    const test = await MockTest.findById(id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    await Promise.all([
      MockTestAttempt.deleteMany({ testId: id }),
      MockTest.findByIdAndDelete(id),
      MockTestSeries.findByIdAndUpdate(test.seriesId, { $inc: { totalTests: -1 } }),
    ]);

    console.log('✅ Test deleted successfully');
    res.status(200).json({
      success: true,
      message: 'Test deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mock test',
      error: error.message,
    });
  }
};

// Publish/Unpublish test
const toggleTestPublication = async (req, res) => {
  try {
    const { testId } = req.params;
    const { publish } = req.body;

    console.log(`📢 ${publish ? 'Publishing' : 'Unpublishing'} test: ${testId}`);

    const test = await MockTest.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    test.isPublished = !!publish;
    test.publishedAt = publish ? new Date() : null;
    await test.save();

    console.log(`✅ Test ${publish ? 'published' : 'unpublished'} successfully`);
    res.status(200).json({
      success: true,
      message: `Test ${publish ? 'published' : 'unpublished'} successfully`,
      test,
    });
  } catch (error) {
    console.error('❌ Error toggling test publication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update test publication status',
      error: error.message,
    });
  }
};

// Get test analytics
const getTestAnalytics = async (req, res) => {
  try {
    const { testId } = req.params;

    console.log(`📊 Fetching analytics for test: ${testId}`);

    const test = await MockTest.findById(testId).populate('seriesId', 'title');
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    const attempts = await MockTestAttempt.find({ testId }).populate(
      'studentId',
      'name email'
    );

    const analytics = {
      test: {
        title: test.title,
        series: test.seriesId.title,
        totalQuestions: test.totalQuestions,
        duration: test.duration,
      },
      participation: {
        totalAttempts: attempts.length,
        completedAttempts: attempts.filter((a) => a.isCompleted).length,
        averageScore:
          attempts.length > 0
            ? attempts.reduce((sum, a) => sum + a.score.total, 0) / attempts.length
            : 0,
        averageTime:
          attempts.length > 0
            ? attempts.reduce((sum, a) => sum + a.timeSpent, 0) / attempts.length
            : 0,
      },
      scoreDistribution: {
        excellent: attempts.filter((a) => a.score.total >= 80).length,
        good: attempts.filter(
          (a) => a.score.total >= 60 && a.score.total < 80
        ).length,
        average: attempts.filter(
          (a) => a.score.total >= 40 && a.score.total < 60
        ).length,
        needsImprovement: attempts.filter((a) => a.score.total < 40).length,
      },
      recentAttempts: attempts.slice(0, 10),
    };

    console.log('✅ Analytics fetched successfully');
    res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error('❌ Error fetching test analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test analytics',
      error: error.message,
    });
  }
};

// ---------------------------------------------------------------------
// QUESTIONS
// ---------------------------------------------------------------------

// Create new question
const createQuestion = async (req, res) => {
  try {
    console.log('🆕 Creating new mock test question');
    const {
      testPaperId,
      sequenceNumber,
      questionText,
      questionType,
      section,
      passage,
      images,
      options,
      correctOptionIds,
      numericAnswer,
      textAnswer,
      explanation,
      marks,
      difficulty,
      timeSuggestionSeconds,
      topicTag,
      subTopicTag,
      tags,
    } = req.body;

    const adminId = req.user?.id;

    if (!questionText || !section || !testPaperId) {
      return res.status(400).json({
        success: false,
        message: 'Question text, section, and testPaperId are required',
      });
    }

    // Validate testPaperId
    if (!mongoose.Types.ObjectId.isValid(testPaperId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid testPaperId',
      });
    }

    // Check if test exists
    const test = await MockTest.findById(testPaperId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    // Auto-assign sequence number if not provided
    let finalSequenceNumber = sequenceNumber;
    if (!finalSequenceNumber) {
      const maxQuestion = await MockTestQuestion.findOne({ testPaperId })
        .sort({ sequenceNumber: -1 })
        .select('sequenceNumber');
      finalSequenceNumber = maxQuestion ? maxQuestion.sequenceNumber + 1 : 1;
    }

    const question = new MockTestQuestion({
      testPaperId,
      sequenceNumber: finalSequenceNumber,
      questionText,
      questionType: questionType || 'SINGLE_CORRECT_MCQ',
      section,
      passage,
      images: images || [],
      options: options || [],
      correctOptionIds: correctOptionIds || [],
      numericAnswer,
      textAnswer,
      explanation,
      marks: marks || { positive: 3, negative: -1 },
      difficulty: difficulty || 'MEDIUM',
      timeSuggestionSeconds,
      topicTag,
      subTopicTag,
      tags: tags || [],
      isActive: true,
      createdBy: adminId || null,
    });

    await question.save();

    // Link question to the test's section
    const sectionIndex = test.sections.findIndex(s => s.name === section);
    if (sectionIndex !== -1) {
      // Add question ObjectId to the section's questions array
      if (!test.sections[sectionIndex].questions) {
        test.sections[sectionIndex].questions = [];
      }
      test.sections[sectionIndex].questions.push(question._id);
      await test.save();
      console.log(`✅ Question linked to section ${section} in test`);
    } else {
      console.log(`⚠️ Section ${section} not found in test, question created but not linked`);
    }

    console.log('✅ Mock test question created successfully');
    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question,
    });
  } catch (error) {
    console.error('❌ Error creating question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create question',
      error: error.message,
    });
  }
};

// Get questions for admin
const getQuestions = async (req, res) => {
  try {
    console.log('📚 Admin fetching questions');
    const {
      page = 1,
      limit = 1000,
      testPaperId,
      section,
      topic,
      difficulty,
      search,
    } = req.query;

    const filter = { isActive: true };

    if (testPaperId && mongoose.Types.ObjectId.isValid(testPaperId)) {
      filter.testPaperId = testPaperId;
    }
    if (section && section !== 'all') {
      filter.section = section;
    }
    if (topic) {
      filter.topicTag = { $regex: topic, $options: 'i' };
    }
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }
    if (search) {
      filter.$or = [
        { questionText: { $regex: search, $options: 'i' } },
        { topicTag: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 1000;

    const questions = await MockTestQuestion.find(filter)
      .populate('createdBy', 'name')
      .sort({ sequenceNumber: 1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await MockTestQuestion.countDocuments(filter);

    console.log(`✅ Found ${questions.length} questions`);
    res.status(200).json({
      success: true,
      questions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('❌ Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions',
      error: error.message,
    });
  }
};

// Update test (used by frontend PUT /tests/:id)
const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📝 Updating test:', id);

    const {
      title,
      description,
      duration,
      totalQuestions,
      sections,
      instructions,
      isFree,
      price,
      difficulty,
      positiveMarks = 3,
      negativeMarks = -1,
      testType,
      paperType,
      // Previous Year Papers - Paper Wise Mapping
      previousYearExamCategoryId,
      previousYearExamYearId,
      previousYearExamSlotId,
      // Topic Wise Mapping
      topicCategoryId,
      topicTestGroupId,
      // Legacy fields
      exam,
      yearLabel,
      subject,
      topic,
      sessionYear,
      // Other fields
      visibility,
      liveFrom,
      liveTill,
      orderIndex
    } = req.body;

    const test = await MockTest.findById(id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    const finalTotalQuestions = totalQuestions || test.totalQuestions;
    const totalMarks = finalTotalQuestions * positiveMarks;

    const updateData = {
      title: title || test.title,
      description,
      duration: duration || test.duration,
      totalQuestions: finalTotalQuestions,
      totalMarks,
      sections: sections || test.sections,
      instructions,
      isFree,
      price: isFree ? null : (price !== undefined ? price : test.price),
      difficulty,
      testType,
      paperType,
      previousYearExamCategoryId,
      previousYearExamYearId,
      previousYearExamSlotId,
      topicCategoryId,
      topicTestGroupId,
      exam,
      yearLabel,
      subject,
      topic,
      sessionYear,
      visibility,
      liveFrom,
      liveTill,
      orderIndex
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        test[key] = updateData[key];
      }
    });

    await test.save();

    console.log('✅ Test updated successfully');
    res.status(200).json({
      success: true,
      message: 'Test updated successfully',
      test,
    });
  } catch (error) {
    console.error('❌ Error updating test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mock test',
      error: error.message,
    });
  }
};

// Update question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📝 Updating question:', id);

    const question = await MockTestQuestion.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const {
      questionText,
      questionType,
      section,
      passage,
      images,
      options,
      correctOptionIds,
      numericAnswer,
      textAnswer,
      explanation,
      marks,
      difficulty,
      timeSuggestionSeconds,
      topicTag,
      subTopicTag,
      tags,
      sequenceNumber,
    } = req.body;

    // Update fields
    if (questionText) question.questionText = questionText;
    if (questionType) question.questionType = questionType;
    if (section) question.section = section;
    if (passage !== undefined) question.passage = passage;
    if (images) question.images = images;
    if (options) question.options = options;
    if (correctOptionIds) question.correctOptionIds = correctOptionIds;
    if (numericAnswer !== undefined) question.numericAnswer = numericAnswer;
    if (textAnswer !== undefined) question.textAnswer = textAnswer;
    if (explanation !== undefined) question.explanation = explanation;
    if (marks) question.marks = marks;
    if (difficulty) question.difficulty = difficulty;
    if (timeSuggestionSeconds !== undefined) question.timeSuggestionSeconds = timeSuggestionSeconds;
    if (topicTag !== undefined) question.topicTag = topicTag;
    if (subTopicTag !== undefined) question.subTopicTag = subTopicTag;
    if (tags) question.tags = tags;
    if (sequenceNumber) question.sequenceNumber = sequenceNumber;

    await question.save();

    console.log('✅ Question updated successfully');
    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question,
    });
  } catch (error) {
    console.error('❌ Error updating question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update question',
      error: error.message,
    });
  }
};

// Delete question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑 Deleting question:', id);

    const question = await MockTestQuestion.findByIdAndDelete(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    console.log('✅ Question deleted successfully');
    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question',
      error: error.message,
    });
  }
};

// Bulk upload questions
const bulkUploadQuestions = async (req, res) => {
  try {
    console.log('📤 Bulk uploading questions');
    const { testPaperId, questions } = req.body;

    if (!testPaperId || !mongoose.Types.ObjectId.isValid(testPaperId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid testPaperId is required',
      });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Questions array is required and must not be empty',
      });
    }

    // Check if test exists
    const test = await MockTest.findById(testPaperId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    const adminId = req.user?.id;

    // Get the current max sequence number for this test
    const maxQuestion = await MockTestQuestion.findOne({ testPaperId })
      .sort({ sequenceNumber: -1 })
      .select('sequenceNumber');
    
    let nextSequenceNumber = maxQuestion ? maxQuestion.sequenceNumber + 1 : 1;

    // Helper function to normalize section values
    const normalizeSection = (section) => {
      if (!section) return 'GENERAL';
      const sectionUpper = String(section).toUpperCase().trim();
      
      // Direct matches
      if (['VARC', 'DILR', 'QA', 'GENERAL'].includes(sectionUpper)) {
        return sectionUpper;
      }
      
      // Variations for QA
      if (sectionUpper.includes('QUANT') || sectionUpper.includes('QA') || 
          sectionUpper === 'Q' || sectionUpper === 'MATHS' || sectionUpper === 'MATH') {
        return 'QA';
      }
      
      // Variations for VARC
      if (sectionUpper.includes('VARC') || sectionUpper.includes('VERBAL') || 
          sectionUpper.includes('RC') || sectionUpper === 'V') {
        return 'VARC';
      }
      
      // Variations for DILR
      if (sectionUpper.includes('DILR') || sectionUpper.includes('DI') || 
          sectionUpper.includes('LR') || sectionUpper.includes('LOGIC')) {
        return 'DILR';
      }
      
      return 'GENERAL';
    };

    // Helper function to normalize difficulty values
    const normalizeDifficulty = (difficulty) => {
      if (!difficulty) return 'MEDIUM';
      const diffUpper = String(difficulty).toUpperCase().trim();
      
      // Direct matches
      if (['EASY', 'MEDIUM', 'HARD'].includes(diffUpper)) {
        return diffUpper;
      }
      
      // Numeric mappings
      if (difficulty === 1 || diffUpper === '1' || diffUpper === 'LOW') return 'EASY';
      if (difficulty === 2 || diffUpper === '2' || diffUpper === 'MED') return 'MEDIUM';
      if (difficulty === 3 || diffUpper === '3' || diffUpper === 'HIGH') return 'HARD';
      
      return 'MEDIUM';
    };

    // Prepare questions for insertion
    const questionsToInsert = questions.map((q, index) => ({
      testPaperId,
      sequenceNumber: q.sequenceNumber || nextSequenceNumber++,
      questionText: q.questionText,
      questionType: q.questionType || 'SINGLE_CORRECT_MCQ',
      section: normalizeSection(q.section),
      passage: q.passage,
      images: q.images || [],
      options: q.options || [],
      correctOptionIds: q.correctOptionIds || [],
      numericAnswer: q.numericAnswer,
      textAnswer: q.textAnswer,
      explanation: q.explanation,
      marks: q.marks || { positive: 3, negative: -1 },
      difficulty: normalizeDifficulty(q.difficulty),
      timeSuggestionSeconds: q.timeSuggestionSeconds,
      topicTag: q.topicTag,
      subTopicTag: q.subTopicTag,
      tags: q.tags || [],
      isActive: true,
      createdBy: adminId || null,
    }));

    const insertedQuestions = await MockTestQuestion.insertMany(questionsToInsert);

    console.log(`✅ Bulk uploaded ${insertedQuestions.length} questions`);
    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${insertedQuestions.length} questions`,
      count: insertedQuestions.length,
      questions: insertedQuestions,
    });
  } catch (error) {
    console.error('❌ Error bulk uploading questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk upload questions',
      error: error.message,
    });
  }
};

module.exports = {
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
  getTestAnalytics,
};
