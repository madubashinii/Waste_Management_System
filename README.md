# Waste Management System

A **Waste Management System** built with **Spring Boot (Backend)** and **React (Frontend)**.  
This project follows **SOLID principles** and a **modular architecture** for maintainability and scalability.

---

## Repository Structure

```
Waste_Management_System/
 ├── eco-collect-backend/      # Spring Boot backend
 └── eco-collect-frontend/     # React frontend
```

## Backend (Spring Boot)
- Path: `eco-collect-backend/`
- Spring Boot 3.2, Java 21
- Run with: `mvn spring-boot:run`
  
### Folder Structure

```
eco-collect-backend/
 ├── src/main/java/com/csse/ecocollect/
 │   ├── EcoCollectApplication.java          # Main Spring Boot application class
 │   │
 │   ├── admin/                               # Admin module
 │   │   ├── controller/                      # REST controllers for admin APIs
 │   │   ├── service/                         # Service interfaces for admin business logic
 │   │   ├── service/impl/                    # Service implementation classes
 │   │   ├── repository/                      # Data access layer (Spring Data JPA repositories)
 │   │   ├── entity/                          # JPA entities representing database tables
 │   │   └── dto/                             # Data Transfer Objects for requests/responses
 │   │
 │   ├── collector/                           # Collector module (same structure as admin)
 │   │   ├── controller/
 │   │   ├── service/
 │   │   ├── service/impl/
 │   │   ├── repository/
 │   │   ├── entity/
 │   │   └── dto/
 │   │
 │   ├── resident/                                # User module
 │   │   ├── controller/
 │   │   ├── service/
 │   │   ├── service/impl/
 │   │   ├── repository/
 │   │   ├── entity/
 │   │   └── dto/
 │   │
 │   ├── dispatcher/                              # Driver module
 │   │   ├── controller/
 │   │   ├── service/
 │   │   ├── service/impl/
 │   │   ├── repository/
 │   │   ├── entity/
 │   │   └── dto/
 │   │
 │   ├── config/                              # Configuration classes (CORS, security, Swagger, etc.)
 │   └── common/                              # Shared utilities, constants, enums, global exceptions
 │
 └── src/main/resources/
     └── application.properties               # Application properties (DB, server port, etc.)

```

## Frontend (React)
- Path: `eco-collect-frontend/`
- React 
- Run with: `npm install && npm start`
  
### Folder Structure

```
eco-collect-frontend/
 ├── public/
 │   └── index.html
 ├── src/
 │   ├── App.jsx
 │   ├── index.jsx
 │   ├── assets/          # Images, icons, fonts
 │   ├── components/      # Reusable UI components
 │   ├── pages/           # Modules: Admin, Collector, User, Driver
 │   ├── services/        # API calls
 │   ├── context/         # Global state / React Context
 │   ├── utils/           # Helper functions
 │   └── hooks/           # Custom hooks
 └── package.json

```
