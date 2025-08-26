# CasaPay

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
- Tailwind CSS for styling
- ESLint for code quality

## Getting Started

### Production

The application is deployed and available at: https://casapay-api.onrender.com/

This application is hosted on [Render](https://render.com/), a modern cloud platform for developers and teams that provides automatic deployments, scaling, and infrastructure management.

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

### Authentication

- User registration and login
- Session management with CSRF protection
- Secure logout functionality

### Account Management

- Create and manage different types of accounts (Monthly Budget, Loans/Credit)
- Set starting balances for accounts
- View account details and transaction history

### Budget Categories

- Create budget categories with custom amounts
- Support for variable expenses and debt repayment categories
- Optional descriptions for better organization

### Transaction Tracking

- Add transactions to specific accounts
- Categorize transactions with budget categories
- Track spending against budget limits

### User Interface

- Modern dark theme with purple accent colors
- Responsive design that works on desktop and mobile
- Real-time updates with Apollo Client cache management
- Intuitive navigation between different sections

## How to Use

### Getting Started

1. **Sign up** for an account using your email address
2. **Create your monthly budget account** - This will be your primary income source
3. **Add loan/repayment accounts** - Create separate accounts for each loan or debt you want to track
4. **Set up budget categories** - Create categories for non-loan expenses (groceries, utilities, etc.)

### Managing Your Budget

- **Monthly Budget Account**: This represents your income and is reduced by all transactions
- **Loan Accounts**: Track individual loans and their repayments
- **Budget Categories**: Organize other expenses that aren't loan-related
- **Transactions**: Add income and expenses that affect your accounts

### Key Features

- **Edit and delete** all accounts, transactions, and budget categories
- **Track spending** across different categories
- **Monitor loan repayments** separately from other expenses
- **Real-time updates** as you add or modify transactions

### Workflow

1. Add your monthly income to your budget account
2. Create loan accounts for each debt you're tracking
3. Set up budget categories for regular expenses
4. Record transactions as they occur
5. Monitor your spending and loan repayment progress

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
