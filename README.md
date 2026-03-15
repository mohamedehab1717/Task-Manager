#  Task Manager Pro - Full Stack Workspace

A modern, high-performance Full Stack Task Management application built with the MERN stack. Designed for productivity with a sleek "Glassmorphism" UI and robust project grouping.

##  Key Features

-   ** Secure Authentication**: JWT-based login and registration with hashed passwords.
-   ** Project Management**: Create, edit, and delete projects to group related tasks.
-   ** Task Tracking**: Manage tasks within projects with status (Pending, In Progress, Done) and priority (Low, Medium, High).
-   ** Deadlines & Overdue Alerts**: Visual indicators for nearest deadlines and overdue tasks.
-   ** Smart search & Sort**: Quickly find projects and sort them by deadline, name, or creation date.
-   ** Premium UI**: Modern aesthetic with dark mode, glassmorphism cards, and responsive layouts.

##  Technology Stack

### Frontend
-   **React.js** (v19)
-   **Axios** for API communication
-   **React Router** for seamless navigation
-   **Vanilla CSS** (Custom Design System with Glassmorphism)

### Backend
-   **Node.js & Express**
-   **MongoDB & Mongoose**
-   **JSON Web Tokens (JWT)** for security
-   **Bcrypt.js** for password encryption

##  Getting Started

To run this project locally:

### 1. Clone the repository
```bash
git clone https://github.com/mohamedehab1717/Task-Manager.git
cd Task-Manager
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```
Then start the server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm start
```

##  Deployment

The project is optimized for deployment on **Render**:
-   **Backend**: Deployed as a Web Service.
-   **Frontend**: Deployed as a Static Site.

---

