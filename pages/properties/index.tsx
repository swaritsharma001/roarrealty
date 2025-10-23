import { useState } from "react";
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyFilters } from "@/components/PropertyFilters";
import { PropertyCard } from "@/components/PropertyCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { PropertyListingSkeleton } from "@/components/skeletons/PropertySkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Property {
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

interface SearchParams {
  location?: string
  minPrice?: string
  maxPrice?: string
  propertyType?: string
  status?: string
  sale_status?: string
  area?: string
  developer?: string
}

interface PropertiesPageProps {
  properties: Property[]
  currentPage: number
  totalPages: number
  totalProperties: number
  searchParams: SearchParams
  seoData: {
    title: string
    description: string
    keywords: string
    canonicalUrl: string
  }
}

const Properties = ({ 
  properties: initialProperties, 
  currentPage: initialPage, 
  totalPages: initialTotalPages, 
  totalProperties: initialTotalProperties,
  searchParams,
  seoData 
}: PropertiesPageProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState(initialProperties);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalProperties, setTotalProperties] = useState(initialTotalProperties);
  
  const [filters, setFilters] = useState({
    location: searchParams?.location || "",
    minPrice: searchParams?.minPrice || "",
    maxPrice: searchParams?.maxPrice || "",
    propertyType: searchParams?.propertyType || "",
    status: searchParams?.status || "",
    sale_status: searchParams?.sale_status || "",
    area: searchParams?.area || "",
    developer: searchParams?.developer || ""
  });

  const fetchProperties = async (newFilters: typeof filters, page = 1) => {
    setIsLoading(true);
    
    try {
      const query = new URLSearchParams();
      
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) query.append(key, value);
      });
      
      query.set('page', page.toString());
      query.set('limit', '12');
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) {
        throw new Error('API URL not configured');
      }
      
      const response = await fetch(`${baseUrl}/property?${query.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiData = await response.json();
      
      const newTotalPages = Math.max(1, apiData.totalPages || 1);
      const newTotalProperties = Math.max(0, apiData.total || 0);
      
      const transformedProperties = (apiData.properties || []).map((property: any) => {
        let imageUrl = "/assets/penthouse-1.jpg";
        
        if (property.cover_image_url) {
          try {
            const parsedImage = JSON.parse(property.cover_image_url);
            if (parsedImage.url && typeof parsedImage.url === 'string') {
              imageUrl = parsedImage.url;
            }
          } catch {
          }
        }

        return {
          id: String(property.id || Math.random()),
          title: property.name || "Luxury Property",
          price: property.min_price 
            ? `AED ${property.min_price.toLocaleString()}` 
            : "Price on request",
          location: `${property.area || "Dubai"}, UAE`,
          bedrooms: Number(property.bedrooms) || 2,
          bathrooms: Number(property.bathrooms) || 2,
          area: property.area_unit ? `${property.area_unit}` : "Size varies",
          image: imageUrl,
          type: property.status || "Apartment",
          featured: property.sale_status === 'Presale(EOI)',
          status: property.status || "",
          sale_status: property.sale_status || "",
          developer: property.developer || ""
        };
      });
      
      setProperties(transformedProperties);
      setCurrentPage(page);
      setTotalPages(newTotalPages);
      setTotalProperties(newTotalProperties);
      
      const newQuery = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) newQuery.append(key, value);
      });
      if (page > 1) newQuery.set('page', page.toString());
      
      const newUrl = `/properties${newQuery.toString() ? `?${newQuery.toString()}` : ''}`;
      
      router.push(newUrl, undefined, { shallow: true });
      
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
      setTotalPages(1);
      setTotalProperties(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterSubmit = () => {
    fetchProperties(filters, 1);
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    fetchProperties(filters, page);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      location: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      status: "",
      sale_status: "",
      area: "",
      developer: ""
    };
    setFilters(clearedFilters);
    fetchProperties(clearedFilters, 1);
  };

  const getPaginationRange = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    if (totalPages <= 1) return [];

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) {
      if (i !== 1 && i !== totalPages) range.push(i);
    }
    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);

    return range.filter((item, index, arr) => arr.indexOf(item) === index);
  };

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
        <meta property="og:image" content="/assets/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={seoData.canonicalUrl} />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-white">
        <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 sm:px-6 py-2 bg-black text-white text-xs sm:text-sm font-semibold rounded-full tracking-wider uppercase">
                  Premium Collection
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-4 sm:mb-6 tracking-tight leading-tight">
                Discover Your
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-gray-900 via-black to-gray-700 bg-clip-text text-transparent">
                  {" "}Dream Property
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                Explore our curated collection of luxury properties in Dubai's most prestigious locations
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 md:p-8">
                <PropertyFilters
                  filters={filters}
                  setFilters={setFilters}
                  onFilterSubmit={handleFilterSubmit}
                />
              </div>

              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-black mb-1 sm:mb-2">{totalProperties}+</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Properties Listed</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-black mb-1 sm:mb-2">50+</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Prime Locations</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-black mb-1 sm:mb-2">24/7</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Expert Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
                {isLoading
                  ? "Loading Properties..."
                  : `${properties.length} of ${totalProperties} Properties`}
              </h2>
              {!isLoading && totalPages > 1 && (
                <div className="text-sm text-gray-600 font-medium">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>

            {isLoading ? (
              <PropertyListingSkeleton />
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20 md:py-24 bg-gray-50 border-2 border-gray-200 rounded-2xl">
                <div className="max-w-md mx-auto px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4">No Properties Found</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                    Try adjusting your search filters to discover more properties.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] text-sm sm:text-base"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {!isLoading && totalPages > 1 && (
              <div className="mt-12 sm:mt-16">
                <Pagination>
                  <PaginationContent className="flex-wrap gap-2">
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="cursor-pointer border-2 border-black hover:bg-black hover:text-white transition-colors"
                        />
                      </PaginationItem>
                    )}

                    {getPaginationRange().map((page, idx) =>
                      page === "..." ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <span className="px-3 py-2 text-black">...</span>
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(Number(page))}
                            isActive={currentPage === page}
                            className={`cursor-pointer border-2 transition-all ${
                              currentPage === page
                                ? 'bg-black text-white border-black'
                                : 'border-gray-300 text-black hover:border-black hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="cursor-pointer border-2 border-black hover:bg-black hover:text-white transition-colors"
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </section>

        <FloatingActionButton />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PropertiesPageProps> = async ({ query }) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const page = Math.max(1, Number(query.page) || 1)
    const propertiesPerPage = 12

    const searchParams: SearchParams = {
      location: typeof query.location === 'string' ? query.location : "",
      minPrice: typeof query.minPrice === 'string' ? query.minPrice : "",
      maxPrice: typeof query.maxPrice === 'string' ? query.maxPrice : "",
      propertyType: typeof query.propertyType === 'string' ? query.propertyType : "",
      status: typeof query.status === 'string' ? query.status : "",
      sale_status: typeof query.sale_status === 'string' ? query.sale_status : "",
      area: typeof query.area === 'string' ? query.area : "",
      developer: typeof query.developer === 'string' ? query.developer : ""
    }

    let properties: Property[] = []
    let totalPages = 1
    let totalProperties = 0

    if (baseUrl) {
      try {
        const queryString = new URLSearchParams({
          page: page.toString(),
          limit: propertiesPerPage.toString(),
          ...Object.fromEntries(
            Object.entries(searchParams).filter(([_, v]) => v && v.trim() !== "")
          )
        }).toString()

        const response = await fetch(`${baseUrl}/property?${queryString}`, {
          signal: AbortSignal.timeout(10000),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const apiData = await response.json()
          totalPages = Math.max(1, apiData.totalPages || 1)
          totalProperties = Math.max(0, apiData.total || 0)

          properties = (apiData.properties || []).map((property: any) => {
            let imageUrl = "/assets/penthouse-1.jpg"
            
            if (property.cover_image_url) {
              try {
                const parsedImage = JSON.parse(property.cover_image_url)
                if (parsedImage.url && typeof parsedImage.url === 'string') {
                  imageUrl = parsedImage.url
                }
              } catch {
              }
            }

            return {
              id: String(property.id || Math.random()),
              title: property.name || "Luxury Property",
              price: property.min_price 
                ? `AED ${property.min_price.toLocaleString()}` 
                : "Price on request",
              location: `${property.area || "Dubai"}, UAE`,
              bedrooms: Number(property.bedrooms) || 2,
              bathrooms: Number(property.bathrooms) || 2,
              area: property.area_unit ? `${property.area_unit}` : "Size varies",
              image: imageUrl,
              type: property.status || "Apartment",
              featured: property.sale_status === 'Presale(EOI)',
              status: property.status || "",
              sale_status: property.sale_status || "",
              developer: property.developer || ""
            }
          })
        } else {
          console.error('API response not OK:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      }
    }

    const finalPage = Math.min(page, totalPages)

    const filterDescriptions = []
    if (searchParams.location) filterDescriptions.push(`in ${searchParams.location}`)
    if (searchParams.developer) filterDescriptions.push(`by ${searchParams.developer}`)
    if (searchParams.status) filterDescriptions.push(searchParams.status)

    const filterText = filterDescriptions.length > 0 ? ` ${filterDescriptions.join(', ')}` : ''
    const pageText = finalPage > 1 ? ` - Page ${finalPage}` : ''

    const seoData = {
      title: `Dubai Luxury Properties${filterText}${pageText} | Roar Realty`,
      description: `Browse ${totalProperties}+ premium properties for sale in Dubai${filterText}. Find apartments, villas, and penthouses in Dubai's most prestigious locations with Roar Realty.`,
      keywords: `Dubai properties${filterText}, luxury real estate Dubai, apartments for sale Dubai, Dubai property listings, Roar Realty Dubai`,
      canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://roarrealty.ae'}/properties${
        Object.values(searchParams).some(v => v) || finalPage > 1
          ? `?${new URLSearchParams({
              ...Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v)),
              ...(finalPage > 1 ? { page: finalPage.toString() } : {})
            }).toString()}`
          : ''
      }`
    }

    return {
      props: {
        properties,
        currentPage: finalPage,
        totalPages,
        totalProperties,
        searchParams,
seoData
      }
    }
  } catch (error) {
    console.error('Error in getServerSideProps:', error)

    const defaultSeoData = {
      title: "Dubai Luxury Properties | Roar Realty",
      description: "Browse premium properties for sale in Dubai. Find apartments, villas, and penthouses in Dubai's most prestigious locations.",
      keywords: "Dubai properties, luxury real estate Dubai, apartments for sale Dubai",
      canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://roarrealty.ae'}/properties`
    }

    return {
      props: {
        properties: [],
        currentPage: 1,
        totalPages: 1,
        totalProperties: 400,
        searchParams: {},
        seoData: defaultSeoData
      }
    }
  }
}

export default Properties;