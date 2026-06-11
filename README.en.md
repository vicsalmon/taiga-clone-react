<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React Logo" width="80" />
  <h1>Taiga Clone - Web Client (React)</h1>
  <p><em>Responsive SPA user interface for issue management and tracking.</em></p>

  <p>
    <a href="README.md">💬 Català</a> | <b>🌍 English</b>
  </p>

  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<br />

This repository contains the **Front-end** developed with **React** for the **Third Assignment** of the Web Applications and Services (ASW) subject.

The application is an SPA (Single Page Application) web client that acts as a graphical interface to consume the Ruby on Rails REST API implemented in the previous assignment, allowing agile and dynamic management of issues.

🌍 **Production Environment (Frontend):** [Taiga React App (Vercel)](https://frontend-asw-taiga-project.vercel.app/)  
⚙️ **REST API (Backend):** [Taiga API (Render)](https://taiga-app.onrender.com/api/v1)  
🌍 **Production Environment (Ruby APP):** [Taiga App (Render)](https://taiga-app.onrender.com)   
🌲 **Organization:** [Official Taiga Project](https://tree.taiga.io/project/victorsalinasmontanuy-asw2526q2-it212)

---

## ✨ Project Demonstration

The following 2-minute video shows the complete interaction with the user interface:

<div align="center">
  <video src="https://github.com/user-attachments/assets/98cd7efd-9372-4256-a1e0-18d69dfc3240" width="100%" controls></video>
</div>

---

## 🎯 Key Features

- **Dynamic User Interface:** 100% dynamic consumption of API attributes (Statuses, Types, Priorities, Severities). Adapts automatically to the database.
- **Filtering and Sorting:** Efficient delegation of searches, complex filters, and sorting directly to the backend using exact URL parameters (`?status=New&sort=priority`).
- **Issue Management:** Creation, editing, detailed viewing, and deletion of Issues.
- **Bulk Insertion:** Specialized form for the quick creation of multiple issues at once.
- **Simulated User Switching:** Quick selection of the active user (via dynamic API Key injection into `fetch` headers) to test different roles and permissions on the platform.
- **Profile Tab:** Detailed information about the current user.
- **Responsive Design:** Full adaptation (Mobile-First) to mobile devices and desktops using Flexbox and CSS Grid.

---

## 🛠️ Key Technologies

| Layer | Technology |
|---------|------------|
| Core Library | React |
| Build Tool | Vite |
| Language | JavaScript (ES6+) |
| Styles | CSS3 |
| Backend Integration | Fetch RESTful API (Asynchronous Services) |
| Hosting / CD | Vercel |

---

## 🚀 Local Setup Guide

Before starting, make sure you have **Node.js (v18+)** and **npm** installed.

### 1. Clone the Repository

```bash
git clone https://github.com/semabo29/Taiga_Issues_Clone_React.git
cd Taiga_Issues_Clone_React
```

### 2. Install Dependencies

Download all necessary packages to run the project:

```bash
npm install
```

### 3. Configure Environment Variables

Create a file named `.env` in the root of the project (at the same level as `package.json`) and add:

```env
VITE_API_URL=https://taiga-app.onrender.com/api/v1
```

If you want to work with the backend locally, replace the URL with:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 4. Run the Development Environment

Start the Vite development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 👥 Development Team

| Name                    |
| ----------------------- |
| Clàudia Galán Rodoreda  |
| Sergi Malaguilla Bombín |
| Adrià Aguilar Garcia    |
| Victor Salinas Montanuy |

**Professor:** Quim Motger De La Encarnacion

**Subject:** Web Applications and Services (ASW) — Bachelor's Degree in Computer Engineering (UPC)

**Term:** Spring Semester, Academic Year 2025/26

---

## ⚖️ License and Copyright

© 2026 Clàudia Galán Rodoreda, Sergi Malaguilla Bombín, Adrià Aguilar Garcia and Victor Salinas Montanuy. All rights reserved.

This repository and its content are publicly accessible solely for the purpose of serving as a personal portfolio and academic evaluation.

No license (implicit or explicit) is granted to copy, modify, distribute, or use this code, whether for commercial or non-commercial purposes, without prior written permission from the authors.

---

<div align="center">
  <sub>README created by @semabo29 (https://github.com/semabo29).</sub>
</div>
