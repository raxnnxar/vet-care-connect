
# Auth Hooks

This directory contains custom hooks for authentication functionality.

## Hooks

- `useAuth` - Access authentication state and methods
- `useRequireAuth` - Redirect if user is not authenticated
- `useRole` - Check if user has a specific role

## Usage Guidelines

- Use these hooks when you need to interact with authentication state
- Avoid direct API calls in components - use these hooks instead
- Handle loading and error states appropriately
