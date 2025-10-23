
import { GetServerSideProps } from 'next'

const Sitemap = () => {
  // This component will never be rendered
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://roarrealty.ae'
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  // Static pages
  const staticPages = [
    '',
    '/properties',
    '/about',
    '/contact'
  ]
  
  let propertyPages: string[] = []
  
  // Fetch all property IDs for dynamic pages
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/property?limit=1000`)
      if (response.ok) {
        const data = await response.json()
        propertyPages = (data.properties || []).map((property: any) => `/property/${property.id}`)
      }
    } catch (error) {
      console.error('Error fetching properties for sitemap:', error)
    }
  }
  
  const allPages = [...staticPages, ...propertyPages]
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map((page) => {
      const lastmod = new Date().toISOString()
      const priority = page === '' ? '1.0' : page.startsWith('/property/') ? '0.8' : '0.7'
      
      return `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>${page === '' ? 'daily' : page.startsWith('/property/') ? 'weekly' : 'monthly'}</changefreq>
      <priority>${priority}</priority>
    </url>`
    })
    .join('')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default Sitemap
