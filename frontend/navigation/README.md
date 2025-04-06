
# Navigation Architecture

This folder contains the navigation structure for the Pet Care app, organized to support role-based flows.

## Structure

- `AppNavigator.tsx` - Main entry point that conditionally renders different navigators
- `AuthNavigator.tsx` - Authentication flow (login, signup, password reset)
- `OwnerNavigator.tsx` - Pet owner-specific screens and navigation
- `VetNavigator.tsx` - Veterinarian-specific screens and navigation
- `navigationConfig.ts` - Shared configuration, constants, and types

## Navigation Flow

1. The app starts with `AppNavigator` which decides which navigator to display based on:
   - Authentication state
   - User role (pet owner or veterinarian)
   
2. Unauthenticated users see the `AuthNavigator`
3. Authenticated pet owners see the `OwnerNavigator`
4. Authenticated veterinarians see the `VetNavigator`

## Adding New Screens

To add a new screen:
1. Add the screen name constant in `navigationConfig.ts`
2. Create the screen component
3. Add it to the appropriate navigator

## Navigation Types

Types are defined in each navigator file to ensure type safety when navigating between screens.
