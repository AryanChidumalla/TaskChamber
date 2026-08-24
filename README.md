# 🚀 TaskChamber

> A modern, minimalist full-stack project and task management workspace built with **React 19**, **Tailwind CSS v4**, **Node.js / Express**, and **MongoDB**.

---

## ✨ Features

- 🌓 **Dynamic Theming System**:
  - Instant toggle between **Dark Mode** (deep slate/zinc modern aesthetic) and **Light Mode** (clean paper-white and slate).
  - **7 Theme Accent Palettes**: *Sky Blue*, *Monochrome (Black & White)*, *Classic Indigo*, *Emerald Green*, *Royal Violet*, *Crimson Rose*, and *Golden Amber*.
  - Persistent user preference storage via `localStorage`.

- 📋 **Interactive Kanban Board**:
  - Native HTML5 Drag & Drop: Drag task cards smoothly between columns with real-time dropzone indicators and persistent updates.
  - Custom column/stage creation (e.g. *To Do*, *In Progress*, *QA Review*, *Done*).
  - Inline column renaming and deletion with confirmation.

- 📊 **Dual Views**:
  - **Kanban Board View**: Visual cards grouped by workflow stages.
  - **List View**: Clean, compact table view for rapid task scanning and inline status management.

- 🔍 **Real-Time Search & Filters**:
  - Instant multi-field search across task titles and descriptions.
  - Filter by priority (*All, Urgent, High, Medium, Low*).

- ⚡ **Task Management**:
  - Rich task modal supporting priorities, due dates with overdue warnings, and descriptions.
  - Direct checkbox to mark tasks as completed with strikethrough animation.
  - Quick action menu to move tasks directly to any column on touch or mobile devices.

- 📁 **Multi-Workspace / Project Support**:
  - Create multiple isolated projects with custom color tags.
  - Automatic creation of default workflow stages (*To Do*, *In Progress*, *Completed*).
  - Cascading deletion for projects, sections, and tasks.

- 🔒 **Secure Authentication**:
  - Full user registration and login with JWT (JSON Web Tokens) and bcrypt password hashing.
  - Protected routes and persistent authentication session restore.

- 🎨 **Phosphor Icon Pack**:
  - Integrated `@phosphor-icons/react` for crisp, unified iconography across all views, controls, and dialogs.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/) (`@phosphor-icons/react`)
- **State & Theming**: Custom Context API (`AuthContext`, `ThemeContext`)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/) (Serverless-ready on Vercel)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose 9](https://mongoosejs.com/)
- **Authentication**: `jsonwebtoken` (JWT) + `bcryptjs`
- **Security**: CORS headers, JSON payload validation, and custom JWT auth middleware

---

## 🚀 Deployment Guide (Vercel)

TaskChamber can be deployed on Vercel as two separate projects (one for `server` and one for `client`).

### 1. Deploy the Backend (`/server`)
1. Import your GitHub repository into Vercel.
2. In the project configuration:
   - **Root Directory**: `server`
   - **Framework Preset**: `Other`
3. Add the following **Environment Variables** in Vercel:
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskchamber`
   - `JWT_SECRET`: `your_secure_random_jwt_secret_key`
4. Deploy! Your backend URL will look like: `https://your-backend.vercel.app`.

> [!IMPORTANT]
> **MongoDB Atlas Network Access**:
> In your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/):
> Go to **Network Access** → **IP Access List** → Click **Add IP Address** → Choose **Allow Access from Anywhere (`0.0.0.0/0`)**.
> Since Vercel uses dynamic serverless IP addresses, this is required so your backend can connect to MongoDB.

---

### 2. Deploy the Frontend (`/client`)
1. Import the same GitHub repository into Vercel as a new project.
2. In the project configuration:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
3. Add the following **Environment Variable** in Vercel:
   - `VITE_API_URL`: `https://your-backend.vercel.app` (or `https://your-backend.vercel.app/api`)
4. Deploy! Your frontend URL will look like: `https://your-frontend.vercel.app`.

---

## 💻 Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/your-username/TaskChamber.git
cd TaskChamber
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT_SECRET
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

Visit `http://localhost:5173`.

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login user & return JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |

### Projects (`/api/projects`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/projects` | Fetch all projects for the logged-in user | Yes |
| `POST` | `/api/projects` | Create a new project (auto-creates 3 default sections) | Yes |
| `GET` | `/api/projects/:projectId` | Fetch single project details and its sections | Yes |
| `PATCH` | `/api/projects/:projectId` | Update project name, description, or color | Yes |
| `DELETE` | `/api/projects/:projectId` | Delete project and cascade-delete its sections & tasks | Yes |

### Sections / Workflow Columns (`/api/sections`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/sections/project/:projectId` | Get all sections for a project | Yes |
| `POST` | `/api/sections/project/:projectId` | Create a new workflow section in a project | Yes |
| `PATCH` | `/api/sections/:sectionId` | Rename a section or change position | Yes |
| `DELETE` | `/api/sections/:sectionId` | Delete section and all tasks within it | Yes |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/tasks/project/:projectId` | Fetch all tasks for a project | Yes |
| `POST` | `/api/tasks/project/:projectId` | Create a new task in a project/section | Yes |
| `PATCH` | `/api/tasks/:taskId` | Update task title, description, priority, due date, completed | Yes |
| `PATCH` | `/api/tasks/:taskId/move` | Move task to a different section and/or position | Yes |
| `DELETE` | `/api/tasks/:taskId` | Delete a task | Yes |

---

## 📄 License

Distributed under the **ISC License**.
