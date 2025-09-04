-- PostgreSQL Database Setup for Financial App
-- Run these commands in your PostgreSQL database

-- Create database
CREATE DATABASE financial_app;

-- Connect to the database
\c financial_app;

-- Create user table (this will be created automatically by JPA, but here's the structure)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) DEFAULT 'USER'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Insert a test user (password is 'password123' encoded with BCrypt)
-- You can use this for testing: https://bcrypt-generator.com/
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('test@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', 'USER')
ON CONFLICT (email) DO NOTHING;
