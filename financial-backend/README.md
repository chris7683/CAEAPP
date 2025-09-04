# Financial App Backend

Spring Boot backend with PostgreSQL for the Financial App.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL running on localhost:5432
- Database named "fapp" with a "users" table

## Database Setup

Your PostgreSQL database "fapp" should have a users table with the following structure:

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) DEFAULT 'USER'
);
```

## Configuration

Update `src/main/resources/application.yml` with your PostgreSQL credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/fapp
    username: your_username
    password: your_password
```

## Running the Application

1. Make sure PostgreSQL is running
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```

3. The API will be available at: `http://localhost:8080/api`

## API Endpoints

- `GET /api/auth/test` - Test endpoint
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

## Testing with Existing Data

If you have existing users in your database with password "password123", you can test login with:
- Email: any email from your users table
- Password: password123

Note: The backend will hash passwords with BCrypt, so existing plain text passwords need to be updated or you can create new users through the signup endpoint.
