
import React, { useState, useCallback } from 'react';
import { SuggestedName } from './types';
import { generateNamingSuggestions } from './services/geminiService';
import SuggestionCard from './components/SuggestionCard';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [vietnameseDescription, setVietnameseDescription] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SuggestedName[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchSuggestions = useCallback(async () => {
    if (!vietnameseDescription.trim()) {
      setError("Please enter a description in Vietnamese.");
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestions([]); // Clear previous suggestions

    try {
      const fetchedSuggestions = await generateNamingSuggestions(vietnameseDescription);
      if (fetchedSuggestions.length === 0 && vietnameseDescription.trim()) {
        setError("No suggestions found for this description. Try being more specific or rephrasing.");
      }
      setSuggestions(fetchedSuggestions);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      console.error("Error fetching suggestions:", err);
    } finally {
      setIsLoading(false);
    }
  }, [vietnameseDescription]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFetchSuggestions();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <header className="my-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            AI Variable Namer <span role="img" aria-label="robot emoji">🤖</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Get English variable name suggestions based on your Vietnamese descriptions.
          </p>
        </header>

        <main className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Enter Vietnamese Description (Ý nghĩa tên biến/hằng):
              </label>
              <textarea
                id="description"
                value={vietnameseDescription}
                onChange={(e) => setVietnameseDescription(e.target.value)}
                placeholder="Ví dụ: biến lưu trữ tuổi của người dùng..."
                rows={4}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner /> <span className="ml-2">Generating...</span>
                </>
              ) : (
                "Suggest Names"
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {suggestions.length > 0 && !isLoading && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Suggested Names:</h2>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <SuggestionCard key={index} suggestion={suggestion} />
                ))}
              </div>
            </div>
          )}
          
          {!isLoading && !error && suggestions.length === 0 && vietnameseDescription && (
             <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 rounded-md text-center">
                <p>No suggestions generated. Try a different description or check if the API key is correctly configured if errors persist across various inputs.</p>
             </div>
          )}

        </main>
        
        <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Powered by Google Gemini API.</p>
          <p>Ensure your <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">API_KEY</code> environment variable is set for the Gemini service to function.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
