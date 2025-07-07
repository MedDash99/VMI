-- Create database (run this separately)
-- CREATE DATABASE vacation_management;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('requester', 'validator'))
);

-- Vacation requests table
CREATE TABLE IF NOT EXISTS vacation_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Seed data
INSERT INTO users (name, role) VALUES 
    ('John Doe', 'requester'),
    ('Jane Smith', 'requester'),
    ('Admin User', 'validator'),
    ('HR Manager', 'validator')
ON CONFLICT DO NOTHING;

-- Sample vacation requests
INSERT INTO vacation_requests (user_id, start_date, end_date, reason, status) VALUES 
    (1, '2024-03-15', '2024-03-20', 'Family vacation', 'Pending'),
    (2, '2024-04-01', '2024-04-05', 'Medical appointment', 'Approved'),
    (1, '2024-05-10', '2024-05-12', 'Wedding ceremony', 'Rejected')
ON CONFLICT DO NOTHING; 