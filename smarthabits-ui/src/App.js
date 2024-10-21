import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Habits from './components/Habits/Habits';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/habits" element={<Habits />} />
      </Routes>
    </Router>
  );
}

export default App;
