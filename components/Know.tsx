
import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function PropertyManagement() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1400&h=500&fit=crop&crop=center"
            alt="Dubai Real Estate Investment Growth"
            className="w-full h-56 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-md relative overflow-hidden">
          {/* Decorative Element */}
          <div className="absolute bottom-0 right-0 w-48 h-48 opacity-5">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path
                d="M 20 100 Q 40 20, 100 40 T 180 100 Q 160 180, 100 160 T 20 100"
                fill="#f59e0b"
                stroke="#f59e0b"
                strokeWidth="3"
              />
            </svg>
          </div>

          <h1 className="text-2xl md:text-4xl font-semibold text-slate-900 mb-5 leading-snug relative z-10">
            Professional Property Management for Your Dubai Investment
          </h1>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 max-w-3xl relative z-10">
            Provident Real Estate handles every aspect of property management, from tenant screening and rent collection to maintenance and legal compliance. Our tailored approach ensures your property runs smoothly, delivering steady returns and long-term growth in Dubai's competitive market.
          </p>

          <button className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-7 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 relative z-10">
            <a href="/properties">
            Find out more
            </a>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}