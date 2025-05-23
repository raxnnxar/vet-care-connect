
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReduxProvider } from './state/ReduxProvider';
import { Toaster } from '@/ui/templates/toaster';
import AppNavigator from './navigation/AppNavigator';
import './App.css';

// Create a client instance for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider>
        <BrowserRouter>
          <div className="App">
            <AppNavigator />
            <Toaster />
          </div>
        </BrowserRouter>
      </ReduxProvider>
    </QueryClientProvider>
  );
}

export default App;
