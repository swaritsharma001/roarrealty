import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, ChevronRight } from 'lucide-react';

interface JobPosting {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedDate: string;
  experience?: string;
  benefits?: string[];
  remote?: boolean;
  applyUrl?: string;
  contactEmail?: string;
}

interface CareersPageProps {
  jobs: JobPosting[];
}

const CareersPage = ({ jobs }: CareersPageProps) => {
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  const formatSalary = (job: JobPosting) => {
    if (job.salary) return job.salary;
    if (job.salaryMin && job.salaryMax) {
      return `AED ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Be part of Dubai's leading real estate agency. Build your career with us.
          </p>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-black mb-4">Open Positions</h2>
            <p className="text-gray-600">
              Explore exciting career opportunities at Roar Realty ({jobs.length} {jobs.length === 1 ? 'position' : 'positions'} available)
            </p>
          </div>

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white border-2 border-black rounded-lg p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  {/* Job Title */}
                  <h3 className="text-2xl font-bold text-black mb-3">{job.title}</h3>
                  
                  {/* Job Meta */}
                  <div className="space-y-2 mb-4">
                    {job.department && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm font-medium">{job.department}</span>
                      </div>
                    )}
                    {job.location && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {job.location}
                          {job.remote && ' • Remote'}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{job.type}</span>
                    </div>
                    {formatSalary(job) && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-medium">{formatSalary(job)}</span>
                      </div>
                    )}
                  </div>

                  {/* Experience Badge */}
                  {job.experience && (
                    <div className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {job.experience} experience
                    </div>
                  )}

                  {/* Description Preview */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  {/* View Details Button */}
                  <button className="flex items-center gap-2 text-black font-semibold hover:gap-3 transition-all">
                    View Details
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-black rounded-lg">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-black mb-2">No Open Positions</h3>
              <p className="text-gray-600">
                Check back later for new opportunities
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Join Roar Realty?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-black">01</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Career Growth</h3>
              <p className="text-gray-300">
                Continuous learning and development opportunities to advance your career
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-black">02</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Competitive Benefits</h3>
              <p className="text-gray-300">
                Attractive salary packages with performance-based incentives
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-black">03</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Dynamic Team</h3>
              <p className="text-gray-300">
                Work with talented professionals from over 22 nationalities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedJob(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-black mb-4">{selectedJob.title}</h2>
                <div className="flex flex-wrap gap-4">
                  {selectedJob.department && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm font-medium">{selectedJob.department}</span>
                    </div>
                  )}
                  {selectedJob.location && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {selectedJob.location}
                        {selectedJob.remote && ' • Remote'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{selectedJob.type}</span>
                  </div>
                  {formatSalary(selectedJob) && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">{formatSalary(selectedJob)}</span>
                    </div>
                  )}
                </div>
                {selectedJob.experience && (
                  <div className="mt-3">
                    <span className="inline-block bg-black text-white text-sm font-semibold px-3 py-1 rounded-full">
                      Experience Required: {selectedJob.experience}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black mb-3">About the Role</h3>
                <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Responsibilities */}
              {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-black mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2">
                    {selectedJob.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-black mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-black mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-black mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-black mb-3">Benefits</h3>
                  <ul className="space-y-2">
                    {selectedJob.benefits.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-black mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact Info */}
              {selectedJob.contactEmail && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Contact:</span> {selectedJob.contactEmail}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {selectedJob.applyUrl ? (
                  <a
                    href={selectedJob.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors text-center"
                  >
                    Apply Now
                  </a>
                ) : selectedJob.contactEmail ? (
                  <a
                    href={`mailto:${selectedJob.contactEmail}?subject=Application for ${selectedJob.title}`}
                    className="flex-1 bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors text-center"
                  >
                    Apply via Email
                  </a>
                ) : (
                  <button className="flex-1 bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
                    Apply Now
                  </button>
                )}
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="flex-1 border-2 border-black text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    
    // Fetch jobs from your API
    const response = await fetch(`${baseUrl}/page/careers`);
    
    if (!response.ok) {
      console.error(`Failed to fetch careers: ${response.status}`);
      return {
        props: {
          jobs: [],
        },
      };
    }

    const data = await response.json();

    return {
      props: {
        jobs: data.jobs || [],
      },
    };
  } catch (error) {
    console.error('Error fetching careers data:', error);
    return {
      props: {
        jobs: [],
      },
    };
  }
};

export default CareersPage;