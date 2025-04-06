
# Vett - Veterinary Services Booking App

A mobile-first application designed for pet owners to find and book veterinary-related services. Think of it as "Doctoralia for pets" - connecting pet owners with the right veterinary care when they need it.

## Project Description

Vett makes it easy for pet owners to:
- Find qualified veterinarians based on specialty, location, and availability
- Book appointments for routine check-ups, vaccinations, or emergency care
- Manage their pets' health records and medical history
- Receive reminders for upcoming appointments and preventive care

Veterinarians can:
- Manage their availability and appointments
- Access patient records and medical histories
- Communicate with pet owners before and after appointments

## Project Structure

The project follows a feature-based architecture with clear separation of concerns:

```
src/
├── frontend/               # Client-side code
│   ├── auth/               # Authentication and user management
│   ├── pets/               # Pet profiles and management
│   ├── vets/               # Veterinarian listings and profiles
│   ├── appointments/       # Appointment booking and management
│   ├── navigation/         # Navigation components and routing
│   ├── shared/             # Shared utilities and constants
│   └── ui/                 # Shared UI components
│
├── backend/                # Mock backend (will be replaced with Firebase/Supabase)
│   ├── api/                # API functions
│   └── data/               # JSON mock data
│
├── pages/                  # Top-level pages (with routes)
└── ...                     # Configuration files
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd vett
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser to view the app
   ```
   http://localhost:8080
   ```

## Development

### Code Style and Quality

The project uses ESLint and Prettier to maintain code quality and consistent formatting.

- Run linting:
  ```
  npm run lint
  ```

- Format code with Prettier:
  ```
  npm run format
  ```

### Adding New Features

1. Create components in the appropriate feature folder
2. Update mock data as needed in the backend/data folder
3. Add new routes in App.tsx if creating new pages

## Current Status

This is the initial project skeleton with the basic architecture set up. UI components and screens will be added incrementally based on design files.

## Future Improvements

- Implement authentication with Firebase/Supabase
- Replace mock backend with real APIs
- Add push notifications for appointment reminders
- Implement real-time chat between pet owners and vets
