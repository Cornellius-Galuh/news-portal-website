# Database Design Document

## Project: Portal Berita dan Forum Diskusi

---

# 1. Overview

Database yang digunakan pada project ini adalah **MongoDB** dengan ODM **Mongoose**.

Database dirancang untuk mendukung:

* Authentication & Authorization
* Article Management
* Discussion Forum
* Role Management
* Category Management
* Analytics & Trending

---

# 2. Collections

The project uses the following collections:

```text
users
author_requests
articles
categories
comments
comment_reports
article_likes
article_views
```

Optional:

```text
notifications
article_versions
```

---

# 3. Users Collection

Collection Name:

```text
users
```

Schema:

```ts
{
  _id: ObjectId,

  username: String,
  email: String,
  password: String,

  role: String,

  avatar: String,

  bio: String,

  socialLinks: [
    {
        platform: String,
        url: String
    }
  ],

  isDeleted: Boolean,
  deletedAt: Date,

  joinedAt: Date,
  updatedAt: Date
}
```

Indexes:

```text
username (unique)
email (unique)
role
```

Enum:

```text
USER
AUTHOR
ADMIN
```

---

# 4. Author Requests Collection

Collection Name:

```text
author_requests
```

Schema:

```ts
{
  _id: ObjectId,

  userId: ObjectId,

  reason: String,

  status: String,

  reviewedBy: ObjectId,

  reviewedAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

Indexes:

```text
userId
status
```

Enum:

```text
PENDING
APPROVED
REJECTED
```

---

# 5. Categories Collection

Collection Name:

```text
categories
```

Schema:

```ts
{
  _id: ObjectId,

  name: String,

  slug: String,

  description: String,

  createdAt: Date,
  updatedAt: Date
}
```

Indexes:

```text
name (unique)
slug (unique)
```

---

# 6. Articles Collection

Collection Name:

```text
articles
```

Schema:

```ts
{
  _id: ObjectId,

  title: String,

  slug: String,

  excerpt: String,

  content: String,

  authorId: ObjectId,

  categories: [ObjectId],

  coverImage: String,

  images: [String],

  seo: {
    metaTitle: String,
    metaDescription: String
  },

  viewCount: Number,

  likeCount: Number,

  status: String,

  publishedAt: Date,

  archivedAt: Date,

  isDeleted: Boolean,
  deletedAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

Indexes:

```text
slug (unique)
authorId
status
categories
publishedAt
viewCount
likeCount
```

Enum:

```text
DRAFT
PUBLISHED
ARCHIVED
```

---

# 7. Article Likes Collection

Collection Name:

```text
article_likes
```

Schema:

```ts
{
  _id: ObjectId,

  articleId: ObjectId,

  userId: ObjectId,

  createdAt: Date
}
```

Indexes:

```text
articleId
userId
articleId + userId (unique)
```

---

# 8. Article Views Collection

Collection Name:

```text
article_views
```

Schema:

```ts
{
  _id: ObjectId,

  articleId: ObjectId,

  userId: ObjectId,

  ipAddress: String,

  viewedAt: Date
}
```

Indexes:

```text
articleId
userId
viewedAt
```

Purpose:

* Prevent view spam.
* Calculate trending articles.
* Support future analytics.

---

# 9. Comments Collection

Collection Name:

```text
comments
```

Schema:

```ts
{
  _id: ObjectId,

  articleId: ObjectId,

  userId: ObjectId,

  parentCommentId: ObjectId,

  content: String,

  isDeleted: Boolean,
  deletedAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

Indexes:

```text
articleId
userId
parentCommentId
createdAt
```

Pattern:

```text
Adjacency List Pattern
```

This allows unlimited nested replies.

---

# 10. Comment Reports Collection

Collection Name:

```text
comment_reports
```

Schema:

```ts
{
  _id: ObjectId,

  commentId: ObjectId,

  reportedBy: ObjectId,

  reason: String,

  status: String,

  reviewedBy: ObjectId,

  reviewedAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

Indexes:

```text
commentId
reportedBy
status
```

Enum:

```text
PENDING
RESOLVED
IGNORED
```

---

# 11. Collection Relationships

```text
User
│
├──< AuthorRequest
├──< Article
├──< Comment
├──< ArticleLike
└──< ArticleView

Article
│
├──<> Category
├──< Comment
├──< ArticleLike
└──< ArticleView

Comment
│
└──< Comment (Nested Reply)

Comment
│
└──< CommentReport
```

---

# 12. Article Workflow

```text
DRAFT
↓
PUBLISHED
↓
ARCHIVED
```

Published articles cannot be edited directly.

Workflow:

```text
PUBLISHED
↓
ARCHIVED
↓
EDIT
↓
PUBLISHED
```

---

# 13. Soft Delete Strategy

Entities using soft delete:

```text
users
articles
comments
```

Fields:

```ts
{
  isDeleted: Boolean,
  deletedAt: Date
}
```

Deleted users should appear as:

```text
Deleted User
```

Their articles and comments remain in the system.

---

# 14. Trending Algorithm

Trending Score:

```text
Trending Score =
(70% × View Count)
+
(30% × Like Count)
```

This score is used to determine trending articles.

---

# 15. Recommended Indexes

Users:

* username
* email

Articles:

* slug
* status
* authorId
* categories
* publishedAt

Comments:

* articleId
* parentCommentId

Likes:

* articleId + userId

Reports:

* status

Views:

* articleId
* viewedAt

---

# 16. Future Improvements

Optional collections:

## notifications

```ts
{
  _id,
  userId,
  title,
  message,
  isRead,
  createdAt
}
```

## article_versions

```ts
{
  _id,
  articleId,
  version,
  content,
  createdAt
}
```

These collections are not required for the MVP but may be implemented in future iterations.
