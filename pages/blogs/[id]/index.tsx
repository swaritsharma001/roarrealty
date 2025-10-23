import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Calendar, Eye, Share2, Link as LinkIcon } from 'lucide-react';
import Head from 'next/head';
import DOMPurify from 'isomorphic-dompurify';

export async function getServerSideProps(context) {
  const { id } = context.params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/blog/${id}`);
    
    if (!response.ok) {
      return { notFound: true };
    }
    
    const blog = await response.json();
    
    return {
      props: {
        blog,
        id
      }
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return { notFound: true };
  }
}


export default function SingleBlogPage({ blog, id }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const stripHtml = (html) => {
    const tmp = typeof document !== 'undefined' && document.createElement('div');
    if (tmp) {
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    }
    return html.replace(/<[^>]*>/g, '');
  };

  const sanitizedDescription = DOMPurify.sanitize(blog.description, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'img', 'span', 'div', 'figure'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'width', 'height']
  });

  const metaDescription = stripHtml(blog.description).slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://yourdomain.com/blogs/${id}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.Title,
          text: metaDescription,
          url: pageUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Head>
        <title>{blog.Title} | Your Blog Name</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${blog.types || 'blog'}, articles, insights`} />
        
        <meta property="og:title" content={blog.Title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={blog.cover} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={blog.createdAt} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.Title} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={blog.cover} />
        
        <link rel="canonical" href={pageUrl} />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": blog.Title,
              "image": blog.cover,
              "datePublished": blog.createdAt,
              "description": metaDescription,
              "author": {
                "@type": "Organization",
                "name": "Your Blog Name"
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <header className="mb-8">
            {blog.types && (
              <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
                {blog.types}
              </span>
            )}
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight break-words">
              {blog.Title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm pb-6 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <time dateTime={blog.createdAt}>
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              
              {blog.views !== undefined && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>{blog.views.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </header>

          <figure className="mb-10 -mx-4 sm:mx-0">
            <div className="relative overflow-hidden rounded-none sm:rounded-2xl shadow-lg aspect-video bg-gray-200">
              <img
                src={blog.cover}
                alt={blog.Title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </figure>

          {/* ✅ FULLY CLEANED - No image/heading overrides */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />

          {/* ✅ Custom Styling for Blog Content */}
          <style jsx global>{`
            /* Preserve all inline styles and colors */
            .prose * {
           
            }
            
            /* Headings - Natural sizes preserved */
            .prose h1 { font-size: 2.25em; font-weight: 800; margin: 1.5em 0 0.5em; }
            .prose h2 { font-size: 1.875em; font-weight: 700; margin: 1.3em 0 0.5em; }
            .prose h3 { font-size: 1.5em; font-weight: 600; margin: 1.2em 0 0.5em; }
            .prose h4 { font-size: 1.25em; font-weight: 600; margin: 1em 0 0.5em; }
            .prose h5 { font-size: 1.125em; font-weight: 600; margin: 0.8em 0 0.5em; }
            .prose h6 { font-size: 1em; font-weight: 600; margin: 0.8em 0 0.5em; }
            
            /* Paragraphs */
            .prose p { 
              line-height: 1.75; 
              margin-bottom: 1.25em; 
              word-wrap: break-word;
            }
            
            /* Images - Full width with proper styling */
            .prose img {
              width: 100% !important;
              height: auto !important;
              max-width: 100% !important;
              border-radius: 0.75rem;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
              margin: 2rem 0 !important;
              display: block;
            }
            
            .prose figure {
              width: 100% !important;
              margin: 2rem 0 !important;
            }
            
            .prose figure img {
              width: 100% !important;
              margin: 0 !important;
            }
            
            /* Links */
            .prose a {
              color: #2563eb;
              text-decoration: underline;
              text-decoration-color: #93c5fd;
              word-wrap: break-word;
            }
            
            .prose a:hover {
              text-decoration-color: #2563eb;
            }
            
            /* Lists */
            .prose ul { list-style: disc; padding-left: 1.5em; margin: 1.25em 0; }
            .prose ol { list-style: decimal; padding-left: 1.5em; margin: 1.25em 0; }
            .prose li { line-height: 1.75; margin: 0.5em 0; }
            
            /* Strong/Bold */
            .prose strong { font-weight: 600; }
            
            /* Blockquotes */
            .prose blockquote {
              border-left: 2px solid #3b82f6;
              padding-left: 1rem;
              background: #f3f4f6;
            }
            
            /* Code blocks */
            .prose code {
              background: #f3f4f6;
              color: #db2777;
              padding: 0.2em 0.4em;
              border-radius: 0.25rem;
              font-size: 0.875em;
              word-wrap: break-word;
            }
            
            .prose pre {
              background: #1f2937;
              color: #f3f4f6;
              padding: 1.5rem;
              border-radius: 0.75rem;
              overflow-x: auto;
              margin: 1.5rem 0;
            }
            
            .prose pre code {
              background: transparent;
              color: inherit;
              padding: 0;
            }
            
            /* Tables */
            .prose table { 
              border-collapse: collapse; 
              width: 100%; 
              margin: 1.5rem 0;
            }
            .prose th { 
              background: #f3f4f6; 
              padding: 0.75rem; 
              text-align: left;
              border: 1px solid #e5e7eb;
            }
            .prose td { 
              border: 1px solid #e5e7eb; 
              padding: 0.75rem; 
            }
            
            /* Horizontal rule */
            .prose hr {
              border: none;
              border-top: 1px solid #d1d5db;
              margin: 2rem 0;
            }
          `}</style>
        </article>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share this article</h3>
            <div className="flex flex-wrap gap-3">
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              )}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
              >
                <LinkIcon className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}