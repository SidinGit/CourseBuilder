<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<h1 align="center">CourseBuilder API</h1>

<p align="center">
  <strong>AI-Powered Personalized Learning Platform Backend</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square&logo=node.js" alt="Node.js" /></a>
  <a href="#"><img src="https://img.shields.io/badge/NestJS-11.x-E0234E?style=flat-square&logo=nestjs" alt="NestJS" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Prisma-6.x-2D3748?style=flat-square&logo=prisma" alt="Prisma" /></a>
  <a href="#"><img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql" alt="PostgreSQL" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=flat-square&logo=swagger" alt="Swagger" /></a>
  <a href="#"><img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens" alt="JWT" /></a>
</p>

---

## 📖 Overview

CourseBuilder is an **AI-powered personalized learning platform** that generates custom courses for users based on their learning goals. Unlike traditional platforms, each course is dynamically generated and unique to the user, curating existing YouTube educational content into a structured curriculum.

### ✨ Key Features

- 🎯 **Personalized Courses** - AI-generated curricula based on user prompts
- 📚 **Milestone-Based Learning** - Courses structured into chapters (milestones) for achievement tracking
- 🎬 **YouTube Integration** - Curates existing educational videos
- 📊 **Progress Tracking** - Track watch time and completion per lesson
- 🔐 **JWT Authentication** - Secure user registration and login
- 📝 **Swagger Documentation** - Interactive API docs

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [NestJS](https://nestjs.com/) v11 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) v5 |
| **ORM** | [Prisma](https://www.prisma.io/) v6 |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) |
| **Authentication** | JWT with Passport.js |
| **API Docs** | Swagger/OpenAPI |
| **Package Manager** | [pnpm](https://pnpm.io/) |

---

## 📁 Project Structure

```
apps/api/
├── prisma/
│   ├── schema/              # Multi-file Prisma schema
│   │   ├── _base.prisma     # Datasource & generator config
│   │   ├── user.prisma      # User model
│   │   ├── course.prisma    # Course model
│   │   ├── milestone.prisma # Milestone model
│   │   └── lesson.prisma    # Lesson model
│   └── migrations/          # Database migrations
├── src/
│   ├── auth/                # Authentication module
│   │   ├── dto/             # Login & Register DTOs
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── prisma/              # Prisma module (global)
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── user/                # User module
│   │   ├── dto/
│   │   ├── user.controller.ts
│   │   ├── user.module.ts
│   │   └── user.service.ts
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
├── prisma.config.ts         # Prisma 6 configuration
└── package.json
```

---

## 🗄️ Database Schema

```
User (learner)
 └── Course (AI-generated curriculum)
      └── Milestone (chapter/achievement marker)
           └── Lesson (YouTube video + watch progress)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database (or [Neon](https://neon.tech/) account)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, JWT_EXPIRATION
```

### Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### Running the Application

```bash
# Development (watch mode)
pnpm run start:dev

# Production build
pnpm run build
pnpm run start:prod
```

The API will be available at `http://localhost:3001`

---

## 📚 API Documentation

### Swagger UI

Access interactive API documentation at:
```
http://localhost:3001/api/docs
```

### Import to Postman

1. Open Postman → Import
2. Paste URL: `http://localhost:3001/api/docs-json`
3. All endpoints imported with request bodies!

---

## 📡 API Endpoints

### Auth Module

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and get JWT token |

### User Module

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/user` | Get all users |
| `GET` | `/user/:id` | Get user by ID |
| `POST` | `/user` | Create a new user |
| `PATCH` | `/user/:id` | Update a user |
| `DELETE` | `/user/:id` | Delete a user |

### Coming Soon

- 📚 **Course Module** - CRUD for courses
- 🎯 **Milestone Module** - CRUD for milestones
- 🎬 **Lesson Module** - CRUD for lessons with progress tracking
- 🛡️ **Auth Guards** - Protect routes with JWT

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `JWT_EXPIRATION` | Token expiration time | `7d` |

---

## 🛣️ Roadmap

- [x] Project setup with NestJS + Prisma
- [x] Database schema design (User, Course, Milestone, Lesson)
- [x] User CRUD module
- [x] JWT Authentication (Register/Login)
- [x] Swagger API documentation
- [ ] Auth Guards for protected routes
- [ ] Error handling improvements
- [ ] Course CRUD module
- [ ] Milestone & Lesson modules
- [ ] YouTube API integration
- [ ] AI course generation

---

## 📄 License

This project is [MIT licensed](LICENSE).

---

<p align="center">
  <sub>Built with ❤️ using NestJS</sub>
</p>
