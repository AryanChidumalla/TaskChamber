# 🚀 TaskChamber

> A modern, minimalist full-stack project and task management workspace built with **React 19**, **Tailwind CSS v4**, **Node.js / Express**, and **MongoDB**.

![TaskChamber Preview](https://via.placeholder.com/1200x630/090d16/ffffff?text=TaskChamber+Workspace)

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
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose 9](https://mongoosejs.com/)
- **Authentication**: `jsonwebtoken` (JWT) + `bcryptjs`
- **Security**: CORS, JSON payload validation, and custom JWT auth middleware

---

## 📁 Project Structure

```bash
TaskChamber/
├── client/                     # Frontend application (React + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── CreateProjectModal.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── ProjectSidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskListView.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   ├── ThemeSelector.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/            # Global context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/              # Route views
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/           # API interaction layer
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── projectService.js
│   │   │   ├── sectionService.js
│   │   │   └── taskService.js
│   │   ├── App.jsx             # Main router
│   │   ├── index.css           # Global stylesheet & CSS variables
│   │   └── main.jsx            # Entry point
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend API (Express + Node)
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT authentication verification
│   ├── models/                 # Mongoose database models
│   │   ├── Project.js
│   │   ├── Section.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/                 # API route handlers
│   │   ├── auth.js             # /api/auth
│   │   ├── projects.js         # /api/projects
│   │   ├── sections.js         # /api/sections
│   │   └── tasks.js            # /api/tasks
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express server entry point
│
├── .gitignore                  # Root Git ignore rules
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster connection string)
- `npm` or `pnpm` / `yarn`

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/TaskChamber.git
cd TaskChamber
```

---

### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and provide your credentials:
   ```bash
   cp .env.example .env
   ```
   *Example `.env`:*
   ```env
   PORT=5000
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskchamber"
   JWT_SECRET="your_secure_random_jwt_secret_here"
   ```

4. Start the server:
   ```bash
   # Production mode
   npm start

   # Development mode (with nodemon)
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

---

### 3. Frontend Setup
1. In a new terminal, navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Example `.env`:*
   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser and visit `http://localhost:5173`.

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

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**. See `LICENSE` for more information.
