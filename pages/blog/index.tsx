
'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/allblogs`);
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Our Latest Blogs</h1>
          <p className="text-blue-100 text-base">
            Insights, updates, and stories from our team
          </p>
        </div>
      </div>

      {/* Blog List */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {currentBlogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            No blogs found
          </div>
        ) : (
          <div className="space-y-8">
            {currentBlogs.map((blog) => (
              <article key={blog._id} className="group">
                {/* Image */}
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={blog.cover}
                    alt={blog.Title}
                    className="w-full h-56 sm:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {blog.type && (
                    <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded">
                      {blog.type}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                    <a href={`/blogs/${blog.slug}`}>
                    {blog.Title}
                    </a>
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`min-w-[40px] h-10 rounded font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}