
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsItem {
  _id: string;
  Title: string;
  description: string;
  cover: string;
  createdAt: string;
  types: string;
  slug: string;
  TotalViews: number;
}

interface BlogResponse {
  blogs: NewsItem[];
  totalLength: number;
}

const NewsInsights = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/blog/allblogs`);

        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const data: BlogResponse = await response.json();
        setNewsItems(data.blogs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blogs');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? newsItems.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Latest News & Insights
            </h2>
            <p className="text-gray-600 text-lg">Stay updated with Dubai's real estate market</p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-64 md:h-96 bg-gray-300"></div>
                <div className="p-8 md:p-10">
                  <div className="h-8 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Latest News & Insights
            </h2>
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // No blogs state
  if (newsItems.length === 0) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Latest News & Insights
            </h2>
            <p className="text-gray-600 text-lg">No blogs available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentBlog = newsItems[currentIndex];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Latest News & Insights
          </h2>
          <p className="text-gray-600 text-lg">Stay updated with Dubai's real estate market</p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative h-64 md:h-auto bg-gradient-to-br from-blue-900 to-blue-700">
                {/* Category Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-lg">
                    {currentBlog.types || 'News'}
                  </span>
                </div>

                <img
                  src={currentBlog.cover}
                  alt={currentBlog.Title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight line-clamp-3">
                    {currentBlog.Title}
                  </h3>
                  <p className="text-gray-500 text-base mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {currentBlog.createdAt}
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex gap-3">
                    <button
                      onClick={goToPrevious}
                      className="w-12 h-12 bg-gray-100 hover:bg-orange-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="w-12 h-12 bg-gray-100 hover:bg-orange-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Dot Indicators */}
                  <div className="flex gap-2">
                    {newsItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? 'w-8 bg-orange-600'
                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More Insights Button */}
        <div className="mt-10 text-center">
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-12 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg">
            <a href="/blog">Explore More Insights →</a>
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsInsights;