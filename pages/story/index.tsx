import { CheckCircle, Users, Globe, Lightbulb, Shield, Target } from 'lucide-react';

const AboutPage = () => {
  const goals = [
    {
      icon: Target,
      title: 'Empowering Clients',
      description: 'To provide tailored guidance that helps investors and families make informed decisions and achieve their real estate aspirations.',
    },
    {
      icon: CheckCircle,
      title: 'Enhancing Experiences',
      description: 'To deliver a hassle-free, efficient, and enjoyable real estate journey for all stakeholders.',
    },
    {
      icon: Globe,
      title: 'Fostering Diversity',
      description: 'To leverage our multicultural team to connect with clients worldwide and provide unique, localized insights.',
    },
    {
      icon: Lightbulb,
      title: 'Innovating Solutions',
      description: 'To integrate advanced technology and market expertise into every service we offer, ensuring cutting-edge solutions.',
    },
    {
      icon: Shield,
      title: 'Building Trust',
      description: 'To maintain the highest standards of professionalism and integrity in all our interactions.',
    },
  ];

  const stats = [
    { number: '15+', label: 'Years of Excellence' },
    { number: '22+', label: 'Nationalities' },
    { number: '45+', label: 'Languages Spoken' },
    { number: '1000+', label: 'Happy Clients' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            Driving Excellence in Dubai Real Estate
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
            Your trusted partner in finding the perfect property
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 leading-relaxed mb-6">
              At the crux of our business is our relentless dedication to providing hassle-free, tailored real estate advice and consultancy for investors and families alike, helping them find their perfect property. Whether it's a dream home or a smart investment, we are here to make the process seamless and rewarding.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Established in 2008, Roar Realty is a leading real estate agency in Dubai with a strong focus on transparency, honesty, and professionalism. Over the years, we have expanded our services to not only help you buy or lease a property but also manage your assets, secure financing options, and even find the perfect holiday home.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We take immense pride in our diverse and dynamic team. Representing over 22 nationalities and speaking more than 45 languages, our team is equipped to address property-related questions and deliver personalized solutions to a global clientele.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-3xl md:text-4xl font-semibold text-blue-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Goals Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">Our Goals</h2>
            <div className="space-y-6">
              {goals.map((goal, index) => {
                const Icon = goal.icon;
                return (
                  <div key={index} className="flex gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {goal.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Commitment Section */}
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12 mb-16 border border-blue-100">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We believe in not just meeting expectations but exceeding them. With a proven track record and a comprehensive portfolio of services, we aim to redefine the real estate experience in Dubai. Our mission is to make property ownership and investment accessible, transparent, and rewarding for everyone we serve.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Choose Roar Realty for a partner who prioritizes your goals and delivers exceptional results, every time.
            </p>
          </div>

          {/* CEO Section */}
          <div className="flex items-center gap-6 p-8 bg-white border border-gray-200 rounded-xl">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center">
                <img src="https://res.cloudinary.com/dfmpb2aii/image/upload/v1756120536/uploads/co1rDum2Gp-1000003472.jpg.jpg" alt="Ceo" className="w-full h-full object-cover rounded-full"/>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Anurag Pandey</h3>
              <p className="text-blue-900 font-medium">CEO & Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Let our expert team guide you through Dubai's luxury real estate market
          </p>
          <button className="bg-white text-blue-900 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all">
            Get In Touch Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;