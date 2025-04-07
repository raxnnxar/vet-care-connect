
# UI Components

This directory contains our UI component library organized using atomic design principles.

## Structure

- `/atoms/` - Smallest, indivisible components (buttons, inputs, labels, etc.)
- `/molecules/` - Composite components made up of atoms (forms, cards, complex inputs)
- `/templates/` - Page layout templates and structural components

## Usage Guidelines

- Keep UI components decoupled from business logic
- Focus on reusability and composability
- Document props with TypeScript interfaces
- Follow established design patterns and accessibility guidelines

## Component Classification

When adding new components, consider:
- If it can't be broken down into smaller functional parts → atom
- If it's composed of multiple atoms working together → molecule
- If it defines layout or structure at a page level → template
