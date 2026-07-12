# Task Breakdown Document

## Project: Portal Berita dan Forum Diskusi

---

# Development Methodology

* Iterative & Incremental Development
* Agile + Kanban
* Feature-based development
* One module at a time

---

# Project Milestones

```text id="yjlwm1"
Sprint 0 - Project Setup
Sprint 1 - Authentication & User Management
Sprint 2 - Category Module
Sprint 3 - Article Module
Sprint 4 - Comment Module
Sprint 5 - Like Module
Sprint 6 - Dashboard Module
Sprint 7 - Security & Finalization
Sprint 8 - Deployment
```

---

# Sprint 0 – Project Setup

## Backend Setup

### TASK-001

Initialize Node.js + Express + TypeScript project.

### TASK-002

Configure TypeScript.

### TASK-003

Configure ESLint.

### TASK-004

Configure Prettier.

### TASK-005

Configure Environment Variables.

### TASK-006

Setup MongoDB Connection.

### TASK-007

Create Folder Structure.

### TASK-008

Setup Logger.

### TASK-009

Create Global Error Handler.

### TASK-010

Create API Response Helper.

### TASK-011

Setup Swagger Documentation.

### TASK-012

Create Health Check Endpoint.

---

## Frontend Setup

### TASK-013

Initialize React + TypeScript.

### TASK-014

Install TailwindCSS.

### TASK-015

Setup React Router.

### TASK-016

Setup Zustand.

### TASK-017

Setup Axios.

### TASK-018

Create Folder Structure.

### TASK-019

Create Layout System.

### TASK-020

Create Route Guards.

### TASK-021

Create Reusable UI Components.

---

# Sprint 1 – Authentication & User Management

## Database

### TASK-022

Create User Model.

### TASK-023

Create Author Request Model.

---

## Backend

### TASK-024

Implement Register API.

### TASK-025

Implement Login API.

### TASK-026

Implement Logout API.

### TASK-027

Implement Get Current User API.

### TASK-028

Implement JWT Middleware.

### TASK-029

Implement Role Middleware.

### TASK-030

Implement User Profile API.

### TASK-031

Implement Update Profile API.

### TASK-032

Implement Upload Avatar API.

### TASK-033

Implement Become Author Request API.

### TASK-034

Implement Approve Author Request API.

### TASK-035

Implement Reject Author Request API.

---

## Frontend

### TASK-036

Create Login Page.

### TASK-037

Create Register Page.

### TASK-038

Create Zustand Auth Store.

### TASK-039

Create Authentication Services.

### TASK-040

Create Protected Routes.

### TASK-041

Create Profile Page.

### TASK-042

Create Profile Settings Page.

### TASK-043

Create Become Author Page.

---

# Sprint 2 – Category Module

## Database

### TASK-044

Create Category Model.

---

## Backend

### TASK-045

Create Get Categories API.

### TASK-046

Create Get Category Detail API.

### TASK-047

Create Create Category API.

### TASK-048

Create Update Category API.

### TASK-049

Create Delete Category API.

---

## Frontend

### TASK-050

Create Category Page.

### TASK-051

Create Category Management Page.

### TASK-052

Create Category Services.

---

# Sprint 3 – Article Module

## Database

### TASK-053

Create Article Model.

### TASK-054

Create Article View Model.

### TASK-055

Create Article Like Model.

---

## Backend

### TASK-056

Create Article CRUD APIs.

### TASK-057

Implement Slug Generation.

### TASK-058

Implement Search API.

### TASK-059

Implement Filtering API.

### TASK-060

Implement Pagination API.

### TASK-061

Implement Upload Cover Image.

### TASK-062

Implement Multiple Image Upload.

### TASK-063

Implement Publish Article API.

### TASK-064

Implement Archive Article API.

### TASK-065

Implement Trending API.

### TASK-066

Implement Latest Article API.

### TASK-067

Implement View Counter.

---

## Frontend

### TASK-068

Create Article Editor.

### TASK-069

Integrate Tiptap Editor.

### TASK-070

Create Create Article Page.

### TASK-071

Create Draft Management Page.

### TASK-072

Create Archived Articles Page.

### TASK-073

Create Article Detail Page.

### TASK-074

Create Article Card Component.

### TASK-075

Create Search Page.

### TASK-076

Create Trending Page.

### TASK-077

Create Article Services.

---

# Sprint 4 – Comment Module

## Database

### TASK-078

Create Comment Model.

### TASK-079

Create Comment Report Model.

---

## Backend

### TASK-080

Implement Create Comment API.

### TASK-081

Implement Nested Reply API.

### TASK-082

Implement Update Comment API.

### TASK-083

Implement Soft Delete Comment API.

### TASK-084

Implement Report Comment API.

### TASK-085

Implement Comment Moderation APIs.

---

## Frontend

### TASK-086

Create Comment Section.

### TASK-087

Create Nested Reply Component.

### TASK-088

Create Comment Form.

### TASK-089

Create Report Comment Modal.

### TASK-090

Create Comment Services.

---

# Sprint 5 – Like Module

## Backend

### TASK-091

Implement Like Article API.

### TASK-092

Implement Unlike Article API.

### TASK-093

Implement Get Like Count API.

---

## Frontend

### TASK-094

Create Like Button Component.

### TASK-095

Create Like Service.

---

# Sprint 6 – Dashboard Module

## User Dashboard

### TASK-096

Create Dashboard Home.

### TASK-097

Create My Articles Page.

### TASK-098

Create User Analytics Page.

### TASK-099

Create Draft Articles Page.

### TASK-100

Create Archived Articles Page.

---

## Admin Dashboard

### TASK-101

Create Admin Dashboard Home.

### TASK-102

Create User Management Page.

### TASK-103

Create Author Request Management Page.

### TASK-104

Create Article Management Page.

### TASK-105

Create Category Management Page.

### TASK-106

Create Comment Moderation Page.

### TASK-107

Create Statistics Page.

### TASK-108

Create Media Management Page.

### TASK-109

Create Website Settings Page.

---

# Sprint 7 – Security & Finalization

## Security

### TASK-110

Implement Helmet.

### TASK-111

Implement CORS.

### TASK-112

Implement Rate Limiting.

### TASK-113

Implement Input Validation.

### TASK-114

Implement NoSQL Injection Protection.

### TASK-115

Implement XSS Protection.

---

## Performance

### TASK-116

Implement Pagination Optimization.

### TASK-117

Implement Query Optimization.

### TASK-118

Implement Lazy Loading.

### TASK-119

Implement Image Optimization.

---

## Quality

### TASK-120

Write API Documentation.

### TASK-121

Write Project Documentation.

### TASK-122

Code Refactoring.

### TASK-123

Bug Fixing.

---

# Sprint 8 – Deployment

### TASK-124

Create Dockerfile for Backend.

### TASK-125

Create Dockerfile for Frontend.

### TASK-126

Create Docker Compose.

### TASK-127

Configure Production Environment Variables.

### TASK-128

Build Production Version.

### TASK-129

Perform Deployment Testing.

### TASK-130

Prepare Final Release.

---

# Suggested Development Order

```text id="vjlwm2"
1. Project Setup
2. Authentication
3. Categories
4. Articles
5. Comments
6. Likes
7. Dashboard
8. Security
9. Deployment
```

---

# Recommended Antigravity Workflow

For every task:

1. Analyze requirements.
2. Explain implementation plan.
3. Explain affected files.
4. Generate code.
5. Explain testing steps.
6. Update documentation.
7. Commit changes.

Never implement more than one major module in a single prompt.

Prefer small, incremental changes over large code generation.
