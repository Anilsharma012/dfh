const MockTestSeries = require('../models/MockTestSeries');
const MockTest = require('../models/MockTest');
const MockTestQuestion = require('../models/MockTestQuestion');
const MockTestAttempt = require('../models/MockTestAttempt');
const User = require('../models/UserSchema');



// Get all published mock test series for students
const getPublishedSeries = async (req, res) => {
  try {
    console.log('📚 Fetching published mock test series');
    const { category = 'all', page = 1, limit = 10 } = req.query;

    const filter = {
      isActive: true,
      isPublished: true
    };

    if (category && category !== 'all') {
      filter.category = category;
    }

    const series = await MockTestSeries.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MockTestSeries.countDocuments(filter);

    console.log(`✅ Found ${series.length} published mock test series`);
    res.status(200).json({
      success: true,
      series,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching mock test series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mock test series',
      error: error.message
    });
  }
};

// Get tests in a specific series
const getTestsInSeries = async (req, res) => {
  try {
    const { seriesId } = req.params;
    const { examCategoryId, examYearId, examSlotId } = req.query;
    const userId = req.user ? req.user.id : null;

    console.log(`📋 Fetching tests for series: ${seriesId}${userId ? ` (authenticated user: ${userId})` : ' (guest user)'}`);

    const series = await MockTestSeries.findById(seriesId);
    if (!series || !series.isActive || !series.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Mock test series not found'
      });
    }

    const filter = {
      seriesId: seriesId,
      isActive: true,
      isPublished: true
    };
    
    // Filter by exam hierarchy for previous year papers
    const mongoose = require('mongoose');
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

    const tests = await MockTest.find(filter).sort({ testNumber: 1 });

    let testWithStatus;

    if (userId) {
      // For authenticated users, check which tests they have attempted
      let attempts = [];
      try {
        // Only query if userId is a valid ObjectId
        const mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(userId)) {
          attempts = await MockTestAttempt.find({
            userId: userId,
            seriesId: seriesId
          });
        } else {
          console.log(`⚠️ Invalid userId format: ${userId}, treating as guest user`);
        }
      } catch (error) {
        console.log(`⚠️ Error querying attempts for user ${userId}:`, error.message);
        attempts = [];
      }

      testWithStatus = tests.map(test => {
        const attempt = attempts.find(att => att.testId.toString() === test._id.toString());
        return {
          ...test.toObject(),
          hasAttempted: !!attempt,
          isCompleted: attempt ? attempt.isCompleted : false,
          score: attempt ? attempt.score.total : null,
          attemptDate: attempt ? attempt.createdAt : null
        };
      });
    } else {
      // For guest users, show basic test info without attempt status
      testWithStatus = tests.map(test => ({
        ...test.toObject(),
        hasAttempted: false,
        isCompleted: false,
        score: null,
        attemptDate: null
      }));
    }

    console.log(`✅ Found ${tests.length} tests in series`);
    res.status(200).json({
      success: true,
      series,
      tests: testWithStatus
    });
  } catch (error) {
    console.error('❌ Error fetching tests in series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tests',
      error: error.message
    });
  }
};

// Get test details and instructions
const getTestDetails = async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user ? req.user.id : null;

    console.log(`📖 Fetching test details: ${testId}${userId ? ` (authenticated user: ${userId})` : ' (guest user)'}`);

    const test = await MockTest.findById(testId)
      .populate('seriesId', 'title category enrolledStudents')
      .populate('createdBy', 'name');

    if (!test || !test.isActive || !test.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found'
      });
    }

    // Check if student has access to this test
    const series = test.seriesId;
    let isEnrolled = false;

    if (userId) {
      try {
        const mongoose = require('mongoose');
        if (userId === '507f1f77bcf86cd799439011') {
          isEnrolled = test.isFree; // Allow dev user access to free tests
        } else if (mongoose.Types.ObjectId.isValid(userId) && series?.enrolledStudents) {
          isEnrolled = series.enrolledStudents.some(
            enrollment => enrollment.studentId && enrollment.studentId.toString() === userId
          );
        }
      } catch (error) {
        console.log(`⚠️ Error checking enrollment for user ${userId}:`, error.message);
      }
    }
    
    console.log(`📊 Enrollment check: userId=${userId}, isFree=${test.isFree}, isEnrolled=${isEnrolled}`);

    if (!test.isFree && !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You need to purchase this mock test series to access this test'
      });
    }

    // Check if student has already attempted this test
    let existingAttempt = null;
    if (userId) {
      try {
        const mongoose = require('mongoose');
        if (userId === '507f1f77bcf86cd799439011') {
          // For dev user, don't check existing attempts to allow multiple attempts
          existingAttempt = null;
        } else if (mongoose.Types.ObjectId.isValid(userId)) {
          existingAttempt = await MockTestAttempt.findOne({
            userId: userId,
            testPaperId: testId
          });
        }
      } catch (error) {
        console.log(`⚠️ Error checking existing attempt for user ${userId}:`, error.message);
      }
    }

    console.log('✅ Test details fetched successfully');
    res.status(200).json({
      success: true,
      test,
      hasAttempted: !!existingAttempt,
      attempt: existingAttempt
    });
  } catch (error) {
    console.error('❌ Error fetching test details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test details',
      error: error.message
    });
  }
};

// Start a mock test attempt
const startTestAttempt = async (req, res) => {
  try {
    console.log('🔍 startTestAttempt called');
    console.log('Request params:', req.params);
    console.log('Request user:', req.user);
    console.log('Request headers authorization:', req.headers.authorization);

    const { testId } = req.params;
    const userId = req.user ? req.user.id : 'no-user';
    const mongoose = require('mongoose');

    console.log(`🚀 Starting test attempt for test: ${testId}, user: ${userId}`);

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid test ID format'
      });
    }

    // Validate ObjectId format for all users now (including dev user with proper ObjectId)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const test = await MockTest.findById(testId).populate('seriesId');
    if (!test || !test.isActive || !test.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found'
      });
    }

    // Check if student has access
    const series = test.seriesId;
    let isEnrolled = false;

    // For development user (using fixed ObjectId), allow access to free tests
    if (userId === '507f1f77bcf86cd799439011') {
      isEnrolled = test.isFree;
    } else if (series.enrolledStudents && series.enrolledStudents.length > 0) {
      isEnrolled = series.enrolledStudents.some(
        enrollment => enrollment.studentId.toString() === userId
      );
    }

    if (!test.isFree && !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Please purchase the mock test series.'
      });
    }

    // Check if already attempted (skip for development user to allow multiple attempts)
    let existingAttempt = null;
    if (userId !== '507f1f77bcf86cd799439011') {
      existingAttempt = await MockTestAttempt.findOne({
        userId: userId,
        testPaperId: testId
      });

      if (existingAttempt) {
        // Return the existing attempt for resume
        return res.status(200).json({
          success: true,
          message: 'Resuming existing attempt',
          attempt: existingAttempt,
          resuming: true
        });
      }
    }

    // Initialize section states for session persistence
    const initialSectionStates = test.sections.map((section, index) => ({
      sectionKey: section.name,
      startedAt: index === 0 ? new Date() : null, // Only first section starts immediately
      remainingSeconds: section.duration * 60, // Convert minutes to seconds
      isLocked: false,
      isCompleted: false,
      completedAt: null
    }));

    // Create new attempt
    const newAttempt = new MockTestAttempt({
      userId: userId,
      testPaperId: testId,
      seriesId: test.seriesId._id,
      totalDuration: test.duration,
      startedAt: new Date(),
      status: 'IN_PROGRESS',
      currentSectionKey: test.sections[0]?.name || 'VARC',
      currentSectionIndex: 0,
      currentQuestionIndex: 0,
      sectionStates: initialSectionStates,
      lastSyncedAt: new Date(),
      responses: []
    });

    await newAttempt.save();

    // Get questions for the test
    const questionsWithSections = [];
    for (const section of test.sections) {
      let questions = [];
      
      // First try to get questions from section.questions array
      if (section.questions && section.questions.length > 0) {
        questions = await MockTestQuestion.find({
          _id: { $in: section.questions }
        }).select('_id questionText passage questionType section images options marks sequenceNumber correctOptionIds').sort({ sequenceNumber: 1 });
      }
      
      // Fallback: If no questions found in section.questions, query by testPaperId and section name
      if (questions.length === 0) {
        console.log(`🔄 Fallback: Querying questions for section ${section.name} by testPaperId`);
        questions = await MockTestQuestion.find({
          testPaperId: testId,
          section: section.name,
          isActive: true
        }).select('_id questionText passage questionType section images options marks sequenceNumber correctOptionIds').sort({ sequenceNumber: 1 });
        
        // Also update the test's section with these question IDs for future use
        if (questions.length > 0) {
          const sectionIndex = test.sections.findIndex(s => s.name === section.name);
          if (sectionIndex !== -1) {
            test.sections[sectionIndex].questions = questions.map(q => q._id);
            await test.save();
            console.log(`✅ Updated section ${section.name} with ${questions.length} question IDs`);
          }
        }
      }
      
      console.log(`📝 Section ${section.name}: Found ${questions.length} questions`);
      
      questionsWithSections.push({
        name: section.name,
        duration: section.duration,
        questions: questions
      });
    }

    console.log('✅ Test attempt started successfully');
    res.status(201).json({
      success: true,
      message: 'Test attempt started successfully',
      attempt: newAttempt,
      test: {
        _id: test._id,
        title: test.title,
        duration: test.duration,
        sections: questionsWithSections,
        instructions: (() => {
          if (!test.instructions) return [];

          // If it's already an array, return it
          if (Array.isArray(test.instructions)) return test.instructions;

          // If it's an object with general/sectionSpecific properties
          if (typeof test.instructions === 'object') {
            const flattened = [];
            if (test.instructions.general && Array.isArray(test.instructions.general)) {
              flattened.push(...test.instructions.general);
            }
            if (test.instructions.sectionSpecific && Array.isArray(test.instructions.sectionSpecific)) {
              flattened.push(...test.instructions.sectionSpecific);
            }
            // If no general/sectionSpecific, try to convert the object to string
            if (flattened.length === 0) {
              flattened.push(JSON.stringify(test.instructions));
            }
            return flattened;
          }

          // If it's a string, wrap in array
          return [test.instructions];
        })()
      }
    });
  } catch (error) {
    console.error('❌ Error starting test attempt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start test attempt',
      error: error.message
    });
  }
};

// Save student response
const saveResponse = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { questionId, selectedAnswer, isMarkedForReview } = req.body;
    const userId = req.user.id;

    console.log(`💾 Saving response for attempt: ${attemptId}, question: ${questionId}`);

    const attempt = await MockTestAttempt.findOne({
      _id: attemptId,
      userId: userId
    }).populate('testPaperId');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt not found'
      });
    }

    if (attempt.isCompleted || attempt.isSubmitted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify completed test'
      });
    }
    
    // SERVER-SIDE TIME ENFORCEMENT: Check if the question's section has expired
    const test = attempt.testPaperId;
    if (test && test.sections) {
      const currentTime = new Date();
      
      // Find which section this question belongs to
      // First try looking in section.questions array (ObjectIds)
      let questionSection = test.sections.find(section => 
        section.questions?.some(q => q.toString() === questionId)
      );
      
      // If not found in section.questions, query MockTestQuestion directly
      if (!questionSection) {
        const questionDoc = await MockTestQuestion.findById(questionId).select('section');
        if (questionDoc && questionDoc.section) {
          questionSection = test.sections.find(section => section.name === questionDoc.section);
        }
      }
      
      // SECURITY: If we can't determine the section, REJECT the response (fail-closed)
      if (!questionSection) {
        console.log(`⚠️ Rejected response: cannot determine section for question ${questionId}`);
        return res.status(403).json({
          success: false,
          message: 'Cannot save response: question section not found',
          error: 'SECTION_NOT_FOUND'
        });
      }
      
      // Section found - check if it's locked
      // Find the section state for this section
      const sectionState = attempt.sectionStates?.find(s => s.sectionKey === questionSection.name);
      
      // Check if section is already locked
      if (sectionState?.isLocked || sectionState?.isCompleted) {
        console.log(`⚠️ Rejected response: section ${questionSection.name} is locked`);
        return res.status(403).json({
          success: false,
          message: 'Cannot save response: section time has expired',
          sectionLocked: true
        });
      }
      
      // If section was started, calculate if it has expired
      if (sectionState?.startedAt) {
        const sectionStartTime = new Date(sectionState.startedAt);
        const sectionTotalSeconds = (questionSection.duration || 60) * 60;
        const elapsedSeconds = Math.floor((currentTime - sectionStartTime) / 1000);
        const serverRemaining = Math.max(0, sectionTotalSeconds - elapsedSeconds);
        
        // If time has expired, lock the section and reject the response
        if (serverRemaining === 0) {
          console.log(`⚠️ Rejected response: section ${questionSection.name} has expired (server-side calculation)`);
          
          // Update sectionState to locked
          const stateIndex = attempt.sectionStates?.findIndex(s => s.sectionKey === questionSection.name);
          if (stateIndex >= 0) {
            attempt.sectionStates[stateIndex].isLocked = true;
            attempt.sectionStates[stateIndex].isCompleted = true;
            attempt.sectionStates[stateIndex].remainingSeconds = 0;
            attempt.sectionStates[stateIndex].completedAt = currentTime.toISOString();
            await attempt.save();
          }
          
          return res.status(403).json({
            success: false,
            message: 'Cannot save response: section time has expired',
            sectionLocked: true
          });
        }
      }
    }

    // Find existing response or create new one
    let responseIndex = attempt.responses.findIndex(
      resp => resp.questionId.toString() === questionId
    );

    if (responseIndex >= 0) {
      // Update existing response
      attempt.responses[responseIndex].selectedAnswer = selectedAnswer;
      attempt.responses[responseIndex].isAnswered = !!selectedAnswer;
      attempt.responses[responseIndex].isMarkedForReview = isMarkedForReview || false;
      attempt.responses[responseIndex].answeredAt = new Date();
    } else {
      // Add new response
      attempt.responses.push({
        questionId,
        selectedAnswer,
        isAnswered: !!selectedAnswer,
        isMarkedForReview: isMarkedForReview || false,
        isVisited: true,
        answeredAt: new Date()
      });
    }

    await attempt.save();

    console.log('✅ Response saved successfully');
    res.status(200).json({
      success: true,
      message: 'Response saved successfully'
    });
  } catch (error) {
    console.error('❌ Error saving response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save response',
      error: error.message
    });
  }
};

// Sync session progress (heartbeat endpoint for session persistence)
const syncProgress = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { 
      currentSectionIndex, 
      currentQuestionIndex, 
      currentSectionKey,
      sectionStates,
      responses 
    } = req.body;
    const userId = req.user.id;

    console.log(`🔄 Syncing progress for attempt: ${attemptId}`);

    const attempt = await MockTestAttempt.findOne({
      _id: attemptId,
      userId: userId
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt not found'
      });
    }

    if (attempt.status === 'COMPLETED' || attempt.status === 'EXPIRED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot sync progress for completed/expired test'
      });
    }

    // Server-side validation for section states - STRICT enforcement, don't trust client data
    const currentTime = new Date();
    const test = await MockTest.findById(attempt.testPaperId);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    // STRICT SECTION NAVIGATION ENFORCEMENT
    // Client cannot jump to sections that haven't been properly started via transitionSection
    const serverCurrentSectionKey = attempt.currentSectionKey;
    const serverCurrentSectionIdx = attempt.currentSectionIndex || 0;
    
    // Validate client's claimed section is allowed
    if (currentSectionKey && currentSectionKey !== serverCurrentSectionKey) {
      // Client trying to switch sections - check if this is valid
      const targetSectionState = attempt.sectionStates?.find(s => s.sectionKey === currentSectionKey);
      const targetSectionIdx = test.sections.findIndex(s => s.name === currentSectionKey);
      
      // Can only navigate to:
      // 1. Section that was previously started (has startedAt)
      // 2. Section index <= current index (back navigation only, forward requires transitionSection)
      // 3. Section that isn't locked (unless viewing completed sections is allowed)
      const isValidBackNav = targetSectionState?.startedAt && targetSectionIdx <= serverCurrentSectionIdx;
      const isLockedSection = targetSectionState?.isLocked || targetSectionState?.isCompleted;
      
      if (!isValidBackNav) {
        console.log(`⚠️ Rejected section jump from ${serverCurrentSectionKey} to ${currentSectionKey}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid section navigation. Use section transition API to advance.',
          currentSectionKey: serverCurrentSectionKey
        });
      }
      
      // If navigating to a locked section, they can view but not modify responses
      if (isLockedSection) {
        console.log(`ℹ️ Client viewing locked section ${currentSectionKey} (read-only)`);
      }
    }
    
    // Update session state (only within allowed sections)
    if (currentQuestionIndex !== undefined) attempt.currentQuestionIndex = currentQuestionIndex;
    // Only update section if validated above
    if (currentSectionIndex !== undefined && currentSectionKey === serverCurrentSectionKey) {
      attempt.currentSectionIndex = currentSectionIndex;
    }
    if (currentSectionKey && currentSectionKey === serverCurrentSectionKey) {
      attempt.currentSectionKey = currentSectionKey;
    }
    
    // Build validated section states based on SERVER-SIDE section definitions only
    // Ignore unknown sections from client, enforce timing strictly
    const validatedStates = test.sections.map((sectionDef, idx) => {
      // Get existing server state by section name (not by index)
      const existingState = attempt.sectionStates?.find(s => s.sectionKey === sectionDef.name);
      // Get client state if provided (matched by section name, not index)
      const clientState = sectionStates?.find(s => s.sectionKey === sectionDef.name);
      
      // If section is already locked/completed server-side, ALWAYS keep it locked
      if (existingState?.isLocked || existingState?.isCompleted) {
        return {
          sectionKey: sectionDef.name,
          startedAt: existingState.startedAt,
          remainingSeconds: 0,
          isLocked: true,
          isCompleted: true,
          completedAt: existingState.completedAt
        };
      }
      
      // Use server's startedAt, ignore client's startedAt to prevent manipulation
      const startedAt = existingState?.startedAt;
      
      if (startedAt) {
        // Calculate remaining time strictly from server data
        const sectionStartTime = new Date(startedAt);
        const sectionTotalSeconds = sectionDef.duration * 60;
        const elapsedSeconds = Math.floor((currentTime - sectionStartTime) / 1000);
        const serverCalculatedRemaining = Math.max(0, sectionTotalSeconds - elapsedSeconds);
        
        // If time has expired server-side, lock the section regardless of client state
        if (serverCalculatedRemaining === 0) {
          return {
            sectionKey: sectionDef.name,
            startedAt: startedAt,
            remainingSeconds: 0,
            isCompleted: true,
            isLocked: true,
            completedAt: currentTime.toISOString()
          };
        }
        
        // Return server-calculated remaining (ignore client's remaining time completely)
        return {
          sectionKey: sectionDef.name,
          startedAt: startedAt,
          remainingSeconds: serverCalculatedRemaining,
          isLocked: false,
          isCompleted: false,
          completedAt: null
        };
      }
      
      // Section not started yet - preserve existing state or create new
      if (existingState) {
        return existingState;
      }
      
      return {
        sectionKey: sectionDef.name,
        startedAt: null,
        remainingSeconds: sectionDef.duration * 60,
        isLocked: false,
        isCompleted: false,
        completedAt: null
      };
    });
    
    attempt.sectionStates = validatedStates;
    
    // CRITICAL: Identify which sections are now expired/locked based on server calculation
    // Build a set of expired section keys for response filtering
    const expiredSectionKeys = new Set(
      validatedStates.filter(s => s.isLocked || s.isCompleted).map(s => s.sectionKey)
    );
    
    // Update responses if provided - only update selectedAnswer, preserve other fields
    // REJECT responses for questions in expired/locked sections
    if (responses && Array.isArray(responses)) {
      for (const resp of responses) {
        if (!resp.questionId) continue;
        
        // Find which section this question belongs to
        // Method 1: Try to find in section.questions (ObjectIds)
        let questionSectionName = null;
        for (const section of test.sections) {
          if (section.questions?.some(q => q.toString() === resp.questionId)) {
            questionSectionName = section.name;
            break;
          }
        }
        
        // Method 2: If not found, query MockTestQuestion directly
        if (!questionSectionName) {
          const questionDoc = await MockTestQuestion.findById(resp.questionId).select('section');
          if (questionDoc && questionDoc.section) {
            questionSectionName = questionDoc.section;
          }
        }
        
        // SECURITY: If we can't determine the section, REJECT the response (fail-closed)
        if (!questionSectionName) {
          console.log(`⚠️ Rejected response: cannot determine section for question ${resp.questionId}`);
          continue; // Skip this response - fail-closed security
        }
        
        // Reject response if section is expired/locked
        if (expiredSectionKeys.has(questionSectionName)) {
          console.log(`⚠️ Rejected response for expired section ${questionSectionName}, question ${resp.questionId}`);
          continue; // Skip this response
        }
        
        const existingIndex = attempt.responses.findIndex(
          r => r.questionId && r.questionId.toString() === resp.questionId
        );
        
        if (existingIndex >= 0) {
          // Only update specific fields, preserve existing response data
          if (resp.selectedAnswer !== undefined) {
            attempt.responses[existingIndex].selectedAnswer = resp.selectedAnswer;
            attempt.responses[existingIndex].isAnswered = !!resp.selectedAnswer;
          }
          if (resp.isMarkedForReview !== undefined) {
            attempt.responses[existingIndex].isMarkedForReview = resp.isMarkedForReview;
          }
          attempt.responses[existingIndex].answeredAt = new Date();
        } else if (resp.selectedAnswer) {
          // Only add new response if there's actually an answer
          attempt.responses.push({
            questionId: resp.questionId,
            selectedAnswer: resp.selectedAnswer,
            isAnswered: true,
            isMarkedForReview: resp.isMarkedForReview || false,
            isVisited: true,
            answeredAt: new Date()
          });
        }
      }
    }
    
    attempt.lastSyncedAt = new Date();
    attempt.status = 'IN_PROGRESS';

    await attempt.save();

    console.log('✅ Progress synced successfully');
    res.status(200).json({
      success: true,
      message: 'Progress synced successfully',
      lastSyncedAt: attempt.lastSyncedAt,
      // Return server-validated section states so frontend can sync
      sectionStates: attempt.sectionStates
    });
  } catch (error) {
    console.error('❌ Error syncing progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync progress',
      error: error.message
    });
  }
};

// Transition to next section (with strict time enforcement)
const transitionSection = async (req, res) => {
  try {
    const { attemptId } = req.params;
    // Support both payload formats (fromSection/toSection and currentSectionKey/nextSectionKey)
    const fromSection = req.body.fromSection || req.body.currentSectionKey;
    const toSection = req.body.toSection || req.body.nextSectionKey;
    const sectionTimeSpent = req.body.sectionTimeSpent;
    const userId = req.user.id;

    console.log(`🔀 Section transition for attempt: ${attemptId} from ${fromSection} to ${toSection}`);

    const attempt = await MockTestAttempt.findOne({
      _id: attemptId,
      userId: userId
    }).populate('testPaperId');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt not found'
      });
    }

    if (attempt.status === 'COMPLETED' || attempt.status === 'EXPIRED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot transition section for completed/expired test'
      });
    }

    // Find and update current section state
    let currentSectionState = attempt.sectionStates.find(s => s.sectionKey === fromSection);
    if (currentSectionState) {
      currentSectionState.isCompleted = true;
      currentSectionState.completedAt = new Date();
      currentSectionState.isLocked = true;
      currentSectionState.remainingSeconds = 0;
    } else {
      // Create section state if it doesn't exist
      attempt.sectionStates.push({
        sectionKey: fromSection,
        isCompleted: true,
        completedAt: new Date(),
        isLocked: true,
        remainingSeconds: 0
      });
    }

    // Find next section index
    const test = attempt.testPaperId;
    const nextSectionIndex = test.sections.findIndex(s => s.name === toSection);
    
    if (nextSectionIndex === -1 && toSection) {
      return res.status(400).json({
        success: false,
        message: 'Next section not found'
      });
    }

    // Initialize next section state if exists
    if (toSection) {
      const nextSection = test.sections[nextSectionIndex];
      let nextSectionState = attempt.sectionStates.find(s => s.sectionKey === toSection);
      
      if (!nextSectionState) {
        attempt.sectionStates.push({
          sectionKey: toSection,
          startedAt: new Date(),
          remainingSeconds: nextSection.duration * 60, // Convert minutes to seconds
          isLocked: false,
          isCompleted: false
        });
      } else if (!nextSectionState.startedAt) {
        nextSectionState.startedAt = new Date();
        nextSectionState.remainingSeconds = nextSection.duration * 60;
      }

      attempt.currentSectionKey = toSection;
      attempt.currentSectionIndex = nextSectionIndex;
      attempt.currentQuestionIndex = 0;
    }

    attempt.lastSyncedAt = new Date();
    await attempt.save();

    console.log('✅ Section transition completed successfully');
    res.status(200).json({
      success: true,
      message: 'Section transition completed',
      currentSectionKey: attempt.currentSectionKey,
      currentSectionIndex: attempt.currentSectionIndex,
      sectionStates: attempt.sectionStates
    });
  } catch (error) {
    console.error('❌ Error transitioning section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to transition section',
      error: error.message
    });
  }
};

// Submit test
const submitTest = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user.id;

    console.log(`📤 Submitting test attempt: ${attemptId}`);

    const attempt = await MockTestAttempt.findOne({
      _id: attemptId,
      userId: userId
    }).populate('testPaperId');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt not found'
      });
    }

    if (attempt.isSubmitted) {
      return res.status(400).json({
        success: false,
        message: 'Test already submitted'
      });
    }

    // Calculate scores
    let totalScore = 0;
    let positiveMarks = 0;
    let negativeMarks = 0;

    for (const response of attempt.responses) {
      if (response.isAnswered) {
        const question = await MockTestQuestion.findById(response.questionId);
        
        if (question) {
          // Check if answer is correct
          let isCorrect = false;
          if (question.questionType === 'MCQ') {
            isCorrect = response.selectedAnswer === question.correctAnswer;
          } else if (question.questionType === 'MSQ') {
            // For multiple select questions
            isCorrect = JSON.stringify(response.selectedAnswer.sort()) === 
                       JSON.stringify(question.correctAnswer.sort());
          } else if (question.questionType === 'NAT') {
            isCorrect = parseFloat(response.selectedAnswer) === parseFloat(question.correctAnswer);
          }

          if (isCorrect) {
            totalScore += question.marks.positive;
            positiveMarks += question.marks.positive;
          } else {
            totalScore += question.marks.negative;
            negativeMarks += Math.abs(question.marks.negative);
          }
        }
      }
    }

    // Update attempt
    attempt.isCompleted = true;
    attempt.isSubmitted = true;
    attempt.endTime = new Date();
    attempt.timeSpent = Math.floor((attempt.endTime - attempt.startTime) / (1000 * 60)); // in minutes
    attempt.score.total = totalScore;
    attempt.marks.total = totalScore;
    attempt.marks.positive = positiveMarks;
    attempt.marks.negative = negativeMarks;

    await attempt.save();

    console.log('✅ Test submitted successfully');
    res.status(200).json({
      success: true,
      message: 'Test submitted successfully',
      score: totalScore,
      timeSpent: attempt.timeSpent
    });
  } catch (error) {
    console.error('❌ Error submitting test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit test',
      error: error.message
    });
  }
};

// Get student's test history
const getTestHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    console.log(`📜 Fetching test history for user: ${userId}`);

    const attempts = await MockTestAttempt.find({ userId: userId })
      .populate('testPaperId', 'title testNumber')
      .populate('seriesId', 'title category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MockTestAttempt.countDocuments({ userId: userId });

    console.log(`✅ Found ${attempts.length} test attempts`);
    res.status(200).json({
      success: true,
      attempts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching test history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test history',
      error: error.message
    });
  }
};

// Get attempt data for resuming
const getAttemptData = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user.id;

    console.log(`📖 Getting attempt data: ${attemptId} for user: ${userId}`);

    const attempt = await MockTestAttempt.findOne({
      _id: attemptId,
      userId: userId
    }).populate('testPaperId');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt not found'
      });
    }

    // Get test data with questions
    const test = attempt.testPaperId;
    const questionsWithSections = [];

    for (const section of test.sections) {
      let questions = [];
      
      // First try to get questions from section.questions array
      if (section.questions && section.questions.length > 0) {
        questions = await MockTestQuestion.find({
          _id: { $in: section.questions }
        }).select('_id questionText passage questionType section images options marks sequenceNumber correctOptionIds').sort({ sequenceNumber: 1 });
      }
      
      // Fallback: If no questions found in section.questions, query by testPaperId and section name
      if (questions.length === 0) {
        console.log(`🔄 Resume fallback: Querying questions for section ${section.name} by testPaperId`);
        questions = await MockTestQuestion.find({
          testPaperId: test._id,
          section: section.name,
          isActive: true
        }).select('_id questionText passage questionType section images options marks sequenceNumber correctOptionIds').sort({ sequenceNumber: 1 });
        
        // Also update the test's section with these question IDs for future use
        if (questions.length > 0) {
          const sectionIndex = test.sections.findIndex(s => s.name === section.name);
          if (sectionIndex !== -1) {
            test.sections[sectionIndex].questions = questions.map(q => q._id);
            await test.save();
            console.log(`✅ Updated section ${section.name} with ${questions.length} question IDs`);
          }
        }
      }
      
      console.log(`📝 Resume - Section ${section.name}: Found ${questions.length} questions`);

      questionsWithSections.push({
        name: section.name,
        duration: section.duration,
        questions: questions
      });
    }

    // Calculate remaining time
    const startTime = new Date(attempt.startedAt);
    const currentTime = new Date();
    const elapsedMinutes = Math.floor((currentTime - startTime) / (1000 * 60));
    const totalDurationMinutes = attempt.totalDuration;
    const remainingMinutes = Math.max(0, totalDurationMinutes - elapsedMinutes);

    // Server-side validation for expired sections on resume
    // Validate sectionStates based on startedAt + duration to enforce strict time limits
    let validatedSectionStates = attempt.sectionStates || [];
    let needsSave = false;
    
    if (validatedSectionStates.length > 0) {
      validatedSectionStates = validatedSectionStates.map((state) => {
        // Find section by sectionKey instead of index to be more robust
        const sectionDef = test.sections.find(s => s.name === state.sectionKey);
        
        // If section is already marked as completed/locked, keep it that way
        if (state.isCompleted || state.isLocked) {
          return {
            ...state,
            remainingSeconds: 0,
            isLocked: true,
            isCompleted: true
          };
        }
        
        // If section was started, check if it has expired
        if (state.startedAt && sectionDef) {
          const sectionStartTime = new Date(state.startedAt);
          const sectionDuration = sectionDef.duration || 60; // minutes
          const sectionElapsedSeconds = Math.floor((currentTime - sectionStartTime) / 1000);
          const sectionTotalSeconds = sectionDuration * 60;
          const calculatedRemaining = Math.max(0, sectionTotalSeconds - sectionElapsedSeconds);
          
          // If time has expired, lock the section regardless of stored state
          if (calculatedRemaining === 0) {
            needsSave = true;
            return {
              ...state,
              remainingSeconds: 0,
              isCompleted: true,
              isLocked: true,
              completedAt: state.completedAt || currentTime.toISOString()
            };
          }
          
          // Use the lesser of stored and calculated remaining (prevent time manipulation)
          const validatedRemaining = Math.min(state.remainingSeconds || sectionTotalSeconds, calculatedRemaining);
          if (validatedRemaining !== state.remainingSeconds) {
            needsSave = true;
          }
          return {
            ...state,
            remainingSeconds: validatedRemaining
          };
        }
        
        return state;
      });
      
      // Save updated section states if modified
      if (needsSave) {
        attempt.sectionStates = validatedSectionStates;
        await attempt.save();
        console.log('🔒 Updated section states with server-validated times');
      }
    }

    // Convert responses to frontend format
    const responseMap = {};
    attempt.responses.forEach(resp => {
      if (resp.selectedAnswer) {
        responseMap[resp.questionId.toString()] = resp.selectedAnswer;
      }
    });

    // Include validated section states in the response
    const attemptWithValidatedStates = {
      ...attempt.toObject(),
      sectionStates: validatedSectionStates
    };

    console.log('✅ Attempt data retrieved successfully');
    res.status(200).json({
      success: true,
      test: {
        _id: test._id,
        title: test.title,
        duration: test.duration,
        sections: questionsWithSections,
        instructions: (() => {
          if (!test.instructions) return [];

          // If it's already an array, return it
          if (Array.isArray(test.instructions)) return test.instructions;

          // If it's an object with general/sectionSpecific properties
          if (typeof test.instructions === 'object') {
            const flattened = [];
            if (test.instructions.general && Array.isArray(test.instructions.general)) {
              flattened.push(...test.instructions.general);
            }
            if (test.instructions.sectionSpecific && Array.isArray(test.instructions.sectionSpecific)) {
              flattened.push(...test.instructions.sectionSpecific);
            }
            // If no general/sectionSpecific, try to convert the object to string
            if (flattened.length === 0) {
              flattened.push(JSON.stringify(test.instructions));
            }
            return flattened;
          }

          // If it's a string, wrap in array
          return [test.instructions];
        })()
      },
      attempt: attemptWithValidatedStates,
      timeRemaining: remainingMinutes * 60, // Convert to seconds
      responses: responseMap
    });
  } catch (error) {
    console.error('❌ Error getting attempt data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get attempt data',
      error: error.message
    });
  }
};
// Student Mock Test dashboard ke liye – complete tree banane wala API
const getMockTestTree = async (req, res) => {
  try {
    console.log('🌲 Building mock test tree for student dashboard');
    const ExamCategory = require('../models/ExamCategory');
    const ExamYear = require('../models/ExamYear');
    const ExamSlot = require('../models/ExamSlot');

    const tests = await MockTest.find({
      isActive: true,
      isPublished: true
    })
    .populate('previousYearExamCategoryId')
    .populate('previousYearExamYearId')
    .populate('previousYearExamSlotId')
    .sort({ createdAt: -1 });

    const tree = {
      previousYear: {
        paperWise: {},
        topicWise: {}
      },
      fullTests: [],
      seriesTests: [],
      moduleTests: [],
      sessionalTests: {}
    };

    tests.forEach((test) => {
      const common = {
        id: test._id,
        title: test.title,
        description: test.description,
        durationMinutes: test.duration,
        totalQuestions: test.totalQuestions,
        totalMarks: test.totalMarks
      };

      const type = test.testType || 'full';

      switch (type) {
        case 'previousYear': {
          if (test.paperType === 'paperWise') {
            const categoryName = test.previousYearExamCategoryId?.name || test.exam || 'OTHER';
            const yearLabel = test.previousYearExamYearId?.label || test.yearLabel || 'Unknown Year';
            const slotLabel = test.previousYearExamSlotId?.label || '';
            
            // Initialize category if doesn't exist
            if (!tree.previousYear.paperWise[categoryName]) {
              tree.previousYear.paperWise[categoryName] = { 
                exams: [],  // Backward compatibility
                years: {}   // New hierarchical structure
              };
            }
            
            // Legacy format for backward compatibility
            const legacyTestData = {
              id: test._id,
              yearLabel,
              declaration: test.description || '',
              durationMinutes: test.duration,
              totalMarks: test.totalMarks
            };
            
            // Enhanced format with filtering metadata
            const enrichedTestData = {
              ...legacyTestData,
              title: test.title,
              slotLabel,
              description: test.description || '',
              categoryId: test.previousYearExamCategoryId?._id,
              yearId: test.previousYearExamYearId?._id,
              slotId: test.previousYearExamSlotId?._id
            };
            
            // Add to legacy exams array using legacy format
            tree.previousYear.paperWise[categoryName].exams.push(legacyTestData);
            
            // Add to new hierarchical structure using enriched format
            if (test.previousYearExamCategoryId) {
              if (!tree.previousYear.paperWise[categoryName].years[yearLabel]) {
                tree.previousYear.paperWise[categoryName].years[yearLabel] = { slots: {} };
              }
              if (slotLabel) {
                if (!tree.previousYear.paperWise[categoryName].years[yearLabel].slots[slotLabel]) {
                  tree.previousYear.paperWise[categoryName].years[yearLabel].slots[slotLabel] = { tests: [] };
                }
                tree.previousYear.paperWise[categoryName].years[yearLabel].slots[slotLabel].tests.push(enrichedTestData);
              }
            }
          } else if (test.paperType === 'topicWise') {
            const subject = test.subject || 'General';
            if (!tree.previousYear.topicWise[subject]) {
              tree.previousYear.topicWise[subject] = { topics: [] };
            }
            tree.previousYear.topicWise[subject].topics.push({
              id: test._id,
              topic: test.topic || '',
              title: test.title,
              description: test.description || '',
              durationMinutes: test.duration
            });
          }
          break;
        }

        case 'full': {
          tree.fullTests.push({
            ...common,
            name: test.title
          });
          break;
        }

        case 'series': {
          tree.seriesTests.push({
            ...common,
            name: test.title
          });
          break;
        }

        case 'module': {
          tree.moduleTests.push({
            ...common,
            name: test.title
          });
          break;
        }

        case 'sessional': {
          const year = test.sessionYear || 'Other';
          if (!tree.sessionalTests[year]) {
            tree.sessionalTests[year] = [];
          }
          tree.sessionalTests[year].push({
            ...common,
            name: test.title
          });
          break;
        }

        default: {
          tree.fullTests.push({
            ...common,
            name: test.title
          });
        }
      }
    });

    console.log('✅ Mock test tree built successfully');
    return res.status(200).json({
      success: true,
      data: tree
    });
  } catch (error) {
    console.error('❌ Error building mock test tree:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load mock test tree',
      error: error.message
    });
  }
};
module.exports = {
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
  getMockTestTree 
};
