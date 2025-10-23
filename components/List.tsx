
import React from 'react';
import { Users, Home, TrendingUp, Building2, ArrowUpRight } from 'lucide-react';

export default function DubaiRealEstate() {
  const services = [
    {
      icon: Users,
      title: "Connect with a Specialist",
      description: "Access our dedicated team of over 400+ expert agents ready to assist you.",
      link: "/contact"
    },
    {
      icon: Home,
      title: "Know About Us",
      description: "Discover our journey, values, and commitment to delivering exceptional real estate solutions in Dubai.",
      link: "/story"
    },
    {
      icon: Building2,
      title: "Explore Dubai Projects",
      description: "Browse and find your ideal property from our extensive portfolio of Dubai projects.",
      link: "/properties"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 leading-tight">
          Dubai real estate solutions focused around excellent customer service.
        </h1>

        <div className="space-y-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <a
                key={index}
                href={service.link}
                className="group block bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-blue-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                        {service.title}
                      </h2>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}