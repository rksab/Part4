# 📝 BlogApp Backend – Node.js, MongoDB, JWT

A RESTful API backend for a blogging platform built with **Node.js**, **Express**, and **MongoDB**, supporting user authentication and protected blog operations.

---

## 🔧 Key Features

- **User authentication** using JSON Web Tokens (JWT)
- **Token-based authorization** for creating, deleting, and updating blogs
- Full **CRUD operations** for blog posts with Mongoose models
- Middleware for centralized **error handling** and **request logging**
- Extensive **test suite** using Node’s native test runner and `supertest`
  - Covers authentication, validation, CRUD operations, and failure cases
- Blog data is associated with users and **populated for client display**


## 📦 Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT, bcrypt
- **Testing:** Supertest, Node:test
- **Linting:** ESLint
