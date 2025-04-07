
# API Layer

This directory contains the API client implementation for communicating with backend services.

## Structure

- `client.ts` - Base API client with request/response handling, error management, and authentication
- `endpoints.ts` - Central definition of all API endpoints used in the application
- `services/` - Domain-specific API service implementations

## Usage Guidelines

- All API calls should go through this layer
- Implement domain-specific API methods in the appropriate service file
- Handle common API concerns (auth, caching, error handling) in the client
- Keep service implementations focused on translating between API data and domain models
