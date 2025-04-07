
# API Services

This directory contains domain-specific API service implementations. Each file represents a logical grouping of API calls related to a specific domain entity or feature.

## Structure

- `appointments.ts` - API methods for appointment management
- `auth.ts` - Authentication-related API calls
- `pets.ts` - Pet management API methods
- `vets.ts` - Veterinarian-related API methods

## Usage Guidelines

- Keep each service focused on a specific domain area
- Use the base apiClient for making requests
- Transform API responses to domain models where appropriate
- Handle service-specific error cases
