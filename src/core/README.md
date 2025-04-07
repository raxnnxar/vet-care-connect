
# Core

This directory contains core functionality that is shared across the application. It includes configuration, utilities, types, and hooks that are not specific to a single feature.

## Structure

- `config/` - Environment configuration and app settings
- `hooks/` - Shared custom hooks
- `types/` - Common TypeScript type definitions
- `utils/` - Utility functions used across the application

## Usage Guidelines

- Keep this directory focused on truly shared functionality
- Avoid domain-specific logic here - that belongs in the feature directories
- Document utility functions and hooks clearly
- Write unit tests for utilities and hooks
