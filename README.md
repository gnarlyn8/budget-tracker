# Budget Tracker

A full-stack budget tracking application built with Rails GraphQL API and React TypeScript frontend.

## Architecture

This project consists of two main components:

- **Server**: Rails 8.0.2 API with GraphQL backend
- **Web**: React 19 + TypeScript + Vite frontend

## Tech Stack

### Backend

- Ruby on Rails 8.0.2
- GraphQL API
- SQLite database
- Puma web server

### Frontend

- React 19
- TypeScript
- Apollo Client for GraphQL
- Vite for build tooling
- ESLint for code quality

## Getting Started

### Prerequisites

- Ruby 3.2+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install Ruby dependencies:

   ```bash
   bundle install
   ```

3. Set up the database:

   ```bash
   rails db:create
   rails db:migrate
   ```

4. Start the Rails server:
   ```bash
   rails server
   ```

The GraphQL endpoint will be available at `http://localhost:3000/graphql`

### Frontend Setup

1. Navigate to the web directory:

   ```bash
   cd web
   ```

2. Install Node.js dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Development

### Running Tests

- Backend: `cd server && rails test`
- Frontend: `cd web && npm run lint`

### Database

- The application uses SQLite for development
- Database files are in `server/db/`
- Migrations are in `server/db/migrate/`

## Project Structure

```
budget-tracker/
├── server/                 # Rails GraphQL API
│   ├── app/
│   │   ├── graphql/       # GraphQL schema and types
│   │   ├── models/        # ActiveRecord models
│   │   └── controllers/   # Rails controllers
│   ├── db/               # Database files and migrations
│   └── Gemfile           # Ruby dependencies
├── web/                   # React TypeScript frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── graphql/      # GraphQL queries and mutations
│   │   └── apollo-client.ts
│   └── package.json      # Node.js dependencies
└── README.md             # This file
```

## Features

- Create and manage budgets
- GraphQL API for flexible data querying
- Modern React frontend with TypeScript
- Real-time development with hot reloading

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
