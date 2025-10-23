import { GetServerSideProps } from 'next'
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ImageGallery } from "@/components/ImageGallery"
import { LazyImage } from "@/components/LazyImage"
import { DubaiMap } from "@/components/DubaiMap"
import { ArrowLeft, MapPin, Bed, Bath, Square, Phone, MessageCircle } from "lucide-react"
import ContactForm from "@/components/Contact.tsx"
import NewsInsights from "@/components/News.tsx" 

interface PropertyData {
  id: string
  title: string
  price: string
  location: string
  bedrooms: string
  bathrooms: string
  area: string
  image: string
  type: string
  featured: boolean
  description: string
  features: string[]
  images: string[]
  developer: string
  completionDate: string
  paymentPlan: string
  coordinates: string
  facilities: Array<{
    name: string
    image: string
    imageSource?: string
  }>
  unitBlocks: Array<{
    id: number
    type: string
    bedrooms: string
    priceFrom: number
    area: string
  }>
  developerData?: {
    name: string
    description: string
    website: string
    email: string
    officeAddress: string
    workingHours: Array<{
      days: string
      timeRange: string
    }>
  }
}

interface PropertyDetailsProps {
  property: PropertyData | null
  error?: string
}

const PropertyDetails = ({ property, error }: PropertyDetailsProps) => {
  const [page, setPage] = useState<any>(null)
  
  async function data(){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page`)
    const data = await res.json()
    setPage(data)
  }
  useEffect(() => {
    data()
  }, [])
            
  const router = useRouter()
  const [showFullDescription, setShowFullDescription] = useState(false)

  if (error || !property) {
    return (
      <>
        <Head>
          <title>Property Not Found | Roar Realty Dubai</title>
          <meta name="description" content="The requested property could not be found. Browse our other luxury Dubai real estate listings." />
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 pt-32">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">
                {error || 'Property Not Found'}
              </h1>
              <Button onClick={() => router.push("/properties")}>
                Back to Properties
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }
  const handleWhatsAppContact = () => {
    const message = `Hi! I'm interested in ${property.title} - ${property.price}`
    const whatsappUrl = `https://wa.me/${page.BuyPhone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCall = () => {
    window.location.href = "tel:+971585005438"
  }

  const metaDescription = `${property.title} in ${property.location}. ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, ${property.area}. Starting from ${property.price}. Premium Dubai real estate by Roar Realty.`
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://roarrealty.ae/property/${property.id}`,
    "image": property.image,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location,
      "addressCountry": "UAE"
    },
    "geo": property.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": property.coordinates.split(',')[0],
      "longitude": property.coordinates.split(',')[1]
    } : undefined,
    "numberOfRooms": property.bedrooms,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.area
    },
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "AED"
    },
    "realEstateAgent": {
      "@type": "RealEstateAgent",
      "name": "Roar Realty",
      "telephone": "+971585005438",
      "url": "https://roarrealty.ae"
    }
  }

  return (
    <>
      <Head>
        <title>{property.title} - {property.location} | Roar Realty Dubai</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${property.title}, ${property.location}, Dubai real estate, ${property.type}, ${property.bedrooms} bedroom apartment, property for sale Dubai, Roar Realty`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <meta property="og:title" content={`${property.title} - ${property.location} | Roar Realty`} />
        <meta property="og:description" content={`${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, ${property.area}. Starting from ${property.price}. Premium Dubai real estate.`} />
        <meta property="og:image" content={property.image} />
        <meta property="og:url" content={`https://roarrealty.ae/property/${property.id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Roar Realty Dubai" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${property.title} - ${property.location}`} />
        <meta name="twitter:description" content={`${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, ${property.area}. Starting from ${property.price}`} />
        <meta name="twitter:image" content={property.image} />
        
        <link rel="canonical" href={`https://roarrealty.ae/property/${property.id}`} />
        
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <div className="min-h-screen bg-background">
        
        
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <LazyImage 
            src={property.image} 
            alt={`${property.title} - Premium real estate in ${property.location}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
            <div className="container mx-auto">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {property.featured && (
                  <Badge className="bg-luxury text-white font-semibold">Featured</Badge>
                )}
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">{property.type}</Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{property.title}</h1>
              <div className="flex items-center text-white/90 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{property.location}</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">{property.price}</div>
            </div>
          </div>
        </div>
        <div className="py-8">
          <div className="container mx-auto px-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => router.push("/properties")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Properties
            </Button>
          </div>

          <div className="container mx-auto px-4 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Property Gallery</h2>
            {property.images.length > 0 ? (
              <ImageGallery propertyTitle={property.title} images={property.images} />
            ) : (
              <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
                <LazyImage 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.featured && (
                    <Badge className="bg-luxury text-white font-semibold">Featured</Badge>
                  )}
                  <Badge variant="secondary">{property.type}</Badge>
                </div>
              </div>
            )}
          </div>

          <div className="container mx-auto px-4 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{property.title}</h1>
                
                <div className="flex items-center text-muted-foreground mb-6">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{property.location}</span>
                </div>

                <div className="text-3xl font-bold text-luxury mb-6">{property.price}</div>

                <div className="flex items-center gap-6 mb-8 text-lg">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5" />
                    <span>{property.area}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Description</h2>
                  <div className="text-muted-foreground leading-relaxed">
                    {showFullDescription ? (
                      <div>
                        <p className="whitespace-pre-line">{property.description}</p>
                        <Button 
                          variant="link" 
                          onClick={() => setShowFullDescription(false)}
                          className="p-0 h-auto text-luxury mt-2"
                        >
                          Read Less
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="whitespace-pre-line">
                          {property.description.slice(0, 300)}
                          {property.description.length > 300 && '...'}
                        </p>
                        {property.description.length > 300 && (
                          <Button 
                            variant="link" 
                            onClick={() => setShowFullDescription(true)}
                            className="p-0 h-auto text-luxury mt-2"
                          >
                            Read More
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {(property.developerData || property.completionDate) && (
                  <div className="mb-8 p-6 bg-muted/50 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Developer Information</h2>
                    {property.developerData && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-2">{property.developerData.name}</h3>
                        <p className="text-muted-foreground mb-4">{property.developerData.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold mb-1">Contact</h4>
                            <p className="text-sm text-muted-foreground">{property.developerData.email}</p>
                            {property.developerData.website && (
                              <a 
                                href={property.developerData.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-luxury hover:underline"
                              >
                                Visit Website
                              </a>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-1">Office Address</h4>
                            <p className="text-sm text-muted-foreground">{property.developerData.officeAddress}</p>
                          </div>
                        </div>
                        
                        {property.developerData.workingHours.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Working Hours</h4>
                            {property.developerData.workingHours.map((hours, index) => (
                              <p key={index} className="text-sm text-muted-foreground">
                                {hours.days}: {hours.timeRange}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.completionDate && (
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Completion</h3>
                          <p className="text-muted-foreground">{property.completionDate}</p>
                        </div>
                      )}
                      {property.paymentPlan && (
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Payment Plan</h3>
                          <p className="text-muted-foreground text-sm">{property.paymentPlan}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {property.facilities.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6">Facilities & Amenities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {property.facilities.map((facility, index) => (
                        <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                          <div className="relative h-48">
                            <LazyImage 
                              src={facility.image} 
                              alt={facility.name}
                              className="w-full h-full"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2">{facility.name}</h3>
                            {facility.imageSource && (
                              <p className="text-xs text-muted-foreground">{facility.imageSource}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {property.unitBlocks.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6">Available Units & Pricing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {property.unitBlocks.map((unit, index) => (
                        <Card key={index} className="hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="font-semibold text-lg">{unit.type}</h3>
                              <Badge variant="outline">{unit.bedrooms} BR</Badge>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Starting Price:</span>
                                <span className="font-semibold">
                                  {unit.priceFrom > 0 ? `AED ${unit.priceFrom.toLocaleString()}` : 'Price on request'}
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Area:</span>
                                <span className="font-semibold">{unit.area}</span>
                              </div>
                              
                              <div className="pt-3 border-t">
                                <Button 
                                  onClick={handleWhatsAppContact}
                                  variant="outline"
                                  className="w-full"
                                >
                                  Inquire About This Unit
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Additional Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="w-2 h-2 bg-luxury rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <DubaiMap location={property.location} coordinates={property.coordinates} />
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-6 text-center">Interested in this property?</h3>
                    
                    <div className="space-y-4">
                      <Button 
                        onClick={handleWhatsAppContact}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 flex items-center justify-center gap-3"
                      >
                        <MessageCircle className="h-6 w-6" />
                        Contact Now to Buy
                      </Button>
                      
                      <Button 
                        onClick={handleCall}
                        variant="outline"
                        className="w-full text-lg py-6 flex items-center justify-center gap-3 border-2"
                      >
                        <Phone className="h-6 w-6" />
                        Call Now
                      </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
                      <p>Call us at: <strong>{page?.BuyPhone}</strong></p>
                      <p className="mt-1">Available 24/7</p>
                    </div>
                  </CardContent>
                </Card>
                
              </div>
            </div>
          </div>
        </div>
     <ContactForm/>
        <NewsInsights/>
        <FloatingActionButton />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property/${id}`)
    
    if (!response.ok) {
      return {
        props: {
          property: null,
          error: 'Property not found'
        }
      }
    }
    
    const apiData = await response.json()
    const propertyData = apiData.data?.pageProps?.property
    
    if (!propertyData) {
      return {
        props: {
          property: null,
          error: 'Invalid property data'
        }
      }
    }

    const getMainImage = (data: any): string => {
      return data.architecture?.[0]?.url || 
             data.interior?.[0]?.url || 
             data.lobby?.[0]?.url || 
             '/placeholder-property.jpg'
    }

    const getAllImages = (data: any): string[] => {
      const images: string[] = []
      if (data.architecture) images.push(...data.architecture.map((img: any) => img.url))
      if (data.interior) images.push(...data.interior.map((img: any) => img.url))
      if (data.lobby) images.push(...data.lobby.map((img: any) => img.url))
      return images
    }

    const getBedroomsFromUnits = (units: any[]): string => {
      if (!units?.length) return '1-4'
      const bedrooms = new Set()
      units.forEach(unit => {
        if (unit.unit_type?.includes('1') || unit.unit_bedrooms === 1) bedrooms.add('1')
        if (unit.unit_type?.includes('2') || unit.unit_bedrooms === 2) bedrooms.add('2')
        if (unit.unit_type?.includes('3') || unit.unit_bedrooms === 3) bedrooms.add('3')
        if (unit.unit_type?.includes('4') || unit.unit_bedrooms === 4) bedrooms.add('4')
        if (unit.unit_type?.toLowerCase().includes('penthouse')) bedrooms.add('4+')
      })
      return Array.from(bedrooms).sort().join(', ') || '1-4'
    }

    const getBathroomsFromUnits = (units: any[]): string => {
      if (!units?.length) return '1-4'
      const bathrooms = new Set()
      units.forEach(unit => {
        if (unit.unit_type?.includes('1')) bathrooms.add('1')
        if (unit.unit_type?.includes('2')) bathrooms.add('2')
        if (unit.unit_type?.includes('3')) bathrooms.add('3')
        if (unit.unit_type?.includes('4') || unit.unit_type?.toLowerCase().includes('penthouse')) bathrooms.add('4+')
      })
      return Array.from(bathrooms).sort().join(', ') || '1-4'
    }

    const getAreaFromUnits = (units: any[]): string => {
      if (!units?.length) return 'Size varies'
      const areas = units.map(unit => {
        if (unit.units_area_from && unit.units_area_to) {
          return `${unit.units_area_from}-${unit.units_area_to} ${unit.area_unit || 'sqft'}`
        } else if (unit.units_area_from) {
          return `${unit.units_area_from}+ ${unit.area_unit || 'sqft'}`
        }
        return null
      }).filter(Boolean)
      
      return areas.length > 0 ? areas.join(', ') : 'Size varies'
    }

    const getPriceRange = (units: any[]): string => {
      if (!units?.length) return 'Price on request'
      const prices = units.map(unit => unit.units_price_from).filter(price => price && price > 0)
      if (prices.length === 0) return 'Price on request'
      
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      
      if (minPrice === maxPrice) {
        return `AED ${minPrice.toLocaleString()}`
      }
      return `AED ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`
    }

    const getPropertyType = (units: any[]): string => {
      if (!units?.length) return 'Apartment'
      const types = units.map(u => u.normalized_type || u.unit_type).filter(Boolean)
      return types[0] || 'Apartment'
    }

    const cleanDescription = (overview: string): string => {
      if (!overview) return ''
      return overview
        .replace(/#{1,6}\s*/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\n\n+/g, '\n\n')
        .trim()
    }

    const getPaymentPlan = (plans: any[]): string => {
      if (!plans?.length) return ''
      const plan = plans[0]
      const payments = plan.Payments?.flat()?.flat() || []
      return payments.map((p: any) => `${p.Percent_of_payment}% ${p.Payment_time}`).join(', ')
    }

    const transformedProperty: PropertyData = {
      id: propertyData.id.toString(),
      title: propertyData.name,
      price: getPriceRange(propertyData.unit_blocks),
      location: `${propertyData.area}, ${propertyData.country}`,
      bedrooms: getBedroomsFromUnits(propertyData.unit_blocks),
      bathrooms: getBathroomsFromUnits(propertyData.unit_blocks),
      area: getAreaFromUnits(propertyData.unit_blocks),
      image: getMainImage(propertyData),
      type: getPropertyType(propertyData.unit_blocks) || 'Apartment',
      featured: propertyData.sale_status === 'Presale(EOI)',
      description: cleanDescription(propertyData.overview),
      features: propertyData.facilities?.map((f: any) => f.name) || [],
      images: getAllImages(propertyData),
      developer: propertyData.developer || '',
      completionDate: propertyData.completion_datetime ? new Date(propertyData.completion_datetime).getFullYear().toString() : '',
      paymentPlan: getPaymentPlan(propertyData.payment_plans),
      coordinates: propertyData.coordinates || '',
      facilities: propertyData.facilities?.map((f: any) => ({
        name: f.name,
        image: f.image?.url || '',
        imageSource: f.image_source
      })) || [],
      unitBlocks: propertyData.unit_blocks?.map((unit: any) => ({
        id: unit.id,
        type: unit.unit_type || unit.normalized_type,
        bedrooms: unit.unit_bedrooms?.toString() || '1',
        priceFrom: unit.units_price_from || 0,
        area: unit.units_area_from && unit.units_area_to 
          ? `${unit.units_area_from}-${unit.units_area_to} ${unit.area_unit || 'sqft'}`
          : unit.units_area_from 
            ? `${unit.units_area_from}+ ${unit.area_unit || 'sqft'}`
            : 'Size varies'
      })) || [],
      developerData: propertyData.developer_data ? {
        name: propertyData.developer_data.name,
        description: propertyData.developer_data.description,
        website: propertyData.developer_data.website,
        email: propertyData.developer_data.email,
        officeAddress: propertyData.developer_data.office_address,
        workingHours: propertyData.developer_data.working_hours || []
      } : undefined
    }
    
    return {
      props: {
        property: transformedProperty
      }
    }
    
  } catch (err) {
    return {
      props: {
        property: null,
        error: 'Failed to load property'
      }
    }
  }
}

export default PropertyDetails