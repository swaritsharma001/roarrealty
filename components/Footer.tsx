
import { Instagram, MessageCircle, Mail, Phone, MapPin, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"

interface FooterProps {
  pageData?: any
}

export function Footer({ pageData: initialPageData }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const [page, setPageData] = useState(initialPageData || {})

  useEffect(() => {
    // Only fetch if no initial data provided
    if (!initialPageData) {
      async function fetchData() {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page`)
          const data = await res.json()
          setPageData(data)
        } catch (error) {
          console.error('Error fetching page data:', error)
        }
      }
      fetchData()
    }
  }, [initialPageData])

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={page?.HeroImage || "/picture/b68e1004-3524-4218-a5a3-2034f635c571.png"}
                alt="Roar Realty" 
                className="h-10 w-10 rounded-xl p-1"
                style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))' }}
              />
              <span className="text-xl font-bold ">
                {page?.siteName || "Roar Realty"}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Dubai's premier luxury real estate agency, specializing in high-end properties and exceptional service.
            </p>
            <div className="flex space-x-3">
              <Button 
                size="icon" 
                variant="ghost" 
                className="hover:bg-luxury/10 hover:text-luxury"
                asChild
              >
                <a href={`${page?.Instagram}`} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="hover:bg-luxury/10 hover:text-luxury"
                asChild
              >
                <a href={`${page?.LinkedIn}`} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="hover:bg-luxury/10 hover:text-luxury"
                asChild
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="text-muted-foreground hover:text-luxury transition-colors">Home</a></li>
              <li><a href="#properties" className="text-muted-foreground hover:text-luxury transition-colors">Properties</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-luxury transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-luxury transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Empty space for now */}
          <div className="space-y-4">
          </div>
          
          {/* Office Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Office</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-luxury mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Dubai Business Bay</p>
                  <p>1507, AL MANARA TOWER</p>
                  <p>BUSINESS BAY</p>
                  <p>UNITED ARAB EMIRATES</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-luxury" />
                <span>{page?.PhoneNumber || "+971 585005438"}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-luxury" />
                <span>{page?.primaryEmail || "admin@roarrealty.ae"}</span>
              </div>
              
              {/* Google Maps Embed */}
              <div className="mt-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.537329084522!2d55.2739!3d25.1891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6821c07e03c7%3A0x82c25b7c2a65f9ea!2sAl%20Manara%20Tower%2C%20Business%20Bay%20-%20Dubai!5e0!3m2!1sen!2sae!4v1703123456789!5m2!1sen!2sae"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg border"
                  title="Dubai Business Bay Office Location"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} roarrealty.ae. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="/privacy" className="text-muted-foreground hover:text-luxury transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-muted-foreground hover:text-luxury transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
