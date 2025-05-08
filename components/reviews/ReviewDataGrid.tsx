// components/reviews/ReviewDataGrid.tsx
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Review {
  _id: string;
  productId: string;
  productName?: string; // Added for better display
  userId?: string;
  userName?: string; // Added
  clerkId?: string;
  text: string;
  rating: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  sentimentScore?: number; // Added for confidence display
  createdAt: string;
  emoji?: string;
  status?: 'approved' | 'pending' | 'flagged'; // Added for moderation
}

export default function ReviewDataGrid() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  // Enhanced sentiment analysis with confidence levels
  const getSentiment = (review: Review) => {
    if (review.sentiment) return {
      label: review.sentiment,
      score: review.sentimentScore || 
             (review.rating >= 4 ? 0.8 : 
              review.rating <= 2 ? 0.2 : 0.5)
    };
    
    return {
      label: review.rating >= 4 ? 'positive' : 
             review.rating <= 2 ? 'negative' : 'neutral',
      score: review.rating / 5 // Simple score approximation
    };
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
        {i < rating ? '★' : '☆'}
      </span>
    ));
  };

  const toggleSelectReview = (id: string) => {
    setSelectedReviews(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleExpandReview = (id: string) => {
    setExpandedReview(prev => prev === id ? null : id);
  };

  const runSentimentAnalysis = async (ids?: string[]) => {
    try {
      // This would call your sentiment analysis API
      console.log('Analyzing reviews:', ids || 'all');
      // In a real implementation, you'd update the reviews state
    } catch (err) {
      console.error("Analysis error:", err);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (!res.ok) throw new Error('Failed to fetch reviews');
        
        const data = await res.json();
        const processed = data.reviews.map((r: any) => ({
          ...r,
          productName: r.productName || `Product ${r.productId.slice(0, 4)}`, // Fallback
          userName: r.userName || 'Anonymous',
          sentiment: r.sentiment || getSentiment(r).label,
          sentimentScore: r.sentimentScore || getSentiment(r).score,
          status: r.status || 'approved'
        }));
        
        setReviews(processed);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <select className="border rounded px-3 py-1 text-sm">
            <option>All Status</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Flagged</option>
          </select>
          <input 
            type="text" 
            placeholder="Search reviews..." 
            className="border rounded px-3 py-1 text-sm w-64"
          />
        </div>
        
        <div className="flex space-x-2">
          {selectedReviews.length > 0 && (
            <>
              <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm">
                Approve ({selectedReviews.length})
              </button>
              <button className="bg-red-50 text-red-600 px-3 py-1 rounded text-sm">
                Delete ({selectedReviews.length})
              </button>
            </>
          )}
          <button 
            onClick={() => runSentimentAnalysis()}
            className="bg-purple-50 text-purple-600 px-3 py-1 rounded text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Analyze Sentiment
          </button>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                <input 
                  type="checkbox" 
                  className="rounded"
                  checked={selectedReviews.length === reviews.length}
                  onChange={() => {
                    if (selectedReviews.length === reviews.length) {
                      setSelectedReviews([]);
                    } else {
                      setSelectedReviews(reviews.map(r => r._id));
                    }
                  }}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                Review
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sentiment
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <>
                <tr key={review._id} className={`hover:bg-gray-50 ${
                  review.status === 'flagged' ? 'bg-red-50' : 
                  review.status === 'pending' ? 'bg-yellow-50' : ''
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedReviews.includes(review._id)}
                      onChange={() => toggleSelectReview(review._id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <span className="truncate max-w-[120px]">
                        {review.productName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {review.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-xs text-gray-500">{review.rating}/5</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div 
                      className={`cursor-pointer ${expandedReview === review._id ? '' : 'line-clamp-2'}`}
                      onClick={() => toggleExpandReview(review._id)}
                    >
                      {review.text}
                      {review.emoji && <span className="ml-2">{review.emoji}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        getSentiment(review).label === 'positive' ? 'bg-green-100 text-green-800' :
                        getSentiment(review).label === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getSentiment(review).label}
                      </span>
                      <div 
                        className="ml-2 w-16 bg-gray-200 rounded-full h-1.5"
                        title={`Confidence: ${Math.round(getSentiment(review).score * 100)}%`}
                      >
                        <div 
                          className={`h-1.5 rounded-full ${
                            getSentiment(review).label === 'positive' ? 'bg-green-500' :
                            getSentiment(review).label === 'negative' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`} 
                          style={{ width: `${getSentiment(review).score * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(review.createdAt), 'MMM d, yyyy')}
                    <div className="text-xs text-gray-400">
                      {format(new Date(review.createdAt), 'h:mm a')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => console.log('Reply to', review._id)}
                      >
                        Reply
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => console.log('Delete', review._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded detail view */}
                {expandedReview === review._id && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <h4 className="font-medium mb-2">Full Review</h4>
                          <p className="whitespace-pre-wrap bg-white p-3 rounded border">
                            {review.text}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Analysis</h4>
                          <div className="bg-white p-3 rounded border space-y-2">
                            <div>
                              <span className="text-sm text-gray-500">Sentiment Confidence:</span>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    getSentiment(review).label === 'positive' ? 'bg-green-500' :
                                    getSentiment(review).label === 'negative' ? 'bg-red-500' :
                                    'bg-yellow-500'
                                  }`} 
                                  style={{ width: `${getSentiment(review).score * 100}%` }}
                                ></div>
                              </div>
                              <div className="text-right text-xs text-gray-500">
                                {Math.round(getSentiment(review).score * 100)}%
                              </div>
                            </div>
                            
                            <div>
                              <button 
                                className="text-sm text-blue-600 hover:underline"
                                onClick={() => runSentimentAnalysis([review._id])}
                              >
                                Re-analyze this review
                              </button>
                            </div>
                            
                            <div className="pt-2 border-t">
                              <h5 className="text-sm font-medium">Suggested Reply</h5>
                              <p className="text-sm mt-1 italic text-gray-600">
                                "Thank you for your {review.rating >= 4 ? 'positive' : 'constructive'} feedback!"
                              </p>
                              <button className="text-xs text-blue-600 mt-1 hover:underline">
                                Generate AI Response
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination would go here */}
    </div>
  );
}

// Helper components (would typically be in separate files)
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">Error loading reviews: {message}</p>
        </div>
      </div>
    </div>
  );
}
