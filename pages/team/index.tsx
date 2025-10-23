import { GetServerSideProps } from 'next';
import { Mail, Phone, Globe } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  img: string;
  bio: string;
}

interface TeamPageProps {
  teamMembers: TeamMember[];
}

const TeamPage = ({ teamMembers }: TeamPageProps) => {
  const getLanguages = (member: TeamMember) => {
    return ['English', 'Arabic'];
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Our Expert Team
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Our diverse team of professionals is dedicated to helping you find your perfect property in Dubai
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {teamMembers.map((member) => (
                <div
                  key={member._id}
                  className="group bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center"
                >
                  {/* Circular Image */}
                  <div className="flex justify-center">
                    <div className="relative w-32 h-32">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-32 h-32 object-cover rounded-full border-4 border-blue-700 shadow-md transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/10 to-transparent"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-5">
                    <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-blue-700 font-medium mb-4">{member.role}</p>

                    {member.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {member.bio}
                      </p>
                    )}

                    {/* Languages */}
                    <div className="mb-4">
                      <div className="flex justify-center items-center gap-2 text-sm text-gray-600 mb-2">
                        🌐 <span className="font-medium">Languages:</span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {getLanguages(member).map((lang, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-900 text-xs font-medium rounded-md"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center justify-center gap-2">
                        📧
                        <a
                          href={`mailto:${member.email}`}
                          className="hover:text-blue-700 transition-colors truncate"
                        >
                          {member.email}
                        </a>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        📞
                        <a
                          href={`tel:${member.phone}`}
                          className="hover:text-blue-700 transition-colors"
                        >
                          {member.phone}
                        </a>
                      </div>
                    </div>

                    {/* Contact Button */}
                    <button className="w-full mt-6 bg-blue-900 hover:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all">
                      <a href={`mailto:${member.email}`}>
                        Contact {member.name.split(' ')[0]}
                      </a>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No team members found.
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ['22+', 'Nationalities'],
              ['45+', 'Languages'],
              ['15+', 'Years Experience'],
              ['100%', 'Client Satisfaction'],
            ].map(([num, label]) => (
              <div className="text-center" key={label}>
                <div className="text-3xl font-bold text-blue-900 mb-2">{num}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Get in touch with our team today and let us help you find your dream property
          </p>
          <button className="bg-white text-blue-900 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all">
            Contact Our Team
          </button>
        </div>
      </section>
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!baseUrl) {
      console.error('API URL not configured');
      return {
        props: {
          teamMembers: [],
        },
      };
    }

    const response = await fetch(`${baseUrl}/team`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch team data: ${response.status}`);
    }

    const teamMembers = await response.json();

    return {
      props: {
        teamMembers: teamMembers || [],
      },
    };
  } catch (error) {
    console.error('Error fetching team data:', error);
    return {
      props: {
        teamMembers: [],
      },
    };
  }
};

export default TeamPage;