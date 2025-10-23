export async function getPageData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page`, {
      next: { revalidate: 30 } // ISR with 30-second revalidation
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch page data: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching page data:', error)
    return {}
  }
}

export async function getTeamData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team`, {
      next: { revalidate: 30 } // ISR with 30-second revalidation
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch team data: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching team data:', error)
    return []
  }
}

export async function getPropertiesData(params?: any) {
  try {
    let query = new URLSearchParams()

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          query.append(key, params[key])
        }
      })
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/property${query.toString() ? `?${query.toString()}` : ''}`

    const res = await fetch(url, {
      next: { revalidate: 30 } // ISR with 30-second revalidation
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch properties data: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching properties data:', error)
    return { properties: [] }
  }
}

export async function getPropertyDetail(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property/${id}`, {
      next: { revalidate: 30 } // ISR with 30-second revalidation
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch property detail: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error)
    return null
  }
}