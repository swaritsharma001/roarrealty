
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    
    if (!baseUrl) {
      return res.status(500).json({ message: 'API URL not configured' })
    }

    // Forward query parameters
    const queryString = new URLSearchParams(req.query as Record<string, string>).toString()
    
    const response = await fetch(`${baseUrl}/property?${queryString}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch properties')
    }
    
    const data = await response.json()
    
    // Transform the data if needed
    const transformedData = {
      ...data,
      properties: (data.properties || []).map((property: any) => {
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
          featured: property.sale_status === 'Presale(EOI)',
          status: property.status || "",
          sale_status: property.sale_status || "",
          developer: property.developer || ""
        }
      })
    }
    
    res.status(200).json(transformedData)
  } catch (error) {
    console.error('Error in properties API:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
