
# Features

This directory contains domain-driven feature modules. Each feature is a cohesive set of functionality focused on a specific domain area of the application.

## Structure

Each feature directory follows a similar structure:

```
feature-name/
├── components/   # UI components specific to this feature
├── hooks/        # Feature-specific hooks
├── types/        # Feature-specific type definitions
├── store/        # Feature state management (contexts, reducers, etc.)
└── utils/        # Feature-specific utility functions
```

## Current Features

- `appointments/` - Scheduling and managing veterinary appointments
- `auth/` - User authentication and authorization
- `pets/` - Managing pet profiles and information
- `vets/` - Finding and communicating with veterinarians

## Usage Guidelines

- Keep each feature focused and self-contained
- Minimize dependencies between features
- Share code through the core directory when necessary
- Use feature-specific state management for complex features
