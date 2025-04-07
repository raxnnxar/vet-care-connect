
# State Management

This directory contains global state management for the application. While feature-specific state should be kept within each feature module, cross-cutting concerns and shared state lives here.

## Structure

- `store.ts` - Main store configuration
- `slices/` - State slices for different domains
- `middleware/` - Custom middleware

## Usage Guidelines

- Use this for truly global state that affects multiple features
- Consider using React Context + hooks for simpler state needs
- Be judicious about what goes into global state
- Document the shape and purpose of each slice
