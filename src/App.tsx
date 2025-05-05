
import { Toaster } from "@/ui/templates/toaster";
import { Toaster as Sonner } from "@/ui/templates/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/ui/molecules/tooltip";
import { ReduxProvider } from "./state/ReduxProvider";
import { AuthProvider } from "./features/auth/hooks/useAuth";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";

// Import our navigation component
import AppNavigator from "./navigation/AppNavigator";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

// Create a new QueryClient instance outside the component to avoid recreating it on each render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  }
});

// Log Supabase configuration status
console.log("Supabase Configuration Status:", {
  isConfigured: supabase ? true : false,
  url: import.meta.env.VITE_SUPABASE_URL ? "Set" : "Not Set",
  key: import.meta.env.VITE_SUPABASE_ANON_KEY ? "Set" : "Not Set"
});

const App = () => {
  // Log the Supabase session on mount to help with debugging
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Current Supabase session:", data.session ? "Exists" : "None");
    };
    
    checkSession();
  }, []);
  
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
