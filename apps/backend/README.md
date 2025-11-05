# World Tour Backend API

Backend REST API for the World Tour application, built with Fastify and PostgreSQL.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
nano .env
```

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:3001`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Places

- `GET /api/places` - Get all places (with filters)
  - Query params: `q`, `type`, `minRating`, `maxDistance`, `interests`
- `GET /api/places/:id` - Get place by ID
- `GET /api/places/nearby` - Get nearby places
  - Query params: `lat`, `lng`, `radius`
- `POST /api/places/:id/ratings` - Rate a place (auth required)

### Users

- `GET /api/users/me` - Get current user (auth required)
- `PUT /api/users/me/interests` - Update user interests (auth required)
- `POST /api/users/me/visited` - Add visited place (auth required)
- `POST /api/users/me/badges` - Add badge to user (auth required)

### Tours

- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get tour by ID
- `POST /api/tours/generate` - Generate a new tour
  - Body: `{ duration, interests, location? }`

## 🗄️ Database Schema

The database includes the following main entities:

- **User** - User accounts with interests and visited places
- **Place** - Museums, monuments, and points of interest
- **PointOfInterest** - Specific attractions within a place
- **Badge** - Achievement badges for visiting places
- **Rating** - User ratings for places
- **Tour** - Generated itineraries

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📝 Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/worldtour?schema=public"
JWT_SECRET="your-secret-key"
PORT=3001
HOST=0.0.0.0
```

## 🧪 Sample Data

The seed script creates sample data including:
- 6 famous Parisian places (Louvre, Eiffel Tower, Notre-Dame, Versailles, Orsay, Sacré-Cœur)
- Test user (email: test@example.com, password: password123)
- Sample ratings and tours

## 🛠️ Tech Stack

- **Fastify** - Fast and low overhead web framework
- **Prisma** - Modern ORM for PostgreSQL
- **bcrypt** - Password hashing
- **JWT** - Authentication tokens
- **TypeScript** - Type safety
