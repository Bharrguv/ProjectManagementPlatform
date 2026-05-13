
A Node.js backend application for managing projects, tasks, and team collaboration. Built with Express.js, MongoDB, and JWT authentication.

## Features

- **User Authentication**: Register, login, email verification, password reset, JWT-based authentication
- **Project Management**: Create, update, delete projects; manage project members with roles (Admin, Project Admin, Member)
- **Task Management**: Create tasks within projects, update status (Todo, In Progress, Done), attach files, manage subtasks
- **Email Notifications**: Integrated email service for verification and notifications
- **File Uploads**: Support for attaching files to tasks
- **Role-Based Access Control**: Different permissions based on user roles

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer with Mailtrap
- **File Uploads**: Multer
- **Validation**: Express Validator
- **Password Hashing**: bcrypt
- **CORS**: Enabled for cross-origin requests

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd projectmanagementplatform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/projectmanagement
   CORS_ORIGIN=http://localhost:5173
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   MAILTRAP_SMTP_HOST=smtp.mailtrap.io
   MAILTRAP_SMTP_PORT=2525
   MAILTRAP_SMTP_USER=your_mailtrap_user
   MAILTRAP_SMTP_PASS=your_mailtrap_pass
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:8000`.

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/verify-email/:verificationToken` - Verify email
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/forgotPassword` - Request password reset
- `POST /api/v1/auth/reset-password/:resetToken` - Reset password
- `POST /api/v1/auth/current-user` - Get current user info
- `POST /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/resend-email-verification` - Resend verification email

### Projects
- `GET /api/v1/projects` - Get all projects for user
- `POST /api/v1/projects` - Create a new project
- `GET /api/v1/projects/:projectId` - Get project by ID
- `PUT /api/v1/projects/:projectId` - Update project
- `DELETE /api/v1/projects/:projectId` - Delete project
- `GET /api/v1/projects/:projectId/members` - Get project members
- `POST /api/v1/projects/:projectId/members` - Add members to project
- `PUT /api/v1/projects/:projectId/members/:memberId` - Update member role
- `DELETE /api/v1/projects/:projectId/members/:memberId` - Remove member

### Tasks
- `GET /api/v1/projects/:projectId/tasks` - Get tasks for project
- `POST /api/v1/projects/:projectId/tasks` - Create a new task
- `GET /api/v1/projects/:projectId/tasks/:taskId` - Get task by ID
- `PUT /api/v1/projects/:projectId/tasks/:taskId` - Update task
- `DELETE /api/v1/projects/:projectId/tasks/:taskId` - Delete task
- `PUT /api/v1/projects/:projectId/tasks/:taskId/subtasks/:subtaskId` - Update subtask
- `DELETE /api/v1/projects/:projectId/tasks/:taskId/subtasks/:subtaskId` - Delete subtask

### Health Check
- `GET /api/v1/healthcheck` - Health check endpoint

## Project Structure

```
src/
├── app.js                 # Express app setup
├── index.js               # Server entry point
├── controllers/           # Route handlers
├── db/                    # Database connection
├── middlewares/           # Custom middlewares (auth, validation, multer)
├── models/                # Mongoose models
├── routes/                # API routes
├── utils/                 # Utility functions (mail, constants, etc.)
└── validators/            # Input validation schemas
```




