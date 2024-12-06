import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { emitCreateRoom, emitJoinRoom } from '../services/socket';
import { Users, UserPlus } from 'lucide-react';

export default function Home() {
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Code Battle</h1>
        
        {!showJoinForm ? (
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
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}