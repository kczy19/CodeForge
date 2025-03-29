import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home';
import Room from './pages/Room';
import Recommendations from './pages/Recommendations';

const GOOGLE_CLIENT_ID = '863904771657-adlnbpbi8c40j2f4mjpccl48m6elmt0o.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/recommendations/:problem_no" element={<Recommendations />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;