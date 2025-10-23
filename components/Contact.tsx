import { useState, useEffect } from 'react';
import { MessageCircle, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'English',
    message: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [page, setPage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Fixed: Made async and added error handling
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page`);
        if (response.ok) {
          const data = await response.json();
          setPage(data);
        } else {
          console.error('Failed to fetch page data');
        }
      } catch (error) {
        console.error('Error fetching page data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, []);

  // Added validation function
  const validateForm = () => {
    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'Please enter your full name.' });
      return false;
    }
    if (!formData.email.trim()) {
      setStatus({ type: 'error', message: 'Please enter your email address.' });
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return false;
    }
    if (!formData.phone.trim()) {
      setStatus({ type: 'error', message: 'Please enter your phone number.' });
      return false;
    }
    if (!formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please enter your message.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      console.log("Submitting contact form with data:", formData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/contactUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok && data.success) {
        setStatus({ type: 'success', message: "Thank you! We'll get back to you soon." });
        setFormData({ name: '', email: '', phone: '', language: 'English', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      setStatus({ type: 'error', message: 'Unable to submit. Please check your internet connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-orange-100 rounded-2xl mb-4">
            <MessageCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Speak with our Real Estate specialists today
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Get in touch for tailored guidance from our expert team. We're committed to assisting you through each phase of your journey.
          </p>
        </div>

        {/* Fixed: Added loading state and null check */}
        {!isLoading && page?.BuyPhone && (
          <div className="flex justify-center mb-8">
            <a
              href={`https://wa.me/${page.BuyPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-base font-semibold">Chat on WhatsApp</span>
            </a>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          {status.message && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
              status.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {status.type === 'success'
                ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                : <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />}
              <p className={`text-sm font-medium ${status.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {status.message}
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField 
              label="Full Name *" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Enter your full name"
              required 
            />
            <InputField 
              label="Email Address *" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="your.email@example.com" 
              type="email"
              required 
            />
            <InputField 
              label="Phone Number *" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+91 8282828282"
              required 
            />

            <div>
              <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Language *
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              >
                <option value="English">English</option>
                <option value="Arabic">Arabic</option>
                <option value="Hindi">Hindi</option>
                <option value="Urdu">Urdu</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your requirements..."
                rows={5}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Request</span>
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            We respect your privacy and will never share your information.
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, id, name, value, onChange, placeholder, type = 'text', required = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
    />
  </div>
);

export default ContactForm;