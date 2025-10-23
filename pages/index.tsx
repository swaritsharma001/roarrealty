import { useState } from "react"
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { PropertyFilters } from "@/components/PropertyFilters"
import { PropertyCard } from "@/components/PropertyCard"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { ArrowRight, Star, Users, Award, CheckCircle, Mail, Phone } from "lucide-react"
import CurvedLoop from "@/components/ui/CurvedLoop.tsx"
import ContactForm from "@/components/Contact"
import NewsInsights from "@/components/News"
import Cookies from "js-cookie"
import { useEffect } from "react"
import DubaiRealEstate from "@/components/List"
import PropertyManagement from "@/components/Know"
interface PropertyData {
  id: string
  title: string
  price: string
  location: string
  bedrooms: number
  bathrooms: number
  area: string
  image: string
  type: string
  featured: boolean
  status: string
  sale_status: string
  developer: string
}

interface FilterState {
  location: string
  minPrice: string
  maxPrice: string
  propertyType: string
  status: string
  sale_status: string
  area: string
  developer: string
}

interface HomeProps {
  initialPageData: any
  initialTeamMembers: any[]
  initialFeaturedProperties: PropertyData[]
  seoData: {
    title: string
    description: string
    keywords: string
    canonicalUrl: string
    structuredData: any
  }
}


const Home = ({ initialPageData, initialTeamMembers, initialFeaturedProperties, seoData }: HomeProps) => {
  const router = useRouter()
  const [featuredProperties] = useState<PropertyData[]>(initialFeaturedProperties)
  const [page] = useState<any>(initialPageData)
  const [teamMembers] = useState<any[]>(initialTeamMembers)
  
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const saved = Cookies.get("selectedCurrency")
    return saved ? JSON.parse(saved) : { code: "AED", name: "UAE Dirham", flag: "🇦🇪", rate: 1 }
  })

  const exchangeRates = {
    AED: { code: "AED", name: "UAE Dirham", flag: "🇦🇪", rate: 1 },
    INR: { code: "INR", name: "India", flag: "🇮🇳", rate: 22.5 },
    GBP: { code: "GBP", name: "United Kingdom", flag: "🇬🇧", rate: 0.21 },
    SAR: { code: "SAR", name: "Saudi Arabia", flag: "🇸🇦", rate: 1.02 },
    CNY: { code: "CNY", name: "China", flag: "🇨🇳", rate: 1.96 },
    RUB: { code: "RUB", name: "Russia", flag: "🇷🇺", rate: 24.8 }
  }

  const [filters, setFilters] = useState<FilterState>({
    location: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    status: "",
    sale_status: "",
    area: "",
    developer: ""
  })

  useEffect(() => {
    const saved = Cookies.get("selectedCurrency")
    if (saved) {
      setSelectedCurrency(JSON.parse(saved))
    }
  }, [])

  const convertPrice = (priceInAED: number) => {
    return (priceInAED * selectedCurrency.rate).toFixed(0)
  }

  const formatPrice = (priceInAED: number) => {
    const converted = convertPrice(priceInAED)
    const formatted = new Intl.NumberFormat('en-US').format(Number(converted))
    
    const symbols: Record<string, string> = {
      AED: 'AED',
      INR: '₹',
      GBP: '£',
      SAR: 'SAR',
      CNY: '¥',
      RUB: '₽'
    }
    
    return `${symbols[selectedCurrency.code]} ${formatted}`
  }
 
  const handleFilterSubmit = async (newFilters: FilterState) => {
    const query = new URLSearchParams()
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        query.append(key, value.trim())
      }
    })

    const filterUrl = `/properties${query.toString() ? `?${query.toString()}` : ''}`
    window.location.href = filterUrl
  }

  const clearFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      status: "",
      sale_status: "",
      area: "",
      developer: ""
    })
  }

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoData.canonicalUrl} />
        <meta property="og:image" content="/assets/hero-bg.jpg" />
        <meta property="og:site_name" content="Roar Realty Dubai" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content="/assets/hero-bg.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={seoData.canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <meta name="geo.region" content="AE-DU" />
        <meta name="geo.placename" content="Dubai" />
        <meta name="geo.position" content="25.2048;55.2708" />
        <meta name="ICBM" content="25.2048, 55.2708" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seoData.structuredData)
          }}
        />
      </Head>

      <div className="min-h-screen bg-white">

        <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />

          <div className="relative z-10 container mx-auto px-4 text-center text-white pt-16 md:pt-24">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              {page?.HeroTitle || "Find Your Dream Luxury Home"}
            </h1>
            <p className="text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto text-gray-200 px-4">
              {page?.HeroSubtitle || "Discover Dubai's most exclusive properties with Roar Realty. Your gateway to luxury living in the heart of the UAE."}
            </p>

            <div className="mb-6 md:mb-8 max-w-4xl mx-auto">
              <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-4 md:p-6">
                <PropertyFilters 
                  onFilterSubmit={handleFilterSubmit}
                  onClearFilters={clearFilters}
                  isLoading={false}
                  filters={filters}
                  setFilters={setFilters}
                  selectedCurrency={selectedCurrency}
                  formatPrice={formatPrice}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
              <Link href="/properties" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 font-semibold text-sm md:text-base px-5 md:px-7 py-3 md:py-4 rounded-xl shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300"
                >
                  Explore Properties <ArrowRight className="ml-2 h-4 w-4 mt-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
                    <div className="my-8 h-32 overflow-visible flex items-center justify-center ">
          <CurvedLoop 
            marqueeText="Premium Properties ✦ Dubai ✦ Luxury Living ✦"
            speed={4}
            curveAmount={0}
            direction="right"
            interactive={true}
            className="text-8xl font-bold text-black"
          />
        </div>
        <DubaiRealEstate/>
        <section id="properties" className="py-16 sm:py-20 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block mb-4">
                <span className="px-4 py-1 bg-gray-100 text-black text-xs font-semibold rounded-full tracking-wider uppercase border border-gray-200">
                  Featured Collection
                </span>
              </div>
              
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-black">
                Premium Properties
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Handpicked selection of Dubai's most prestigious properties
              </p>
            </div>

            {featuredProperties.length > 0 ? (
              <>
                <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                  <div className="flex gap-4 md:gap-6 w-max md:w-auto md:grid md:grid-cols-2 lg:grid-cols-3 md:max-w-7xl md:mx-auto">
                    {featuredProperties.map((property) => (
                      <div key={property.id} className="flex-shrink-0 w-[340px] md:w-auto">
                        <PropertyCard 
                          property={property} 
                          selectedCurrency={selectedCurrency}
                          formatPrice={formatPrice}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center mt-12">
                  <Link href="/properties">
                    <Button 
                      size="lg" 
                      className="bg-black text-white hover:bg-gray-800 font-semibold px-8 py-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300"
                    >
                      View All Properties <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 border-2 border-gray-200 rounded-2xl">
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-black">Loading Properties...</h3>
                  <p className="text-gray-600 mb-6">
                    Please wait while we load our featured properties.
                  </p>
                  <Link href="/properties">
                    <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-xl">
                      Browse All Properties
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="about" className="py-16 sm:py-20 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="inline-block mb-4">
                  <span className="px-4 py-1 bg-black text-white text-xs font-semibold rounded-full tracking-wider uppercase">
                    About Us
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-black">
                  Why Choose Roar Realty
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
                  With years of experience in Dubai's luxury real estate market, 
                  we provide unparalleled service and expertise to help you find 
                  the perfect property.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3 bg-white p-4 rounded-xl border border-gray-200">
                    <CheckCircle className="h-6 w-6 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-black font-medium">Expert knowledge of Dubai's prime locations</span>
                  </div>
                  <div className="flex items-start space-x-3 bg-white p-4 rounded-xl border border-gray-200">
                    <CheckCircle className="h-6 w-6 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-black font-medium">Personalized service tailored to your needs</span>
                  </div>
                  <div className="flex items-start space-x-3 bg-white p-4 rounded-xl border border-gray-200">
                    <CheckCircle className="h-6 w-6 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-black font-medium">Access to exclusive off-market properties</span>
                  </div>
                  <div className="flex items-start space-x-3 bg-white p-4 rounded-xl border border-gray-200">
                    <CheckCircle className="h-6 w-6 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-black font-medium">End-to-end support throughout your journey</span>
                  </div>
                </div>

                <Button size="lg" className="bg-black text-white hover:bg-gray-800 font-semibold px-8 py-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300">
                  <a href="/story">Learn More About Us</a>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center p-6 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Star className="h-10 w-10 sm:h-12 sm:w-12 text-black mx-auto mb-4" />
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-black">{page?.PropertiesSold || "500+"}</h3>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">Properties Sold</p>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 text-black mx-auto mb-4" />
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-black">{page?.happyClient || "1000+"}</h3>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">Happy Clients</p>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Award className="h-10 w-10 sm:h-12 sm:w-12 text-black mx-auto mb-4" />
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-black">{page?.Experience || "15+"}</h3>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">Years Experience</p>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-black mx-auto mb-4" />
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-black">{page?.Satisfaction || "98.9%"}</h3>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">Customer Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </section>
<PropertyManagement/>
        <section id="team" className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block mb-4">
                <span className="px-4 py-1 bg-gray-100 text-black text-xs font-semibold rounded-full tracking-wider uppercase border border-gray-200">
                  Our Team
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-black">
                Meet Our Expert Team
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Our experienced professionals are dedicated to making your real estate dreams come true
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {teamMembers.map((member, index) => (
                    <CarouselItem key={member.id || `team-member-${index}`} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <Card className="h-full transition-all duration-300 hover:shadow-lg border-2 border-black rounded-2xl bg-white">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="relative mb-6">
                              <Image
                                src={member.img || "/assets/team-ceo.jpg"}
                                alt={member.name}
                                width={96}
                                height={96}
                                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-black"
                              />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-black">{member.name}</h3>
                            <p className="text-black font-semibold mb-3">{member.role}</p>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                              {member.bio}
                            </p>
                            <div className="flex flex-col gap-2 text-sm text-gray-600">
                              <div className="flex items-center justify-center gap-2">
                                <Mail className="h-4 w-4 text-black" />
                                <span className="text-xs">{member.email}</span>
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <Phone className="h-4 w-4 text-black" />
                                <span className="text-xs">{member.phone}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>
<ContactForm/>
        <NewsInsights/>
        <section id="contact" className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-black">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-8">
                Let our expert team guide you through Dubai's luxury real estate market
              </p>
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 font-semibold text-lg px-8 py-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300">
                <Link href="/contact">
                Get In Touch Today
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <FloatingActionButton />
      </div>
    </>
  );
};


              export const getServerSideProps: GetServerSideProps = async () => {
                try {
                  const baseUrl = process.env.NEXT_PUBLIC_API_URL
                  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://roarrealty.ae'

                  let pageData = {}
                  let teamMembers = []
                  let featuredProperties = []

                  if (baseUrl) {
                    try {
                      const pageResponse = await fetch(`${baseUrl}/page`)
                      if (pageResponse.ok) {
                        pageData = await pageResponse.json()
                      }

                      const teamResponse = await fetch(`${baseUrl}/team`)
                      if (teamResponse.ok) {
                        teamMembers = await teamResponse.json()
                      }

                      const propertiesResponse = await fetch(`${baseUrl}/property?limit=5`)
                      if (propertiesResponse.ok) {
                        const apiData = await propertiesResponse.json()
                        const properties = apiData.properties || []

                        featuredProperties = properties.map((property: any) => {
                          let imageUrl = ""
                          try {
                            const parsedImage = JSON.parse(property.cover_image_url)
                            imageUrl = parsedImage.url || ""
                          } catch {
                            imageUrl = "/assets/penthouse-1.jpg"
                          }

                          return {
                            id: property.id.toString(),
                            title: property.name,
                            price: `AED ${property.min_price?.toLocaleString() || "Price on request"}`,
                            location: `${property.area || "Dubai"}, UAE`,
                            bedrooms: 2,
                            bathrooms: 2,
                            area: property.area_unit ? `${property.area_unit}` : "Size varies",
                            image: imageUrl,
                            type: property.status || "Apartment",
                            featured: true,
                            status: property.status || "",
                            sale_status: property.sale_status || "",
                            developer: property.developer || ""
                          }
                        })
                      }
                    } catch (error) {
                      console.error('Error fetching data:', error)
                    }
                  }

                  const seoData = {
                    title: `${(pageData as any)?.HeroTitle || "Find Your Dream Luxury Home"} | Roar Realty Dubai - Premium Real Estate`,
                    description: (pageData as any)?.HeroSubtitle || "Discover Dubai's most exclusive properties with Roar Realty. Your gateway to luxury living in the heart of the UAE. Browse apartments, villas, and penthouses in prime locations.",
                    keywords: "Dubai real estate, luxury properties Dubai, apartments for sale Dubai, villas Dubai, penthouses Dubai, property investment UAE, Dubai Marina properties, Downtown Dubai real estate, Emirates Hills villas, Palm Jumeirah properties, Roar Realty",
                    canonicalUrl: siteUrl,
                    structuredData: {
                      "@context": "https://schema.org",
                      "@type": "RealEstateAgent",
                      "name": "Roar Realty Dubai",
                      "description": "Premium real estate agency in Dubai specializing in luxury properties including apartments, villas, and penthouses",
                      "url": siteUrl,
                      "logo": `${siteUrl}/assets/logo.png`,
                      "image": `${siteUrl}/assets/hero-bg.jpg`,
                      "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Dubai",
                        "addressRegion": "Dubai",
                        "addressCountry": "AE"
                      },
                      "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": 25.2048,
                        "longitude": 55.2708
                      },
                      "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+971-58-500-5438",
                        "contactType": "sales",
                        "availableLanguage": ["English", "Arabic"]
                      },
                      "areaServed": "Dubai, UAE",
                      "priceRange": "$$$$"
                    }
                  }

                  return {
                    props: {
                      initialPageData: pageData,
                      initialTeamMembers: teamMembers,
                      initialFeaturedProperties: featuredProperties,
                      seoData
                    }
                  }
                } catch (error) {
                  console.error('Error in getServerSideProps:', error)

                  const fallbackSeoData = {
                    title: "Find Your Dream Luxury Home | Roar Realty Dubai - Premium Real Estate",
                    description: "Discover Dubai's most exclusive properties with Roar Realty. Your gateway to luxury living in the heart of the UAE. Browse apartments, villas, and penthouses in prime locations.",
                    keywords: "Dubai real estate, luxury properties Dubai, apartments for sale Dubai, villas Dubai, penthouses Dubai, property investment UAE",
                    canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://roarrealty.ae',
                    structuredData: {
                      "@context": "https://schema.org",
                      "@type": "RealEstateAgent",
                      "name": "Roar Realty Dubai",
                      "description": "Premium real estate agency in Dubai specializing in luxury properties",
                      "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://roarrealty.ae'
                    }
                  }

                  return {
                    props: {
                      initialPageData: {},
                      initialTeamMembers: [],
                      initialFeaturedProperties: [],
                      seoData: fallbackSeoData
                    }
                  }
                }
              }

              export default Home;