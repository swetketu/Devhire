# DevHire 🚀

DevHire is a backend recruitment platform built with Spring Boot that connects candidates and recruiters through a secure job application workflow.

## Features

### Candidate
- Register and login
- JWT authentication
- Search jobs
- Save/unsave jobs
- Apply for jobs
- View applications
- Upload resume
- Resume skill analysis
- Receive application status notifications
- Candidate dashboard

### Recruiter
- Register and login
- Create jobs
- Update jobs
- Delete jobs
- View applications
- Update application status
- Recruiter dashboard

### Backend
- JWT-based authentication
- Role-based authorization
- MySQL database
- Redis caching
- Apache Kafka event-driven notifications
- Resume processing
- Global exception handling
- API validation
- Swagger/OpenAPI documentation

## Tech Stack

| Technology | Purpose |
|---|---|
| Java 21 | Programming language |
| Spring Boot | Backend framework |
| Spring Security | Authentication & authorization |
| JWT | Stateless authentication |
| Spring Data JPA | Database access |
| MySQL | Relational database |
| Redis | Caching |
| Apache Kafka | Event-driven messaging |
| Maven | Build tool |
| Swagger/OpenAPI | API documentation |
| Docker | Infrastructure |

## Architecture

```text
                    ┌───────────────┐
                    │   Candidate   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ REST API      │
                    │ Spring Boot   │
                    └───────┬───────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
          MySQL           Redis          Kafka
             │              │              │
             │              │              ▼
             │              │       Notification
             │              │          Consumer
             │              │              │
             └──────────────┴──────────────┤
                                            ▼
                                      Notifications