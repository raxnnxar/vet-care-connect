
# Pet Owner Services App

A veterinary appointment booking application designed for pet owners and veterinarians.

## Project Structure

The project follows a clean architecture approach with a domain-driven design:

```
src/
├── api/                  # API client layer
│   ├── client.ts         # Base API client with request/response handling
│   ├── endpoints.ts      # API endpoint definitions
│   └── services/         # Domain-specific API services
├── core/                 # Core/shared functionality
│   ├── config/           # Environment configuration
│   ├── hooks/            # Shared hooks
│   ├── types/            # Shared types
│   └── utils/            # Shared utilities
├── features/             # Domain-driven feature modules
│   ├── appointments/     # Appointment scheduling and management
│   ├── auth/             # Authentication and user management
│   ├── pets/             # Pet profile management
│   └── vets/             # Veterinarian directory and search
├── state/                # Global state management
├── ui/                   # Shared UI components
├── navigation/           # Navigation configuration
└── tests/                # Test utilities and setup
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Then open your browser to `http://localhost:8080`.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_BASE_URL=/api
VITE_ENVIRONMENT=development
VITE_DEBUG=true
```

## Development Guidelines

- Follow the established project structure
- New features should be added as feature modules in the `features/` directory
- Shared UI components go in the `ui/` directory
- API calls should go through the API layer
- Use TypeScript for type safety

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code
