<div align="center">
  <h1>ASW Taiga Issue Tracker</h1>
  <p><em>Web application for issue management and tracking inspired by Taiga.</em></p>

  <p>
    <a href="README.md">💬 Català</a> | <b>🌍 English</b>
  </p>

  <img src="https://img.shields.io/badge/Ruby-CC342D?style=flat-square&logo=ruby&logoColor=white" alt="Ruby" />
  <img src="https://img.shields.io/badge/Rails-CC0000?style=flat-square&logo=ruby-on-rails&logoColor=white" alt="Rails" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" alt="Postgres" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white" alt="Render" />
</div>

<br />

Project developed for the Web Applications and Services (ASW) subject at the Universitat Politècnica de Catalunya (UPC). This project replicates the core functionalities of a professional Issue Tracker, implementing a robust RESTful API and a scalable architecture.

🌍 **Production Environment:** [Taiga App (Render)](https://taiga-app.onrender.com) *(Note: The server may take a few seconds to start due to the free tier policies).* 

🌲 **Organization:** [Project organization on Taiga](https://tree.taiga.io/project/victorsalinasmontanuy-asw2526q2-it212)

---

## ✨ Project Demonstration

The following video (1:30 min) shows the complete main flow of the application:

https://github.com/user-attachments/assets/1831e4b5-19a0-4d83-a993-08b70420b00b

> Note: Features such as View Profile, Bulk Insert, and other advanced functionalities are outside the project's Main Flow but are fully implemented.

The following image shows the view of a profile that does not belong to the current user:

<div align="center">
  <img
    src="https://github.com/user-attachments/assets/3bad8143-0b86-4692-b960-77dc38f6c3ec"
    alt="Profile View"
    width="800"
  />
</div>

---

## 🛠️ Tech Stack and Architecture

- **Web Framework:** Ruby on Rails 7.1.3 (API-first design)
- **Language:** Ruby 3.3.6
- **Database:** SQLite3 (Development) / PostgreSQL (Production)
- **Authentication:** Google OAuth2 (OmniAuth)
- **Storage:** Active Storage integrated with AWS S3
- **Infrastructure:** Dockerized and deployed on Render
- **CI/CD:** GitHub Actions automating tests and deployments

---

## 🔌 REST API (Richardson Maturity Model Level 2)

The backend acts as a structured RESTful API designed to be consumed by any client. Special emphasis has been placed on security, validation, and data consistency.

### 📄 Documentation

Complete OpenAPI specification available at:

```text
/api/api.yml
```

### 🧪 Try It Yourself

1. Open Swagger Editor: https://editor.swagger.io/
2. Load the project's `api.yml` file.
3. Sign up on the production application using Google authentication.
4. Copy your API Key from your profile page.
5. Click **Authorize** in Swagger.
6. Paste the API Key and start making requests directly against the production database.

---

## ⚙️ Deployment and CI/CD

The project features a continuous integration pipeline defined in:

```text
.github/workflows/cd.yml
```

Every integration into the `main` branch automatically:

1. Builds an optimized Docker image from the included `Dockerfile`.
2. Runs database migrations against PostgreSQL.
3. Deploys the new version to Render.
4. Maintains service availability with zero downtime deployments.

---

## 🚀 Local Setup

Before starting, make sure you have:

* Ruby installed
* Bundler installed
* Node.js installed
* PostgreSQL (optional for local production-like testing)

### 1. Clone the Repository

```bash
git clone https://github.com/semabo29/ASW_Taiga_Project.git
cd ASW_Taiga_Project
```

### 2. Install Dependencies

```bash
bundle install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET=aswtaiga-bucket
```

### 4. Prepare the Database

```bash
rails db:prepare
```

### 5. Start the Server

```bash
bin/rails server -b 0.0.0.0
```

The application will be available at:

```text
http://localhost:3000
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

This repository and its content are publicly accessible solely for portfolio, educational, and academic evaluation purposes.

No license (implicit or explicit) is granted to copy, modify, distribute, sublicense, or use this code, whether for commercial or non-commercial purposes, without prior written permission from the authors.
