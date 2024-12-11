import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { UserProvider } from './context/UserContext';
import HabitsPage from './components/Habits/HabitsPage';
import Home from './components/Home/Home';
import ProgressPage from './components/Progress/ProgressPage';
import ProtectedRoute from "./components/ProtectedRoute";
import UserPage from './components/User/UserPage';

function App() {
  return (

    <AuthProvider>
      <UserProvider>
        <ProgressProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/habits"
                element={
                  <ProtectedRoute>
                    <HabitsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <ProgressPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-user"
                element={
                  <ProtectedRoute>
                    <UserPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </ProgressProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;