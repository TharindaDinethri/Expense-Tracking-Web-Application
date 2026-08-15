# SLTS Software Developer / Intern – Take Home Assessment

A full-stack web-based expense tracker implemented to satisfy the requirements in the Sri Lanka Telecom (Services) Limited take-home assessment.

## 1. Technology Stack

- **Backend:** 
Java 21, Spring Boot 3.5, Spring Web, Spring Data JPA, Spring Security, BCrypt, Maven

- **Authentication:** 
JWT

- **Database:** 
MySQL 8.4 (relational DBMS)

- **Frontend:** 
React + Vite, JavaScript, CSS

- **Testing:** 
JUnit 5 + Mockito + Spring Boot Test dependencies

- **DevOps / Bonus:** 
Docker + docker-compose


**The architecture is:**

```text
React SPA → REST API → Spring Boot Service Layer → Spring Data JPA → MySQL
```

## 2. Implemented Requirements

### User Management
- Registration with name, email, address and password
- BCrypt password hashing
- JWT login/authentication
- Protected endpoints
- User profile
- Forgot-password flow with six-digit OTP
- OTP expiry and one-time-use validation
- SMTP email support through environment variables; if SMTP is not configured during local development, the generated OTP is printed to the backend console

### Expense Management
- Add expense
- Edit expense
- Delete expense
- List expenses, newest first
- Title, category, amount, transaction date and note
- Required categories: Food, Transport, Bills, Shopping, Entertainment and Other

### Income Management
- Add income
- Edit income
- Delete income
- List income, newest first
- Source, amount, received date and note

### Dashboard
- Total income
- Total expenses
- Current balance
- Latest five transactions
- Monthly income
- Monthly expenses
- Expense ratio
- Highest expense category for the selected month
- Highest expense category amount
- Month-based financial filtering

### Quality / Bonus
- Layered backend architecture
- DTOs and validation
- Global exception handling
- Database indexes and constraints
- Unit tests
- Password Recovery
- Dockerized DB/backend/frontend
- Responsive polished UI

## 3. Prerequisites

### Local development

Install:

- Java 21
- Maven 3.9+
- Node.js 20+
- npm
- MySQL 8+

### Docker Development

Only Docker and Docker Compose are required.

## 4. Database Setup – Local

Create the database:

```sql
CREATE DATABASE expense_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

The application uses `spring.jpa.hibernate.ddl-auto=update`, so JPA creates/updates the tables automatically.

Default local connection:

```text
URL: jdbc:mysql://localhost:3306/expense_tracker
Username: root
Password: root
```

If your MySQL credentials are different, set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` before starting the backend.

## 5. Backend – Local

```bash
cd backend
mvn clean test
mvn spring-boot:run
```

Backend starts on:

```text
http://localhost:8080
```

Health check:

```text
GET http://localhost:8080/api/health
```

## 6. Frontend – Local

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on:

```text
http://localhost:5173
```

The frontend uses `http://localhost:8080/api` by default. To change it:

```bash
VITE_API_URL=http://localhost:8080/api npm run dev
```

## 7. Docker – Full Stack

From the project root:

```bash
docker compose up --build
```

Then open:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080
MySQL:    localhost:3306
```

Stop the stack:

```bash
docker compose down
```

Stop and remove the database volume too:

```bash
docker compose down -v
```

## 8. API Endpoints

### Authentication

| Method | Endpoint                    | Authentication |
|--------|-----------------------------|----------------|
| POST   | `/api/auth/register`        | Public         |
| POST   | `/api/auth/login`           | Public         |
| GET    | `/api/auth/profile`         | JWT            |
| POST   | `/api/auth/forgot-password` | Public         |
| POST   | `/api/auth/reset-password`  | Public         |

### Expenses

| Method | Endpoint                    | Authentication |
|--------|-----------------------------|----------------|
| POST   | `/api/expenses`             | JWT            |
| GET    | `/api/expenses`             | JWT            |
| PUT    | `/api/expenses/{id}`        | JWT            |
| DELETE | `/api/expenses/{id}`        | JWT            |

### Income

| Method | Endpoint                    | Authentication |
|--------|-----------------------------|----------------|
| POST   | `/api/incomes`              | JWT            |
| GET    | `/api/incomes`              | JWT            |
| PUT    | `/api/incomes/{id}`         | JWT            |
| DELETE | `/api/incomes/{id}`         | JWT            |

### Dashboard

```text
GET /api/dashboard
GET /api/dashboard?year=2026&month=8
```

Requires JWT.

## 9. Example Registration

```json
{
  "name": "John Krish",
  "email": "john@example.com",
  "address": "Colombo, Sri Lanka",
  "password": "Password123"
}
```

## 10. Example Expense

```json
{
  "title": "Lunch",
  "category": "FOOD",
  "amount": 1200.00,
  "transactionDate": "2026-08-11",
  "note": "Lunch with friends"
}
```

## 11. Example Income

```json
{
  "source": "Salary",
  "amount": 150000.00,
  "receivedDate": "2026-08-01",
  "note": "Monthly salary"
}
```

## 12. Security

- Passwords are never stored as plain text; BCrypt is used.
- JWTs are required for protected endpoints.
- User-owned records are queried using both record ID and authenticated user ID, preventing users from editing/deleting another user's transactions.
- Validation is applied to API request DTOs.
- Database relationships use foreign keys through JPA mappings.
- CORS is configured for local frontend development.

For production deployment, use a strong random `JWT_SECRET`, HTTPS, restricted CORS origins, and a properly configured SMTP provider.

## 13. Project Structure

```text
SLTS-Expense-Tracker/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/slts/expensetracker/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── exception/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   │
│   │   └── test/
│   │
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── schema.sql
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```
## 14.Validation and Error Handling

The backend uses DTO-based validation for API requests.

Validation is applied to fields such as:
- Required values
- Email format
- Password requirements
- Amount values
- Transaction information

The application also includes centralized exception handling using a global exception-handling layer.

This provides consistent API error responses and prevents exposing unnecessary internal implementation details.

## 15. Testing

Backend tests are under:

```text
backend/src/test/java/
```

Run:

```bash
cd backend
mvn clean test
```

The test suite includes service-level tests for expense creation and dashboard calculations. The project also includes Spring Boot Test and Spring Security Test dependencies so additional controller/integration tests can be expanded easily.

## 16. GitHub Submission

Create a public repository and push this project:

```bash
git init
git add .
git commit -m "Initial SLTS expense tracker implementation"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## 17. Assessment Requirement Mapping

|------------------------------|----------------|
| Assessment requirement       | Implementation |
|------------------------------|----------------|
| Java 11+                     | Java 21        |
| Spring Boot                  | Spring Boot 3.5|
| Spring Data JPA              | Yes            |
| Relational DB                | MySQL          |
| NoSQL avoided                | Yes            |
| Spring Security              | Yes            |
| JWT/LDAP/OAuth2              | JWT            |
| REST API                     | Yes            |
| React SPA                    | React + Vite   |
| User Registration            | Yes            |
| Authentication               | JWT login      |
| Profile                      | Yes            |
| Expense CRUD                 | Yes            |
| Income CRUD                  | Yes            |
| Required categories          | Yes            |
| Latest transactions          | Yes            |
| Total income                 | Yes            |
| Total expenses               | Yes            |
| Current balance              | Yes            |
| Monthly income               | Yes            |
| Monthly expense              | Yes            |
| Highest category             | Yes            |
| DTO Validation               | Yes            |
| Layered architecture         | Yes            |
| Error handling               | Yes            |
| Database indexes/constraints | Yes            |
| Backend tests                | Yes            |
| Polished UI                  | Yes            |
| Docker                       | Yes            |
| Docker Compose               | Yes            |
| Password Recovery            | Yes            |
| OTP Expiration               | Yes            |
| SMTP Support                 | Yes            |
| README                       | Yes            |
