"use client"
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
//contact form
  import ContactForm from "@/components/Contact.tsx" 
interface PageData {
  Address: string;
  PhoneNumber: string;
  primaryEmail: string;
  supportEmail: string;
  Facebook: string;
  Instagram: string;
  LinkedIn: string;
  Twitter: string;
  BuyPhone: string;
}

interface ContactPageProps {
  pageData: PageData;
}

const ContactPage = ({ pageData }: ContactPageProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+971',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Add your form submission logic here
    console.log('Form submitted:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for contacting us! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        countryCode: '+971',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            Get In Touch
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            We're here to help you find your dream property. Reach out to us today.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Address Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Address</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                     <p>1507, AL MANARA TOWER</p>
                     <p>BUSINESS BAY</p>
                      <p>UNITED ARAB EMIRATES</p>
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                    <a 
                      href={`tel:${pageData.PhoneNumber}`}
                      className="text-blue-900 hover:text-blue-700 text-sm font-medium block mb-1"
                    >
                      {pageData.PhoneNumber}
                    </a>
                    {pageData.BuyPhone && pageData.BuyPhone !== pageData.PhoneNumber && (
                      <a 
                        href={`tel:${pageData.BuyPhone}`}
                        className="text-blue-900 hover:text-blue-700 text-sm font-medium block"
                      >
                        {pageData.BuyPhone}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                    <a 
                      href={`mailto:${pageData.primaryEmail}`}
                      className="text-blue-900 hover:text-blue-700 text-sm font-medium block mb-1"
                    >
                      {pageData.primaryEmail}
                    </a>
                    {pageData.supportEmail && (
                      <a 
                        href={`mailto:${pageData.supportEmail}`}
                        className="text-blue-900 hover:text-blue-700 text-sm font-medium block"
                      >
                        {pageData.supportEmail}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Working Hours</h3>
                    <p className="text-gray-600 text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM<br/>
                      Saturday: 10:00 AM - 4:00 PM<br/>
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {pageData.Facebook && pageData.Facebook !== 'NO NEED TO FEEL' && (
                    <a 
                      href={pageData.Facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {pageData.Instagram && (
                    <a 
                      href={pageData.Instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {pageData.LinkedIn && (
                    <a 
                      href={pageData.LinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {pageData.Twitter && (
                    <a 
                      href={pageData.Twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-white" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm/>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.537329084522!2d55.2739!3d25.1891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6821c07e03c7%3A0x82c25b7c2a65f9ea!2sAl%20Manara%20Tower%2C%20Business%20Bay%20-%20Dubai!5e0!3m2!1sen!2sae!4v1703123456789!5m2!1sen!2sae"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
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
          pageData: {
            Address: 'Dubai, UAE',
            PhoneNumber: '+971 58 500 5438',
            primaryEmail: 'info@roarrealty.ae',
            supportEmail: 'support@roarrealty.ae',
            Facebook: '',
            Instagram: '',
            LinkedIn: '',
            Twitter: '',
            BuyPhone: '',
          },
        },
      };
    }

    const response = await fetch(`${baseUrl}/page`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page data: ${response.status}`);
    }

    const pageData = await response.json();

    return {
      props: {
        pageData: {
          Address: pageData.Address || 'Dubai, UAE',
          PhoneNumber: pageData.PhoneNumber || '+971 58 500 5438',
          primaryEmail: pageData.primaryEmail || 'info@roarrealty.ae',
          supportEmail: pageData.supportEmail || 'support@roarrealty.ae',
          Facebook: pageData.Facebook || '',
          Instagram: pageData.Instagram || '',
          LinkedIn: pageData.LinkedIn || '',
          Twitter: pageData.Twitter || '',
          BuyPhone: pageData.BuyPhone || '',
        },
      },
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return {
      props: {
        pageData: {
          Address: 'Dubai, UAE',
          PhoneNumber: '+971 58 500 5438',
          primaryEmail: 'info@roarrealty.ae',
          supportEmail: 'support@roarrealty.ae',
          Facebook: '',
          Instagram: '',
          LinkedIn: '',
          Twitter: '',
          BuyPhone: '',
        },
      },
    };
  }
};

export default ContactPage;