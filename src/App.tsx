import { Toaster } from "@/ui/templates/toaster";
import { Toaster as Sonner } from "@/ui/templates/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/ui/molecules/tooltip";
import { ReduxProvider } from "./state/ReduxProvider";
import { AuthProvider } from "./features/auth/hooks/useAuth";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  }
});

// Import our navigation component
import AppNavigator from "./navigation/AppNavigator";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider>
        <Router>
          <AuthProvider>
            <UserProvider>
              <TooltipProvider>
                {/* Toast notifications */}
                <Toaster />
                <Sonner />
                
                {/* Application navigation */}
                <AppNavigator />
              </TooltipProvider>
            </UserProvider>
          </AuthProvider>
        </Router>
      </ReduxProvider>
    </QueryClientProvider>
  );
};

export default App;
