# Claude Context - News Portal and Discussion Forum

## Project Overview

Project Name: Portal Berita dan Forum Diskusi

This project is a modern news portal website with a discussion forum feature. The application allows users to read articles, interact through comments and replies, create and publish articles, and manage content through role-based dashboards.

This project is intended as a university project and will initially be developed and run locally.

Reference Website:
https://pontianakupdate.com/

---

# Technology Stack

## Frontend

* React
* TypeScript
* React Router
* Zustand
* TailwindCSS
* Axios

## Backend

* Node.js
* Express.js
* TypeScript

## Database

* MongoDB
* Mongoose

## Authentication

* JWT
* bcrypt

## File Upload

* Multer
* Local Storage

## API Style

* REST API

## Deployment

* Docker will be implemented later during deployment stage.

---

# Architecture

## Backend Architecture

The backend MUST follow Layered Architecture.

Flow:

Route
→ Controller
→ Service
→ Repository
→ Model
→ MongoDB

Responsibilities:

### Routes

Define API endpoints and middleware.

### Controllers

Handle request and response only.
Controllers must not contain business logic.

### Services

Contain all business logic.

### Repositories

Handle database access and queries.

### Models

Contain Mongoose schemas.

---

## Frontend Architecture

Frontend uses Feature-Based Architecture.

Flow:

Page
→ Feature
→ Component
→ Service(API)
→ Backend

---

# Project Structure

## Root

news-portal/
├── frontend/
├── backend/
├── docs/
└── docker/

---

## Frontend Structure

frontend/
├── public/
├── src/
│
├── app/
│   ├── router/
│   └── providers/
│
├── assets/
├── components/
│   ├── ui/
│   ├── common/
│   └── layouts/
│
├── features/
│   ├── auth/
│   ├── articles/
│   ├── comments/
│   ├── categories/
│   ├── dashboard/
│   ├── profile/
│   └── search/
│
├── pages/
├── services/
├── store/
├── hooks/
├── contexts/
├── types/
├── utils/
├── constants/
└── styles/

---

## Backend Structure

backend/
├── src/
│
├── config/
├── routes/
├── controllers/
├── services/
├── repositories/
├── models/
├── middlewares/
├── validators/
├── interfaces/
├── types/
├── utils/
├── constants/
│
├── uploads/
│   ├── articles/
│   └── profiles/
│
└── app.ts

---

# User Roles

## Guest

Can:

* Read articles
* Search articles
* View comments
* View trending articles

Cannot:

* Like articles
* Comment
* Report comments
* Create articles

---

## User

Can:

* All Guest permissions
* Like and unlike articles
* Comment
* Nested replies
* Report comments
* Share articles
* Request to become Author

---

## Author

Can:

* All User permissions
* Create articles
* Manage draft articles
* Publish articles
* Archive articles
* Upload images
* Manage own articles

Restrictions:

* Cannot directly edit published articles.
* Published articles must be archived first before editing.

---

## Admin

Can:

* Full system access
* Manage users
* Manage articles
* Manage categories
* Moderate comments
* Approve author requests
* Manage website settings
* View statistics

---

# Core Modules

## Authentication

* Register
* Login
* Logout
* JWT Authentication
* Profile Management
* Request Become Author

---

## Articles

* Create Article
* Read Article
* Update Draft
* Archive Article
* Publish Article
* Delete Article
* Search Article
* Filter Article
* Trending Article
* Multiple Categories
* Multiple Images
* Cover Image
* SEO Metadata
* View Count
* Like Count

---

## Categories

* CRUD Categories
* Search Categories
* Pagination

---

## Comments

* Comment
* Unlimited Nested Reply
* Soft Delete
* Report Comment
* Emoji Reactions

---

## Dashboard

### User Dashboard

* My Articles
* Draft Articles
* Archived Articles
* Analytics
* Profile Settings

### Admin Dashboard

* User Management
* Article Management
* Category Management
* Author Requests
* Comment Moderation
* Statistics
* Media Management
* Website Settings

---

# Article Status Flow

Draft
→ Published
→ Archived

Published articles cannot be edited directly.

Workflow:

Published
→ Archive
→ Edit
→ Publish Again

---

# Database Collections

* users
* author_requests
* articles
* categories
* comments
* comment_reports
* article_likes
* article_views

Optional:

* notifications
* article_versions

---

# API Conventions

Base URL:

/api/v1

Pagination:

?page=1&limit=10

Search:

/articles?q=keyword

Image Upload:

multipart/form-data

All list endpoints should support:

* pagination
* sorting
* filtering
* searching

---

# API Response Standard

Success:

{
"success": true,
"message": "Success",
"data": {}
}

Error:

{
"success": false,
"message": "Error",
"errors": []
}

---

# Naming Conventions

Files:

* kebab-case

Components:

* PascalCase

Functions:

* camelCase

Constants:

* UPPER_SNAKE_CASE

---

# Development Rules

1. Use TypeScript everywhere.
2. Use async/await only.
3. Never put business logic inside controllers.
4. Never access MongoDB directly from controllers.
5. Always use Service Layer.
6. Always validate request bodies.
7. Always sanitize user input.
8. Use reusable components.
9. Use reusable custom hooks.
10. Follow REST API conventions.
11. Use environment variables.
12. Use pagination.
13. Use soft delete where applicable.
14. Prefer composition over duplication.
15. Keep functions small and focused.
16. Follow SOLID principles whenever possible.
17. Write clean, maintainable, and production-ready code.

---

# Security Rules

Always implement:

* bcrypt password hashing
* JWT Authentication
* Role-based Authorization
* Helmet
* CORS
* Rate Limiting
* Input Validation
* NoSQL Injection Protection
* XSS Protection

---

# AI Workflow Instructions

Before implementing any feature:

1. Analyze requirements.
2. Explain implementation plan.
3. Explain affected files.
4. Explain database changes.
5. Generate code.
6. Explain testing steps.
7. Update documentation.

Never generate large amounts of code without first presenting an implementation plan.

Always implement one module at a time.

Prefer maintainability and readability over clever code.

Do not make assumptions when requirements are unclear. Ask questions first.

Always preserve project architecture and coding standards.
