# Demo
https://github.com/user-attachments/assets/fcc9217e-ab71-404e-b0da-70e0f1c200e9





# Vacation Management Interface

A full-stack web application for managing vacation requests with separate interfaces for requesters and validators.

## Features

- **Requester Interface**: Submit vacation requests and view request status
- **Validator Interface**: Review, approve, or reject vacation requests with filtering
- **Real-time Updates**: Instant feedback on request status changes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Input Validation**: Client and server-side validation for data integrity

## Tech Stack

- **Frontend**: React 19 with Vite, React Router, Axios
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Styling**: Modern CSS with responsive design

## Project Structure

```
VMI/
├── server/              # Backend API
│   ├── index.js        # Express server
│   ├── routes.js       # API endpoints
│   ├── db.js           # Database connection
│   ├── database.sql    # Database schema and seed data
│   └── package.json    # Backend dependencies
├── src/                # Frontend React app
│   ├── components/     # React components
│   │   ├── RequesterInterface.jsx
│   │   └── ValidatorInterface.jsx
│   ├── utils/          # Utility functions
│   │   └── api.js      # API service layer
│   ├── App.jsx         # Main app component with routing
│   ├── App.css         # Application styles
│   ├── main.jsx        # React entry point
│   └── index.css       # Global styles
└── package.json        # Frontend dependencies
```

## How to Install

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE vacation_management;
   ```

2. Run the database schema:
   ```bash
   psql -d vacation_management -f server/database.sql
   ```

3. (Optional) Create a `.env` file in the `server/` directory:
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=vacation_management
   DB_PASSWORD=your_password
   DB_PORT=5432
   PORT=3000
   ```

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Frontend Setup

1. Navigate to the root directory (VMI):
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running with Docker

You can run the entire stack (frontend, backend, and database) using Docker and Docker Compose. This is the fastest way to get started without installing Node.js or PostgreSQL locally.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Quick Start

1. **Clone the repository and navigate to the `VMI` directory:**
   ```bash
   cd VMI
   ```

2. **(Optional) Change the default database password:**
   - Edit `docker-compose.yml` and update the `POSTGRES_PASSWORD` and `DATABASE_URL` fields for better security.

3. **Start all services:**
   ```bash
   docker-compose up --build
   ```
   This will build and start three containers:
   - `db` (PostgreSQL, port 5433 on host)
   - `backend` (Express API, port 3001 on host)
   - `frontend` (React app served by Nginx, port 80 on host)

4. **Access the application:**
   - Frontend: [http://localhost](http://localhost)
   - Backend API: [http://localhost:3001](http://localhost:3001)
   - Database: Host port `5433` (e.g., for connecting with a DB client)

5. **Stop the stack:**
   Press `Ctrl+C` in the terminal running Docker Compose, then run:
   ```bash
   docker-compose down
   ```

### Notes
- The database is persisted in a Docker volume (`db_data`).
- The initial schema and seed data are loaded from `server/database.sql`.
- For production, always change the default database password in `docker-compose.yml` and `DATABASE_URL`.
- You can customize ports in `docker-compose.yml` if needed.

## How to Run

### Start the Backend Server

```bash
cd server
npm run dev
```

The backend server will run on `http://localhost:3000`

### Start the Frontend Development Server

In a new terminal, from the VMI root directory:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### Requester Interface

1. Navigate to `http://localhost:5173/` or `http://localhost:5173/requester/1`
2. Fill out the vacation request form with:
   - Start Date
   - End Date
   - Reason (optional)
3. Submit the request
4. View your submitted requests below the form

### Validator Interface

1. Navigate to `http://localhost:5173/validator`
2. View all submitted vacation requests
3. Filter requests by status (All, Pending, Approved, Rejected)
4. For pending requests:
   - Click "Approve" to approve the request
   - Click "Reject" to reject with optional comments

## API Endpoints

- `POST /api/requests` - Submit a vacation request
- `GET /api/requests` - Get all requests (with optional status filter)
- `GET /api/requests/user/:userId` - Get requests for a specific user
- `PUT /api/requests/:id/status` - Update request status
- `GET /api/users` - Get all users

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` (VARCHAR)
- `role` ('requester' or 'validator')

### Vacation Requests Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `start_date` (DATE)
- `end_date` (DATE)
- `reason` (TEXT)
- `status` ('Pending', 'Approved', 'Rejected')
- `comments` (TEXT)
- `created_at` (TIMESTAMP)

## Technical Choices

- **React**: Chosen for its component-based architecture and excellent developer experience
- **Vite**: Fast build tool with hot module replacement for better development experience
- **Express.js**: Lightweight and flexible Node.js framework for building APIs
- **PostgreSQL**: Robust relational database with excellent data integrity features
- **Axios**: Promise-based HTTP client for clean API interactions

## Known Limitations

- No user authentication/authorization system
- No email notifications for request status changes
- No file attachments for vacation requests
- No calendar integration
- Single-tenant application (no multi-company support)

## Potential Future Improvements

- Add user authentication and session management
- Implement role-based access control
- Add email notifications
- Calendar integration for viewing vacation schedules
- Conflict detection for overlapping requests
- Reporting and analytics dashboard
- Mobile app development
- Advanced filtering and search capabilities
- Bulk operations for validators
- Request history and audit trail

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
