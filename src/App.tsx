
import { BrowserRouter } from 'react-router-dom';
import { ReduxProvider } from './state/ReduxProvider';
import { Toaster } from '@/ui/templates/toaster';
import AppNavigator from './navigation/AppNavigator';
import './App.css';

function App() {
  return (
    <ReduxProvider>
      <BrowserRouter>
        <div className="App">
          <AppNavigator />
          <Toaster />
        </div>
      </BrowserRouter>
    </ReduxProvider>
  );
}

export default App;
