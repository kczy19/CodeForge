import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { emitCreateRoom, emitJoinRoom } from '../services/socket';
import { Users, UserPlus } from 'lucide-react';

export default function Home() {
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [problemNumber, setProblemNumber] = useState('');
  const [recommendationCount, setRecommendationCount] = useState('10');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showRecommendationForm, setShowRecommendationForm] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    try {
      const newRoomId = await emitCreateRoom(userName);
      navigate(`/room/${newRoomId}`);
    } catch (error) {
      alert('Failed to create room. Please try again.');
    }
  };

  const handleJoinRoom = async () => {
    if (!userName.trim() || !roomId.trim()) {
      alert('Please enter both your name and room ID');
      return;
    }
    try {
      await emitJoinRoom(roomId, userName);
      navigate(`/room/${roomId}`);
    } catch (error) {
      alert('Failed to join room. Please check the room ID and try again.');
    }
  };

  const handleGetRecommendations = () => {
    if (problemNumber.trim()) {
      if (!/^\d+$/.test(problemNumber.trim())) {
        alert('Please enter a valid problem number (numbers only)');
        return;
      }
      
      let count = parseInt(recommendationCount);
      if (isNaN(count) || count < 1 || count > 50) {
        count = 10; // Default if invalid
      }
      
      navigate(`/recommendations/${problemNumber.trim()}?limit=${count}`);
    } else {
      let count = parseInt(recommendationCount);
      if (isNaN(count) || count < 1 || count > 50) {
        count = 10; // Default if invalid
      }
      
      navigate(`/recommendations?limit=${count}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">CodeForge</h1>
        
        {!showJoinForm && !showRecommendationForm ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateRoom}
              className="w-full bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <UserPlus size={20} />
              Create Room
            </button>
            <button
              onClick={() => setShowJoinForm(true)}
              className="w-full bg-gray-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
            >
              <Users size={20} />
              Join Room
            </button>
            <button
              onClick={() => setShowRecommendationForm(true)}
              className="w-full bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
            >
              Get Problem Recommendations
            </button>
          </div>
        ) : showJoinForm ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleJoinRoom}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-colors"
            >
              Join Room
            </button>
            <button
              onClick={() => setShowJoinForm(false)}
              className="w-full bg-gray-600 text-white p-3 rounded hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-medium mb-2">Get Problem Recommendations</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter a LeetCode problem number to get recommendations similar to that problem.
              Leave blank to get popular problems.
            </p>
            <input
              type="text"
              placeholder="Enter problem number (optional)"
              value={problemNumber}
              onChange={(e) => setProblemNumber(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Number of recommendations:</label>
              <input
                type="number"
                min="1"
                max="50"
                value={recommendationCount}
                onChange={(e) => setRecommendationCount(e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
              />
            </div>
            <button
              onClick={handleGetRecommendations}
              className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition-colors"
            >
              Get Recommendations
            </button>
            <button
              onClick={() => setShowRecommendationForm(false)}
              className="w-full bg-gray-600 text-white p-3 rounded hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}