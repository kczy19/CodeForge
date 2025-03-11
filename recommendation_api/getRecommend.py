from fastapi import FastAPI, HTTPException, Query # type: ignore
import pandas as pd # type: ignore
from pathlib import Path
from typing import List
from pydantic import BaseModel # type: ignore
from sklearn.feature_extraction.text import TfidfVectorizer # type: ignore
from sklearn.metrics.pairwise import cosine_similarity # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import traceback

# Constants
ACCEPTANCE_WEIGHT = 0.3
ENGAGEMENT_WEIGHT = 0.5
SUBMISSION_WEIGHT = 0.2
SMOOTHING_FACTOR = 100000

# Load dataset
current_directory = Path(__file__).resolve().parent
csv_file_path = current_directory / "preprocessed_data.csv"

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextProcessor:
    def __init__(self, text_data):
        self.text_data = text_data
        self.text_preprocessor = TfidfVectorizer(stop_words ='english')

    def preprocess_text_data(self):
        self.text_data.fillna('', inplace=True)
        return self.text_preprocessor.fit_transform(self.text_data)

class PopularityCalculator:
    def __init__(self, acceptance, engagement, submission):
        self.acceptance = acceptance
        self.engagement = engagement
        self.submission = submission

    def calculate_engagement_score(self):
        total_engagement = self.acceptance.fillna(0) + self.engagement.fillna(0) + SMOOTHING_FACTOR
        max_engagement = total_engagement.max()
        return total_engagement / max_engagement

    def normalize_series(self, series):
        return (series - series.min()) / (series.max() - series.min())

    def calculate_popularity_score(self):
        return (
            self.normalize_series(self.acceptance) * ACCEPTANCE_WEIGHT +
            self.normalize_series(self.engagement) * ENGAGEMENT_WEIGHT +
            self.normalize_series(self.submission) * SUBMISSION_WEIGHT
        )

class ProblemRecommender:
    @staticmethod
    def recommend_similar_problems(df, problem_id, X_processed, n=10):
        idx = df[df['id'] == problem_id].index
        if len(idx) == 0:
            return pd.DataFrame()  # Return empty DataFrame if problem_id is not found
        
        idx = idx[0]
        sim_scores = cosine_similarity(X_processed[idx], X_processed).flatten()
        
        # Get the indices sorted by similarity score (descending)
        sim_indices = sim_scores.argsort()[::-1]
        
        # Exclude the problem itself (which would be the most similar)
        sim_indices = sim_indices[sim_indices != idx]
        
        # Take only the top n
        sim_indices = sim_indices[:n]
        
        return df.iloc[sim_indices]

    @staticmethod
    def recommend_top_problems(df, n=10):
        # Make sure we don't try to return more rows than exist
        n = min(n, len(df))
        # Return the top n problems sorted by popularity score
        return df.sort_values(by='popularity_score', ascending=False).head(n)

class Problem(BaseModel):
    title: str
    difficulty: str
    topic_tags: str
    problem_URL: str

@app.get("/recommendations/{problem_id}", response_model=List[Problem])
async def recommender_system(problem_id: int = 1, limit: int = Query(10, ge=1, le=50, description="Number of recommendations to return")):
    try:
        # Log the request parameters
        print(f"Received request for problem_id={problem_id}, limit={limit}")
        
        # Validate problem_id
        if not isinstance(problem_id, int):
            try:
                problem_id = int(problem_id)
            except (ValueError, TypeError):
                raise HTTPException(status_code=400, detail="Problem ID must be an integer")
        
        # Load dataset
        try:
            df = pd.read_csv(csv_file_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail="Error loading problem dataset")
        
        df['topic_tags'] = df['topic_tags'].str.replace("'", "")
        
        # Return top problems if problem doesn't exist
        if problem_id not in df['id'].values:
            print(f"Problem ID {problem_id} not found. Returning {limit} top problems instead.")
            popularity_calculator = PopularityCalculator(df['acceptance'], df['likes'], df['submission'])
            df['popularity_score'] = popularity_calculator.calculate_popularity_score()
            top_problems = ProblemRecommender.recommend_top_problems(df, n=limit)
            recommendations = top_problems[['title', 'difficulty', 'topic_tags', 'problem_URL']].to_dict(orient="records")
            print(f"Returning {len(recommendations)} top problems")
            return recommendations
        
        # Generate recommendations
        text_processor = TextProcessor(df['problem_description'])
        X_processed = text_processor.preprocess_text_data()
        
        popularity_calculator = PopularityCalculator(df['acceptance'], df['likes'], df['submission'])
        df['popularity_score'] = popularity_calculator.calculate_popularity_score()
        
        # Make sure the limit is correctly used in both recommendation steps
        content_based_recommendations = ProblemRecommender.recommend_similar_problems(
            df, problem_id=problem_id, X_processed=X_processed, n=limit
        )
        
        # Use max available if we have fewer than requested
        actual_limit = min(limit, len(content_based_recommendations))
        popularity_based_recommendations = ProblemRecommender.recommend_top_problems(
            content_based_recommendations, n=actual_limit
        )
        
        recommendations = popularity_based_recommendations[['title', 'difficulty', 'topic_tags', 'problem_URL']].to_dict(orient="records")
        print(f"Returning {len(recommendations)} recommendations for problem {problem_id}")
        
        return recommendations
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@app.get("/")
async def root():
    return {"status": "API is running"}

if __name__ == "__main__":
    import uvicorn # type: ignore
    uvicorn.run(app, host="127.0.0.1", port=3451)
