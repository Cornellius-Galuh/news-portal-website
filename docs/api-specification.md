# API Specification Document

## Project: Portal Berita dan Forum Diskusi

Base URL:

```text
/api/v1
```

Response Format:

Success

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Error",
  "errors": []
}
```

Pagination Format:

```text
?page=1&limit=10
```

---

# Authentication Module

## Register

POST `/auth/register`

Request:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## Login

POST `/auth/login`

Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "",
    "user": {}
  }
}
```

---

## Logout

POST `/auth/logout`

Authorization:

```text
Bearer Token
```

---

## Get Current User

GET `/auth/me`

Authorization:

```text
Bearer Token
```

---

# User Module

## Get User Profile

GET `/users/:id`

---

## Update Profile

PATCH `/users/profile`

Authorization:

```text
Bearer Token
```

Content-Type:

```text
multipart/form-data
```

Fields:

```text
username
bio
avatar
socialLinks
```

---

## Become Author Request

POST `/users/become-author`

Authorization:

```text
Bearer Token
```

Request:

```json
{
  "reason": "I want to contribute articles."
}
```

---

# Admin User Management

## Get Users

GET `/users`

Query:

```text
?page=1&limit=10
&sort=createdAt
&order=desc
&q=
&role=
```

---

## Get User Detail

GET `/users/:id`

---

## Update User Role

PATCH `/users/:id/role`

Request:

```json
{
  "role": "AUTHOR"
}
```

---

## Soft Delete User

DELETE `/users/:id`

---

# Author Request Module

## Get Author Requests

GET `/author-requests`

---

## Approve Author Request

PATCH `/author-requests/:id/approve`

---

## Reject Author Request

PATCH `/author-requests/:id/reject`

---

# Category Module

## Get Categories

GET `/categories`

Query:

```text
?page=1&limit=10&q=
```

---

## Get Category Detail

GET `/categories/:slug`

---

## Create Category

POST `/categories`

Request:

```json
{
  "name": "Technology",
  "description": "Technology news"
}
```

---

## Update Category

PATCH `/categories/:id`

---

## Delete Category

DELETE `/categories/:id`

Business Rule:

Category cannot be deleted if it is still used by articles.

---

# Article Module

## Get Articles

GET `/articles`

Query:

```text
?page=1
&limit=10
&q=
&category=
&author=
&status=
&sort=publishedAt
&order=desc
```

---

## Get Trending Articles

GET `/articles/trending`

---

## Get Latest Articles

GET `/articles/latest`

---

## Get Article Detail

GET `/articles/:slug`

---

## Create Article

POST `/articles`

Authorization:

```text
Bearer Token
```

Content-Type:

```text
multipart/form-data
```

Fields:

```text
title
excerpt
content
categories[]
coverImage
images[]
metaTitle
metaDescription
status
```

Status:

```text
DRAFT
PUBLISHED
```

---

## Update Draft Article

PATCH `/articles/:id`

Business Rule:

Only draft articles can be edited.

---

## Publish Article

PATCH `/articles/:id/publish`

---

## Archive Article

PATCH `/articles/:id/archive`

---

## Delete Article

DELETE `/articles/:id`

Soft Delete.

---

# Like Module

## Like Article

POST `/articles/:id/like`

---

## Unlike Article

DELETE `/articles/:id/like`

---

## Get Article Likes

GET `/articles/:id/likes`

---

# Comment Module

## Get Article Comments

GET `/articles/:id/comments`

Query:

```text
?page=1&limit=20
```

---

## Create Comment

POST `/articles/:id/comments`

Request:

```json
{
  "content": "Nice article!"
}
```

---

## Reply Comment

POST `/comments/:id/reply`

Request:

```json
{
  "content": "I agree."
}
```

---

## Update Comment

PATCH `/comments/:id`

Business Rule:

Only comment owner can edit.

---

## Delete Comment

DELETE `/comments/:id`

Soft Delete.

---

# Comment Report Module

## Report Comment

POST `/comments/:id/report`

Request:

```json
{
  "reason": "Spam"
}
```

---

## Get Reports

GET `/comment-reports`

Admin only.

---

## Resolve Report

PATCH `/comment-reports/:id/resolve`

---

## Ignore Report

PATCH `/comment-reports/:id/ignore`

---

# Dashboard Module

## User Dashboard Statistics

GET `/dashboard/user`

Response:

```json
{
  "articles": 0,
  "drafts": 0,
  "archived": 0,
  "views": 0
}
```

---

## Admin Dashboard Statistics

GET `/dashboard/admin`

Response:

```json
{
  "totalUsers": 0,
  "totalAuthors": 0,
  "totalArticles": 0,
  "totalCategories": 0,
  "totalComments": 0,
  "popularArticles": []
}
```

---

# Media Module

## Upload Image

POST `/media/upload`

Content-Type:

```text
multipart/form-data
```

---

## Delete Image

DELETE `/media/:filename`

---

# Search Module

## Global Search

GET `/search`

Query:

```text
?q=
&type=
&page=1
&limit=10
```

Types:

```text
article
author
category
```
# Health and Documentation

## Health Check

GET `/health`

## Documentation

GET /api-docs

# Authorization Matrix

| Endpoint          | Guest | User | Author | Admin |
| ----------------- | ----- | ---- | ------ | ----- |
| Read Articles     | ✅     | ✅    | ✅      | ✅     |
| Comment           | ❌     | ✅    | ✅      | ✅     |
| Create Article    | ❌     | ❌    | ✅      | ✅     |
| Manage Categories | ❌     | ❌    | ❌      | ✅     |
| Moderate Comments | ❌     | ❌    | ❌      | ✅     |
| Manage Users      | ❌     | ❌    | ❌      | ✅     |
| Approve Author    | ❌     | ❌    | ❌      | ✅     |

---

# HTTP Status Codes

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
500 Internal Server Error
```

---

# Error Format Example

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```
