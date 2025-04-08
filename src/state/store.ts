
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import petsReducer from '../features/pets/store/petsSlice';
import vetsReducer from '../features/vets/store/vetsSlice';
import appointmentsReducer from '../features/appointments/store/appointmentsSlice';
import authReducer from '../features/auth/store/authSlice';

// Configure the Redux store with all feature reducers
export const store = configureStore({
  reducer: {
    pets: petsReducer,
    vets: vetsReducer,
    appointments: appointmentsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Allow serializable checks in development, disable in production for performance
      serializableCheck: process.env.NODE_ENV !== 'production',
    }),
});

// Export types for TypeScript usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
