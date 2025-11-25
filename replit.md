# Tathagat - CAT Exam Preparation Platform

## Overview
Tathagat is a full-stack educational platform designed for CAT (Common Admission Test) preparation. It offers comprehensive course management, mock tests, live classes, and detailed student progress tracking. The platform aims to provide a robust and engaging learning experience, preparing students effectively for the CAT exam, with ambitions to capture a significant share of the online test preparation market. Key capabilities include student dashboards, an extensive mock test system, live class integration, and an admin panel for content management.

## User Preferences
No specific user preferences were provided.

## System Architecture
The platform is built with a decoupled frontend and backend architecture.

**UI/UX Decisions:**
- The frontend utilizes React for a dynamic and responsive user interface.
- Rich text editing for questions and course content is provided through React-Quill, replacing Jodit Editor for a cleaner and more modern experience. This includes custom toolbars and image upload capabilities.
- The student journey for mock tests precisely mirrors the CAT exam flow: Instructions → Declaration → Test Start.
- Custom CSS styling is used, with a professional aesthetic, including a teal/green theme for video features in the admin panel.
- HTML content rendered to students is securely sanitized using DOMPurify to prevent XSS attacks, allowing for rich text and image display.

**Technical Implementations:**
- **Course Management:** Supports three distinct content types: "Full Course," "Recorded Classes," and "Mock Tests." The system includes full CRUD operations for videos within "Recorded Classes," allowing for serial ordering, topic organization, and granular control over free vs. paid video access.
- **Test Configuration:** Admins can configure section-wise duration and question counts for all test types (Previous Year Papers, Full Tests, Series Tests, Module Tests, Sessional Tests).
- **Question Management:** Features a robust question builder with rich text support, image uploads, and bulk CSV upload capabilities with normalization for sections and difficulty levels.
- **Video Access Control:** Implements database-level filtering to secure paid video content, ensuring only free videos are accessible to unauthorized users. Enrollment status directly controls access to paid content.
- **Partial Updates:** Course update APIs support partial updates, preventing data loss by only modifying fields explicitly provided in the request body.
- **Exam Hierarchy:** Infrastructure for filtering exams by category, year, and slot has been implemented in the backend, supporting future UI enhancements.

**System Design Choices:**
- **Backend:** Node.js/Express API server running on port 3001 (development) or 5000 (production in Replit), using MongoDB Atlas as the database.
- **Frontend:** React application running on port 5000.
- **Deployment:** Configured for VM deployment, running a unified development script that starts both frontend and backend services.
- **Authentication:** JWT-based authentication secures API endpoints.
- **API Proxying:** The frontend proxies all `/api` requests to the backend.

## External Dependencies
- **Database:** MongoDB Atlas
- **Payment Gateway:** Razorpay
- **Live Classes:** Zoom
- **Email Service:** Nodemailer
- **Frontend Libraries:** React, React Router, Axios, Chart.js
- **Rich Text Editor:** React-Quill
- **HTML Sanitization:** DOMPurify