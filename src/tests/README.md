
# Tests

This directory contains test utilities, helpers, and setup files. The actual test files should be co-located with the code they are testing.

## Structure

- `e2e/` - End-to-end test configurations and helpers
- `integration/` - Integration test helpers and utilities
- `utils/` - Shared test utility functions and mocks

## Usage Guidelines

- Unit tests should live next to the code they test (`component.test.tsx` next to `component.tsx`)
- Use this directory for shared test utilities and configurations
- Follow testing best practices (arrange-act-assert, etc.)
- Set up appropriate mocks for external dependencies
