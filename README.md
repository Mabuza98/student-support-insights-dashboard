AI-Enabled Student Support Insights Dashboard
Project Overview

The AI-Enabled Student Support Insights Dashboard is a full-stack web application developed to help programme teams identify learner support needs, monitor participation risks, and improve decision-making through data analytics and AI-supported recommendations.

The system allows users to capture learner information, analyse learner risks, generate dashboard insights, visualise trends, and export reports for operational use.

This project was developed as part of the Future Innovation Lab AI Internship Programme and demonstrates practical application of software development, data analytics, business process improvement, and responsible AI principles.

Project Objectives

The primary objectives of the project were to:

Collect learner information in a structured format.
Analyse learner support needs and risk indicators.
Visualise learner data using interactive dashboards.
Generate AI-supported insights and recommendations.
Improve learner support planning and operational efficiency.
Demonstrate ethical and responsible use of learner data.

Features:

Learner Management
Add learner records manually.
Upload learner data using CSV files.
View learner information.
Edit learner records.
Delete learner records.

Dashboard Analytics:

Learner summary statistics.
Risk distribution analysis.
Learners by province analysis.
Device access analysis.
Data quality monitoring.

AI Features:

AI-generated learner insights.
AI recommendations.
AI support advice.
Risk explanations.

Reporting:

PDF report generation.
CSV export functionality.
Dashboard filtering.
Ethics & Privacy
Ethics and Privacy page.
Responsible AI considerations.
Human oversight guidance.
Privacy notice.

Technology Stack:

Frontend
React
Tailwind CSS
React Router DOM
Axios
Recharts
React Hot Toast

Backend:

ASP.NET Core Web API (.NET 8)
Entity Framework Core

Database:

SQL Server

Additional Libraries:

PapaParse
jsPDF

System Architecture:

The application follows a three-layer architecture:

User

↓

React Frontend

↓

ASP.NET Core Web API

↓

SQL Server Database

↓

Analytics Engine

↓

Charts, Insights, Recommendations & Reports

The frontend communicates with the backend through REST API endpoints, while SQL Server stores learner records and analytics data.

Installation:

Frontend Setup

Navigate to the frontend folder:

cd frontend

Install dependencies:

npm install

Run the application:

npm run dev

Frontend runs on:

http://localhost:5173


Backend Setup:

Navigate to the backend folder:

cd backend


Restore packages:

dotnet restore


Run the API:

dotnet run

Backend runs on:

http://localhost:5007/swagger




Apply migrations:

dotnet ef database update

API Endpoints:

Learners

Get All Learners

GET /api/learners

Get Learner By ID

GET /api/learners/{id}

Add Learner

POST /api/learners

Update Learner

PUT /api/learners/{id}

Delete Learner

DELETE /api/learners/{id}


Dashboard Analytics

The dashboard provides:

Learner counts
Risk distribution
Province analysis
Device access analysis
Data quality monitoring
AI insights
AI recommendations
AI support advice

Dashboard data can be filtered using:

Learner ID
Province
Risk Level
Validation Rules

The system validates:

Required fields
Confidence score ranges (1–5)
CSV uploads
Missing values
Duplicate learner checks

These validations improve data quality and reporting accuracy.

Testing

The following functionality was tested:

Add learner
Edit learner
Delete learner
CSV upload
Dashboard filters
Search functionality
PDF export
Validation handling

All core functionality passed testing successfully.

Future Improvements

Potential future enhancements include:

User authentication and authorisation
Role-based access control
Real AI model integration
Predictive learner analytics
Email notifications
Cloud deployment
Mobile application support
Advanced reporting features
Real-time dashboard updates
Ethics and Responsible AI

The project uses synthetic learner data to minimise privacy risks.

The system was designed to:

Promote responsible AI usage.
Maintain transparency.
Support human decision-making.
Avoid harmful automation.
Protect learner privacy.

AI-generated recommendations should always be reviewed by programme staff before action is taken.

Repository Structure
frontend/
backend/
report/
evidence/
dataset/
README.md
Author

Justice Mabuza

AI-Enabled Student Support Insights Dashboard

Future Innovation Lab – AI Internship Programme

2026