import axios from 'axios';

// Use the proxy configured in vite.config.ts
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://127.0.0.1:3451';

export const getRecommend = async (problem_no: string | undefined, limit: number = 10) => {
  try {
    let problemId = problem_no || '1'; // Default to problem 1 if not provided
    
    // Validate the problem number
    if (problem_no && !/^\d+$/.test(problem_no)) {
      throw new Error(`Invalid problem number: "${problem_no}". Please enter a valid number.`);
    }
    
    // Ensure limit is a valid number and within bounds
    limit = Math.min(Math.max(1, limit), 50);
    
    console.log(`API Request: ${API_BASE_URL}/recommendations/${problemId}?limit=${limit}`);
    
    const response = await axios.get(`${API_BASE_URL}/recommendations/${problemId}?limit=${limit}`);
    console.log(`Received ${response.data.length} recommendations`);
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching from API:', error);
    
    if (!error.response) {
      throw new Error(`Network error: Cannot connect to recommendation API server.`);
    } else if (error.response.status === 400) {
      throw new Error(`Invalid input: ${error.response?.data?.detail || 'Please enter a valid problem number'}`);
    } else {
      throw new Error(`API Error: ${error.response?.data?.detail || error.message}`);
    }
  }
};
