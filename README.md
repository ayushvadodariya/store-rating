# Store Rating System

## Deployment Links
- Frontend: [https://store-rating-sage.vercel.app](https://store-rating-sage.vercel.app)
- Backend: [https://store-rating-uojs.onrender.com](https://store-rating-uojs.onrender.com)

## Project Overview
This is a store rating system that allows users to rate and review stores. The application consists of a frontend built with React and a backend API built with Node.js.

## Project Structure
- `frontend/`: React application for the user interface
- `backend/`: Node.js server with Express and Prisma
- `common/`: Shared code between frontend and backend

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Database (as configured in Prisma)

### Installation

1. Clone the repository
```bash
git clone https://github.com/ayushvadodariya/store-rating.git
cd store-rating
```

2. Install dependencies for backend
```bash
cd backend
npm install
```

3. Install dependencies for frontend
```bash
cd ../frontend
npm install
```

4. Install dependencies for common package
```bash
cd ../common
npm install
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

## Features
- User authentication and authorization
- Store creation and management
- Rating and reviewing stores
- Admin dashboard for managing stores and users
- Owner dashboard for viewing store ratings

## Technologies Used
- **Frontend**: React, Vite, shadcn/ui
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
