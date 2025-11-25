/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const multer = require("multer");

dotenv.config();

/* -------------------- Environment Debug -------------------- */
console.log("🔍 Environment Debug:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("MONGO_URI length:", process.env.MONGO_URI ? process.env.MONGO_URI.length : 0);

/* -------------------- DB Connection -------------------- */
const Connection = require("./dbConnection");
Connection();

/* -------------------- App Init -------------------- */
const app = express();
app.set("trust proxy", 1); // for fly.dev / proxies

/* -------------------- Security / Parsers -------------------- */
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

/* -------------------- Optional Auth (safe fallback) -------------------- */
let optionalAuth;
try {
  ({ optionalAuth } = require("./middleware/authMiddleware"));
  if (typeof optionalAuth !== "function") throw new Error("optionalAuth not a function");
} catch (e) {
  console.log("⚠️ optionalAuth not found/invalid, using safe stub.", e.message);
  optionalAuth = (req, _res, next) => next();
}

/* -------------------- Rate Limiter (API scope) -------------------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 3000 : 1000000,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, _res) => (req.user && req.user.id) || req.ip,
  skip: (req, _res) => {
    if (process.env.NODE_ENV !== "production") return true;
    const url = req.originalUrl || req.path || "";
    if (url.startsWith("/api/health") || url.startsWith("/api/test")) return true;
    if (req.method === "GET" && (url.startsWith("/api/live-classes") || url.includes("/live-classes"))) return true;
    if (req.method === "GET" && url.startsWith("/api/courses/student/published-courses")) return true;
    if (req.method === "GET" && (url === "/api/courses" || url.startsWith("/api/courses?"))) return true;
    return false;
  },
  message: "Too many requests from this client, please try again after 15 minutes.",
});
app.use("/api", optionalAuth, limiter);

/* -------------------- CORS -------------------- */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3001/",
  "http://localhost:3002",
   "http://localhost:5000",
  "http://localhost:5001",
  "http://127.0.0.1:3000",
  "https://tathagat.satyaka.in",
  "https://602013ebf633402e8096c9cab19561d7-38235a13d63b4a5991fa93f6f.fly.dev",
  "https://56e17d465c834696b5b3654be57883bc-f85b5f4c5dc640488369d7da4.fly.dev",
];

app.use(
  cors({
    origin: (origin, cb) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
         "http://localhost:3001/",
        "http://localhost:3002",
        "http://localhost:5000",
        "http://localhost:5001",
        "http://127.0.0.1:3000",
        "https://tathagat.satyaka.in",
        "https://tathagat.co.in",
        "https://www.tathagat.co.in",
        "https://602013ebf633402e8096c9cab19561d7-38235a13d63b4a5991fa93f6f.fly.dev",
        "https://56e17d465c834696b5b3654be57883bc-f85b5f4c5dc640488369d7da4.fly.dev",
      ];

      if (!origin) return cb(null, true); // Allow Postman / curl
      if (allowedOrigins.includes(origin)) return cb(null, true);

      console.log("❌ CORS blocked:", origin);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);


/* -------------------- Static: uploads (ensure dir) -------------------- */
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // loosen in dev
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
app.use("/uploads", express.static(uploadsDir));

/* -------------------- Health/Test -------------------- */
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/test", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working in production",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* -------------------- Dev Login (atomic upsert) -------------------- */
app.post("/api/dev/login", async (req, res) => {
  try {
    const jwt = require("jsonwebtoken");
    const User = require("./models/UserSchema");

    console.log("🛠️ Development login request received");

    const demoEmail = "demo@test.com";
    const demoUser = await User.findOneAndUpdate(
      { email: demoEmail },
      {
        $setOnInsert: {
          email: demoEmail,
          phoneNumber: "9999999999",
          name: "Demo Student",
          isEmailVerified: true,
          isPhoneVerified: true,
          city: "Demo City",
          gender: "Male",
          dob: new Date("1995-01-01"),
          selectedCategory: "CAT",
          selectedExam: "CAT 2025",
          enrolledCourses: [],
        },
      },
      { upsert: true, new: true }
    );
    console.log("✅ Demo user ready in database with ID:", demoUser._id);

    const jwtSecret = process.env.JWT_SECRET || "test_secret_key_for_development";
    const token = jwt.sign({ id: demoUser._id, role: "student" }, jwtSecret, { expiresIn: "24h" });

    console.log("✅ Development token created for real user:", demoUser._id);

    res.status(200).json({
      success: true,
      message: "Development user logged in",
      token,
      user: { id: demoUser._id, email: demoUser.email, name: demoUser.name, role: "student" },
    });
  } catch (error) {
    console.error("❌ Dev login error:", error);
    res.status(500).json({ success: false, message: "Development login failed", error: error.message });
  }
});

/* -------------------- Dev Unlock Course -------------------- */
app.post("/api/dev/unlock-course", async (req, res) => {
  try {
    console.log("🔧 Development course unlock requested");
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ success: false, message: "Course ID required" });

    const User = require("./models/UserSchema");
    const demoEmail = "demo@test.com";

    const demoUser = await User.findOneAndUpdate(
      { email: demoEmail },
      {
        $setOnInsert: {
          email: demoEmail,
          phoneNumber: "9999999999",
          name: "Demo Student",
          isEmailVerified: true,
          isPhoneVerified: true,
          city: "Demo City",
          gender: "Male",
          dob: new Date("1995-01-01"),
          selectedCategory: "CAT",
          selectedExam: "CAT 2025",
          enrolledCourses: [],
        },
      },
      { upsert: true, new: true }
    );
    console.log("✅ Demo user ready:", demoUser._id);

    const existingCourse = demoUser.enrolledCourses.find((c) => c.courseId && c.courseId.toString() === courseId);
    if (existingCourse) {
      return res.status(200).json({ success: true, message: "Course already unlocked", alreadyUnlocked: true });
    }

    demoUser.enrolledCourses.push({ courseId, status: "unlocked", enrolledAt: new Date() });
    await demoUser.save();
    console.log("✅ Course unlocked for demo user:", courseId);

    res.status(200).json({ success: true, message: "Course unlocked successfully", courseId, userId: demoUser._id });
  } catch (error) {
    console.error("❌ Dev course unlock error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

/* -------------------- Dev Verify Token -------------------- */
app.get("/api/dev/verify-token", (req, res) => {
  const jwt = require("jsonwebtoken");
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(400).json({ success: false, message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "test_secret_key_for_development");
    console.log("✅ Token verified for user:", decoded);
    res.status(200).json({ success: true, message: "Token is valid", user: decoded });
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    res.status(401).json({ success: false, message: "Invalid token", error: error.message });
  }
});

/* -------------------- Sample Data Seeders (guarded by SKIP_SEED) -------------------- */
const addSampleStudyMaterials = async () => {
  try {
    const StudyMaterial = require("./models/StudyMaterial");
    const Admin = require("./models/Admin");
    const existingCount = await StudyMaterial.countDocuments();
    if (existingCount > 0) {
      console.log(`📚 ${existingCount} study materials already exist in database`);
      return;
    }
    let admin = await Admin.findOne();
    if (!admin) {
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      admin = new Admin({
        name: "Sample Admin",
        email: "admin@sample.com",
        password: hashedPassword,
        phoneNumber: "1234567890",
      });
      await admin.save();
      console.log("✅ Sample admin created");
    }

    const sampleMaterials = [
      {
        title: "Quantitative Aptitude Formula Book",
        description:
          "Complete formula book covering all topics of Quantitative Aptitude including Arithmetic, Algebra, Geometry, and Number Systems.",
        subject: "Quantitative Aptitude",
        type: "PDF",
        fileName: "QA_Formula_Book.pdf",
        filePath: "uploads/study-materials/sample-qa-formulas.txt",
        fileSize: "5.2 MB",
        tags: ["formulas", "QA", "reference", "mathematics"],
        downloadCount: 1234,
        uploadedBy: admin._id,
        isActive: true,
      },
      {
        title: "Verbal Ability Video Lectures Series",
        description:
          "Comprehensive video lecture series covering Reading Comprehension, Para Jumbles, Critical Reasoning, and Grammar.",
        subject: "Verbal Ability",
        type: "Video",
        fileName: "VA_Video_Lectures.mp4",
        filePath: "uploads/study-materials/sample-va-videos.txt",
        fileSize: "850 MB",
        tags: ["video", "verbal", "lectures", "comprehension"],
        downloadCount: 856,
        uploadedBy: admin._id,
        isActive: true,
      },
      {
        title: "Data Interpretation Practice Sets",
        description:
          "Collection of 50 practice sets for Data Interpretation covering Tables, Charts, Graphs, and Caselets.",
        subject: "Data Interpretation",
        type: "Practice Sets",
        fileName: "DI_Practice_Sets.pdf",
        filePath: "uploads/study-materials/sample-di-practice.txt",
        fileSize: "3.8 MB",
        tags: ["practice", "DI", "charts", "graphs"],
        downloadCount: 945,
        uploadedBy: admin._id,
        isActive: true,
      },
      {
        title: "Logical Reasoning Shortcuts & Tricks",
        description:
          "Quick shortcuts and time-saving tricks for solving Logical Reasoning questions efficiently.",
        subject: "Logical Reasoning",
        type: "Notes",
        fileName: "LR_Shortcuts.pdf",
        filePath: "uploads/study-materials/sample-lr-shortcuts.txt",
        fileSize: "2.1 MB",
        tags: ["shortcuts", "tricks", "logical reasoning", "time-saving"],
        downloadCount: 672,
        uploadedBy: admin._id,
        isActive: true,
      },
      {
        title: "CAT Previous Year Papers (2010-2023)",
        description:
          "Complete collection of CAT previous year question papers with detailed solutions and explanations.",
        subject: "All Subjects",
        type: "PDF",
        fileName: "CAT_Previous_Papers.pdf",
        filePath: "uploads/study-materials/sample-cat-papers.txt",
        fileSize: "12.5 MB",
        tags: ["previous papers", "CAT", "solutions", "practice"],
        downloadCount: 2156,
        uploadedBy: admin._id,
        isActive: true,
      },
      {
        title: "Reading Comprehension Passages",
        description:
          "Collection of high-quality Reading Comprehension passages from various topics with detailed explanations.",
        subject: "Verbal Ability",
        type: "PDF",
        fileName: "RC_Passages.pdf",
        filePath: "uploads/study-materials/sample-rc-passages.txt",
        fileSize: "7.3 MB",
        tags: ["reading comprehension", "passages", "verbal", "practice"],
        downloadCount: 789,
        uploadedBy: admin._id,
        isActive: true,
      },
      {
        title: "Quantitative Aptitude Video Solutions",
        description:
          "Video solutions for complex QA problems with step-by-step explanations and alternative methods.",
        subject: "Quantitative Aptitude",
        type: "Video",
        fileName: "QA_Video_Solutions.mp4",
        filePath: "uploads/study-materials/sample-qa-solutions.txt",
        fileSize: "1.2 GB",
        tags: ["video solutions", "QA", "problem solving", "mathematics"],
        downloadCount: 543,
        uploadedBy: admin._id,
        isActive: true,
      },
      {
        title: "General Knowledge Current Affairs",
        description:
          "Latest current affairs and general knowledge updates for competitive exam preparation.",
        subject: "General Knowledge",
        type: "PDF",
        fileName: "GK_Current_Affairs.pdf",
        filePath: "uploads/study-materials/sample-gk-current.txt",
        fileSize: "4.6 MB",
        tags: ["current affairs", "GK", "general knowledge", "updates"],
        downloadCount: 421,
        uploadedBy: admin._id,
        isActive: true,
      },
    ];

    const insertedMaterials = await StudyMaterial.insertMany(sampleMaterials);
    console.log(`✅ Successfully added ${insertedMaterials.length} study materials:`);
    insertedMaterials.forEach((m, i) => console.log(`${i + 1}. ${m.title} (${m.subject} - ${m.type})`));
    const totalMaterials = await StudyMaterial.countDocuments();
    console.log(`\n📊 Total study materials in database: ${totalMaterials}`);
  } catch (error) {
    console.error("❌ Error adding sample materials:", error);
  }
};

const addSampleAnnouncements = async () => {
  try {
    const Announcement = require("./models/Announcement");
    const Admin = require("./models/Admin");
    const existingCount = await Announcement.countDocuments();
    if (existingCount > 0) {
      console.log(`📢 ${existingCount} announcements already exist in database`);
      return;
    }
    let admin = await Admin.findOne();
    if (!admin) {
      console.log("⚠️ No admin found for announcements");
      return;
    }

    const sampleAnnouncements = [
      {
        title: "🎉 New Mock Test Series Released!",
        content:
          "We have launched the latest CAT 2024 mock test series with updated patterns and difficulty levels. These tests are designed to simulate the actual exam environment.",
        type: "important",
        priority: "high",
        targetAudience: "students",
        isPinned: true,
        createdBy: admin._id,
        tags: ["mock tests", "CAT 2024", "new release"],
        isActive: true,
      },
      {
        title: "📚 Study Materials Updated",
        content:
          "Quantitative Aptitude formulas and shortcuts have been updated with new content covering advanced topics and time-saving techniques.",
        type: "update",
        priority: "medium",
        targetAudience: "students",
        isPinned: false,
        createdBy: admin._id,
        tags: ["study materials", "quantitative aptitude", "update"],
        isActive: true,
      },
      {
        title: "🔔 Upcoming Live Session",
        content:
          "Join us for a special doubt clearing session on Data Interpretation this Friday at 7 PM. Our expert faculty will solve complex DI problems.",
        type: "reminder",
        priority: "medium",
        targetAudience: "students",
        isPinned: false,
        createdBy: admin._id,
        tags: ["live session", "data interpretation", "doubt clearing"],
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        title: "📈 Performance Reports Available",
        content:
          "Your monthly performance report is now available in the Analysis section. Check your progress and identify areas for improvement.",
        type: "update",
        priority: "low",
        targetAudience: "students",
        isPinned: false,
        createdBy: admin._id,
        tags: ["performance report", "analysis", "progress"],
        isActive: true,
      },
      {
        title: "💡 New Feature: AI-Powered Question Recommendations",
        content:
          "We have introduced an AI-powered recommendation system that suggests practice questions based on your weak areas and learning patterns.",
        type: "general",
        priority: "medium",
        targetAudience: "all",
        isPinned: false,
        createdBy: admin._id,
        tags: ["AI", "recommendations", "personalized learning"],
        isActive: true,
      },
      {
        title: "🔧 Scheduled Maintenance",
        content:
          "The platform will undergo scheduled maintenance on Sunday from 2 AM to 4 AM IST. Some features may be temporarily unavailable.",
        type: "maintenance",
        priority: "high",
        targetAudience: "all",
        isPinned: false,
        createdBy: admin._id,
        tags: ["maintenance", "downtime", "schedule"],
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ];

    const insertedAnnouncements = await Announcement.insertMany(sampleAnnouncements);
    console.log(`✅ Successfully added ${insertedAnnouncements.length} sample announcements:`);
    insertedAnnouncements.forEach((a, i) => console.log(`${i + 1}. ${a.title} (${a.type} - ${a.priority})`));
    const totalAnnouncements = await Announcement.countDocuments();
    console.log(`\n📣 Total announcements in database: ${totalAnnouncements}`);
  } catch (error) {
    console.error("❌ Error adding sample announcements:", error);
  }
};

/* Guarded seed run (kept original behavior, gated by SKIP_SEED) */
if (!process.env.SKIP_SEED) {
  setTimeout(() => {
    addSampleStudyMaterials();
    addSampleAnnouncements();

    try {
      const addSampleDiscussions = require("./scripts/addSampleDiscussions");
      addSampleDiscussions();
    } catch (e) {
      console.log("⚠️ Skipped addSampleDiscussions:", e.message);
    }

    try {
      const addSampleMockTests = require("./scripts/addSampleMockTests");
      addSampleMockTests();
    } catch (e) {
      console.log("⚠️ Skipped addSampleMockTests:", e.message);
    }

    try {
      const { createDemoData } = require("./controllers/DemoController");
      setTimeout(() => {
        createDemoData(
          {},
          {
            json: (data) => console.log("Demo data result:", data && data.message),
          }
        );
      }, 5000);
    } catch (e) {
      console.log("⚠️ Skipped createDemoData:", e.message);
    }
  }, 3000);
}

/* -------------------- Request Logging (warn on 4xx/5xx) -------------------- */
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  const originalSend = res.send;
  res.send = function (data) {
    if (res.statusCode >= 400) {
      console.log(`⚠️ ${res.statusCode} Response - ${req.method} ${req.path} - ${data}`);
    }
    return originalSend.call(this, data);
  };
  next();
});

/* -------------------- Dev Payment Endpoints -------------------- */
app.post("/api/dev-payment/unlock-course-payment", async (req, res) => {
  try {
    console.log("🔧 Development payment unlock requested");
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ success: false, message: "Course ID required" });

    const User = require("./models/UserSchema");
    const demoUserId = "507f1f77bcf86cd799439011";
    const demoEmail = "demo@test.com";

    const demoUser = await User.findOneAndUpdate(
      { email: demoEmail },
      {
        $setOnInsert: {
          _id: demoUserId,
          email: demoEmail,
          phoneNumber: "9999999999",
          name: "Demo Student",
          isEmailVerified: true,
          isPhoneVerified: true,
          city: "Demo City",
          gender: "Male",
          dob: new Date("1995-01-01"),
          selectedCategory: "CAT",
          selectedExam: "CAT 2025",
          enrolledCourses: [],
        },
      },
      { upsert: true, new: true }
    );

    console.log("✅ Demo user ready:", demoUser._id);

    const existingCourse = demoUser.enrolledCourses.find((c) => c.courseId && c.courseId.toString() === courseId);
    if (existingCourse) {
      return res
        .status(200)
        .json({ success: true, message: "Course already unlocked", alreadyUnlocked: true, enrolledCourses: demoUser.enrolledCourses });
    }

    demoUser.enrolledCourses.push({ courseId, status: "unlocked", enrolledAt: new Date() });
    await demoUser.save();
    console.log("✅ Course unlocked for demo user:", courseId);

    res
      .status(200)
      .json({ success: true, message: "Course unlocked successfully", courseId, userId: demoUser._id, enrolledCourses: demoUser.enrolledCourses });
  } catch (error) {
    console.error("❌ Dev payment unlock error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

app.get("/api/dev-payment/my-courses", async (_req, res) => {
  try {
    console.log("🔧 Development my-courses requested");
    const User = require("./models/UserSchema");
    const demoEmail = "demo@test.com";

    let demoUser = await User.findOne({ email: demoEmail }).populate("enrolledCourses.courseId");
    if (!demoUser) {
      const demoUserId = "507f1f77bcf86cd799439011";
      demoUser = await User.findById(demoUserId).populate("enrolledCourses.courseId");
    }

    console.log("👤 Demo user found:", demoUser ? demoUser._id : "NOT FOUND");
    if (!demoUser) return res.status(200).json({ success: true, courses: [] });

    const unlockedCourses = demoUser.enrolledCourses
      .filter((c) => c.status === "unlocked" && c.courseId)
      .map((c) => ({ _id: c._id, status: c.status, enrolledAt: c.enrolledAt, courseId: c.courseId }));

    console.log("🎯 Dev endpoint filtered unlocked courses:", unlockedCourses.length);
    res.status(200).json({ success: true, courses: unlockedCourses });
  } catch (error) {
    console.error("❌ Dev my-courses error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

/* -------------------- Multer Upload -------------------- */
// Upload route is now handled by ./routes/UploadRoute.js with proper authentication and validation

/* -------------------- Routes (safe mount, no cuts, de-dup) -------------------- */
const mounted = new Set();
const safeUse = (mountPath, routerPath) => {
  if (mounted.has(mountPath)) {
    console.log(`ℹ️ Skipping duplicate mount of ${mountPath} (${routerPath})`);
    return;
  }
  try {
    const router = require(routerPath);
    app.use(mountPath, router);
    mounted.add(mountPath);
    console.log(`✅ Mounted ${mountPath} from ${routerPath}`);
  } catch (e) {
    console.log(`⚠️ Skipped ${mountPath} (${routerPath}) -> ${e.message}`);
  }
};

/* Original mounts preserved (nothing removed) */
safeUse("/api/auth/email", "./routes/authEmailRoutes");
safeUse("/api/auth/phone", "./routes/authPhoneRoutes");
safeUse("/api/user", "./routes/userRoutes");
safeUse("/api/v1", "./routes/Otp");
safeUse("/api/v2", "./routes/IIMPredictor");
safeUse("/api/v3", "./routes/ResponseSheet");

safeUse("/api/v5", "./routes/blogRoutes");

safeUse("/api/admin", "./routes/AdminRoute");
safeUse("/api/admin/bulk-upload", "./routes/bulkUpload");
safeUse("/api/admin/zoom", "./routes/zoom");
safeUse("/api/subadmin", "./routes/SubAdminRoute");
safeUse("/api/courses", "./routes/CourseRoute");
safeUse("/api/subjects", "./routes/SubjectRoute");
safeUse("/api/chapters", "./routes/ChapterRoute");
safeUse("/api/topics", "./routes/TopicRoute");
safeUse("/api/tests", "./routes/TestRoute");
safeUse("/api/questions", "./routes/QuestionRoute");
safeUse("/api/responses", "./routes/ResponseRoute");
safeUse("/api/upload", "./routes/UploadRoute");
safeUse("/api/study-materials", "./routes/StudyMaterialRoute");
safeUse("/api/announcements", "./routes/AnnouncementRoute");
safeUse("/api/discussions", "./routes/DiscussionRoute");
safeUse("/api/admin/discussions", "./routes/AdminDiscussionRoute");
safeUse("/api/mock-tests", "./routes/MockTestRoute");
safeUse("/api/admin/mock-tests", "./routes/AdminMockTestRoute");
safeUse("/api/admin/hierarchy", "./routes/hierarchyRoutes");
safeUse("/api/progress", "./routes/UserProgressRoute");
safeUse("/api/student", "./routes/StudentCourseRoute");
safeUse("/api/sample", "./routes/sampleData");
safeUse("/api/demo", "./routes/demoRoutes");
safeUse("/api/user", "./routes/userRoutes"); // will be auto de-duped
safeUse("/api/test", "./routes/testAuth");
safeUse("/api/dev", "./routes/devRoutes");
safeUse("/api/dev-payment", "./routes/devPayment");
safeUse("/api/test-endpoint", "./routes/testEndpoint");
safeUse("/api/crm", "./routes/crm");
safeUse("/api/live-classes", "./routes/liveClasses");
safeUse("/api/ocr", "./routes/ocr");
safeUse("/api/omr", "./routes/omr");
safeUse("/api", "./routes/reports");
safeUse("/api/payments", "./routes/payments");
safeUse("/api/pay", "./routes/payments");
safeUse("/api/practice-tests", "./routes/practiceTestRoutes");
safeUse("/api", "./routes/nextStep");
safeUse("/api/admin", "./routes/batchesAdmin");
safeUse("/api/admin/academics", "./routes/adminAcademics");

/* -------------------- Production Static (kept your note) -------------------- */
if (process.env.NODE_ENV === "production") {
  console.log("🚀 Production mode detected, but build directory not found");
  console.log("📁 Looking for build directory at:", path.join(__dirname, "../Frontend/build"));

  app.get("/", (_req, res) => {
    res.json({
      message: "Backend API is running",
      health: "/api/health",
      test: "/api/test",
      courses: "/api/courses/student/published-courses",
    });
  });
}

/* -------------------- Server Start -------------------- */
const PORT = process.env.PORT || 3001;
const HOST = "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Server accessible at http://${HOST}:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✅ JWT Secret loaded: ${!!process.env.JWT_SECRET}`);
});

server.on("error", (error) => {
  console.error("❌ Server startup error:", error);
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`);
  }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});

module.exports = app;
