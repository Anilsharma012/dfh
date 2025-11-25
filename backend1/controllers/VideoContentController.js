const VideoContent = require("../models/course/VideoContent");
const Course = require("../models/course/Course");

const addVideoContent = async (req, res) => {
  try {
    const { courseId, topicName, title, description, videoUrl, serialNumber, isFree, duration } = req.body;

    // Allow either videoUrl or uploaded file
    const hasVideoSource = videoUrl || req.file;
    if (!courseId || !title || !hasVideoSource) {
      return res.status(400).json({
        success: false,
        message: "Course ID, Title, and Video (file or URL) are required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Determine video source: uploaded file or URL
    let finalVideoUrl = videoUrl;
    if (req.file) {
      // Use uploaded file path
      finalVideoUrl = req.file.filename;
    }

    const video = new VideoContent({
      courseId,
      topicName: topicName || "",
      title,
      description: description || "",
      videoUrl: finalVideoUrl,
      serialNumber: serialNumber || 0,
      isFree: isFree || false,
      duration: duration || "",
      createdBy: req.user.id || req.user._id,
    });

    await video.save();

    res.status(201).json({
      success: true,
      message: "Video content added successfully",
      video,
    });
  } catch (error) {
    console.error("❌ Error adding video content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add video content",
      error: error.message,
    });
  }
};

const getVideosByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { topicName } = req.query;

    // 🔒 Build DB query with access control at database level
    const query = { courseId };
    if (topicName) {
      query.topicName = topicName;
    }

    const isAuthenticated = req.user && (req.user.id || req.user._id);
    
    // Check enrollment status if authenticated
    let isEnrolled = false;
    if (isAuthenticated) {
      const Enrollment = require("../models/Enrollment");
      const enrollment = await Enrollment.findOne({ 
        userId: req.user.id || req.user._id, 
        courseId: courseId,
        status: 'unlocked'
      });
      isEnrolled = !!enrollment;
    }

    // Apply access control filter at DB level
    if (!isEnrolled) {
      // Not authenticated OR not enrolled: Only fetch FREE videos from database
      query.isFree = true;
    }
    // If enrolled: No filter, fetch all videos

    // Execute database query with access-controlled filter
    const videos = await VideoContent.find(query).sort({ serialNumber: 1, createdAt: 1 });

    const message = isEnrolled 
      ? "Full access - course enrolled"
      : isAuthenticated 
        ? "Purchase course to access all videos. Showing free videos only."
        : "Showing free videos only. Login to access all videos.";

    res.status(200).json({
      success: true,
      videos,
      count: videos.length,
      message
    });
  } catch (error) {
    console.error("❌ Error fetching videos:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
      error: error.message,
    });
  }
};

const updateVideoContent = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { topicName, title, description, videoUrl, serialNumber, isFree, duration } = req.body;

    const video = await VideoContent.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    if (topicName !== undefined) video.topicName = topicName;
    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    
    // Handle video source: uploaded file or URL
    if (req.file) {
      video.videoUrl = req.file.filename;
    } else if (videoUrl !== undefined) {
      video.videoUrl = videoUrl;
    }
    
    if (serialNumber !== undefined) video.serialNumber = serialNumber;
    if (isFree !== undefined) video.isFree = isFree;
    if (duration !== undefined) video.duration = duration;

    await video.save();

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video,
    });
  } catch (error) {
    console.error("❌ Error updating video:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update video",
      error: error.message,
    });
  }
};

const deleteVideoContent = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await VideoContent.findByIdAndDelete(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting video:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete video",
      error: error.message,
    });
  }
};

const toggleVideoFreeStatus = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await VideoContent.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    video.isFree = !video.isFree;
    await video.save();

    res.status(200).json({
      success: true,
      message: `Video is now ${video.isFree ? "FREE" : "PAID"}`,
      video,
    });
  } catch (error) {
    console.error("❌ Error toggling video status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle video status",
      error: error.message,
    });
  }
};

const bulkUploadVideos = async (req, res) => {
  try {
    const { courseId, videos } = req.body;

    if (!courseId || !Array.isArray(videos) || videos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Course ID and videos array are required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const videoDocuments = videos.map((video, index) => ({
      courseId,
      topicName: video.topicName || "",
      title: video.title || `Video ${index + 1}`,
      description: video.description || "",
      videoUrl: video.videoUrl || "",
      serialNumber: video.serialNumber !== undefined ? video.serialNumber : index + 1,
      isFree: video.isFree || false,
      duration: video.duration || "",
      createdBy: req.user.id || req.user._id,
    }));

    const uploadedVideos = await VideoContent.insertMany(videoDocuments);

    res.status(201).json({
      success: true,
      message: `${uploadedVideos.length} videos uploaded successfully`,
      videos: uploadedVideos,
    });
  } catch (error) {
    console.error("❌ Error bulk uploading videos:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk upload videos",
      error: error.message,
    });
  }
};

module.exports = {
  addVideoContent,
  getVideosByCourse,
  updateVideoContent,
  deleteVideoContent,
  toggleVideoFreeStatus,
  bulkUploadVideos,
};
