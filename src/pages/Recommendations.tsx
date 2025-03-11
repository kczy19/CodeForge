import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getRecommend } from '../services/api';

// Define the type for recommendation data
interface Recommendation {
  title: string;
  difficulty: string;
  topic_tags: string;
  problem_URL: string;
}

export default function Recommendations() {
  const { problem_no } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get limit parameter from URL query string
  const getLimit = (): number => {
    const searchParams = new URLSearchParams(location.search);
    const limit = parseInt(searchParams.get('limit') || '10');
    return isNaN(limit) || limit < 1 || limit > 50 ? 10 : limit;
  };
  
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const limit = getLimit();
      console.log(`Fetching ${limit} recommendations for problem ${problem_no || 'popular'}`);
      
      const data = await getRecommend(problem_no, limit);
      setRecommendations(data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch recommendations.');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Validate problem number before fetching
    if (problem_no && !/^\d+$/.test(problem_no)) {
      setError(`Invalid problem number: "${problem_no}". Please enter a valid number.`);
      setLoading(false);
      return;
    }
    
    // Log that we're fetching with the current parameters
    console.log(`Effect triggered with problem_no: ${problem_no}, search: ${location.search}`);
    
    fetchRecommendations();
  }, [problem_no, location.search]); // Make sure to include location.search as a dependency

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Problem Recommendations</h1>
            {problem_no && (
              <p className="text-gray-600 mt-1">
                {getLimit()} recommendations for problem #{problem_no}
              </p>
            )}
            {!problem_no && (
              <p className="text-gray-600 mt-1">
                Showing {getLimit()} popular problems
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchRecommendations} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-center p-4 border border-red-200 rounded-lg mb-4">
            <p>{error}</p>
            <button 
              onClick={fetchRecommendations}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3">Loading recommendations...</span>
          </div>
        ) : !error && recommendations.length === 0 ? (
          <div className="text-center p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            No recommendations found.
          </div>
        ) : !error && (
          <div className="grid grid-cols-1 gap-6">
            {recommendations.map((item, index) => (
              <div key={index} className="border rounded-lg p-6 bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2">
                  <a 
                    href={item.problem_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {item.title}
                  </a>
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span 
                    className={`px-2 py-1 rounded-full text-sm ${
                      item.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                      item.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.difficulty}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Topics: {item.topic_tags}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
