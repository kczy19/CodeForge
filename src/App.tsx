import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import Recommendations from './pages/Recommendations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/recommendations/:problem_no" element={<Recommendations />} />
      </Routes>
    </Router>
  );
}

export default App;