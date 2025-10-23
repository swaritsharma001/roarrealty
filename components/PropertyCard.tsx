import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Bed, Bath, Square, Heart, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    price: string
    location: string
    bedrooms: number
    bathrooms: number
    area: string
    image: string
    type: string
    featured?: boolean
    status?: string
    sale_status?: string
    developer?: string
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [page, setPage] = useState([])
  async function data(){
    const res = await fetch("https://api.roarrealty.ae/page")
    const data = await res.json()
    setPage(data)
  }
  useEffect(()=>{
    data()
  }, [page])
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-border/50 w-full max-w-[340px]">
      {/* Image Section - Compact */}
      <div className="relative overflow-hidden h-[200px]">
        <img
          src={property.image || "/assets/penthouse-1.jpg"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.featured && (
            <Badge className="bg-white text-black text-xs font-semibold shadow-lg">
              ⭐ Featured
            </Badge>
          )}
          {property.status && (
            <Badge variant="secondary" className="text-xs">
              {property.status}
            </Badge>
          )}
        </div>
        
        {/* Heart Icon */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white text-black rounded-full shadow-md"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Image Count */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md text-white text-xs font-medium flex items-center gap-1">
        </div>
      </div>

      {/* Content Section - Compact */}
      <CardContent className="p-4 space-y-3">
        {/* Price */}
        <div className="text-2xl font-bold text-foreground">
          {property.price}
        </div>

        {/* Title/Features */}
        <p className="text-sm text-blue-600 line-clamp-1">
          <Link href={`/property/${property.id}`}>
            {property.name || "Prime Location | Pool View | Handover Soon"}
          </Link>
        </p>

        {/* Location */}
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center justify-between py-3 border-y border-border text-sm">
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{property.bedrooms === 0 ? "Studio" : property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{property.area}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 h-10 text-sm font-semibold hover:bg-muted"
          >
            <Phone className="h-4 w-4 mr-1.5" />
            <a href={`tel:${page?.BuyPhone}`}>Call</a>
          </Button>
          <Button 
            className="flex-1 h-10 text-sm font-semibold"
          >
            <MessageCircle className="h-4 w-4 mr-1.5" />
            <a href={`https://wa.me/${page?.BuyPhone}`}>WhatsApp</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Example Usage Component
export default function PropertyShowcase() {
  const sampleProperty = {
    id: "1",
    title: "Beverly Residences 2",
    price: "USD 217,805",
    location: "Beverly Residences 2, Jumeirah Village Circle, Dubai",
    bedrooms: 0,
    bathrooms: 1,
    area: "394 sq ft",
    image: "/assets/penthouse-1.jpg",
    type: "Studio",
    featured: true,
    status: "New",
    developer: "Ellington Properties"
  }

  const properties = [sampleProperty, sampleProperty, sampleProperty]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-gold">Properties</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked selection of Dubai's most prestigious properties
          </p>
        </div>

        {/* Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-max md:w-auto mx-auto">
            {properties.map((property, index) => (
              <PropertyCard key={index} property={property} />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold text-black font-semibold shadow-lg hover:shadow-xl transition-all px-8"
          >
            View All Properties
            <span className="ml-2">→</span>
          </Button>
        </div>
      </div>
    </section>
  )
}