import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HabitsPage from './components/Habits/HabitsPage';
import Home from './components/Home/Home';
import ProgressPage from './components/Progress/ProgressPage';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (

    <AuthProvider>
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;