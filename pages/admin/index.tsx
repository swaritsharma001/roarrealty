import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/UserManagement"
import { PropertyManagement } from "@/components/admin/PropertyManagement"
import { ContentManagement } from "@/components/admin/ContentManagement"
import { TeamManagement } from "@/components/admin/TeamManagement"
import { StatisticsManagement } from "@/components/admin/StatisticsManagement"
import { Shield, Users, Home, Settings, UsersRound, BarChart3 } from "lucide-react"
import axios from "axios"

const Admin = () => {
  const [loading, setLoading] = useState(true)

  async function checkAdmin() {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1]

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const role = res.data?.role || res.data?.user?.role

      if (role === "admin") {
        setLoading(false)
      } else {
        window.location.href = "/"
      }
    } catch (err) {
      window.location.href = "/"
    }
  }

  useEffect(() => {
    checkAdmin()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-lg font-medium">Checking admin access...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-20 pb-8 bg-gradient-to-r from-luxury to-luxury-light">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Admin Panel</h1>
            </div>
            <p className="text-xl opacity-90">
              Manage users, properties, team members, statistics, and website content
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 overflow-x-auto">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <UsersRound className="h-4 w-4" />
                Team
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Content
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="properties">
              <PropertyManagement />
            </TabsContent>

            <TabsContent value="team">
              <TeamManagement />
            </TabsContent>

            <TabsContent value="statistics">
              <StatisticsManagement />
            </TabsContent>

            <TabsContent value="content">
              <ContentManagement />
            </TabsContent>
          </Tabs>
        </div>
      </section>

    </div>
  )
}

export default Admin

//https://390844e2-a2b5-4a2d-8020-69e99487059a-00-1xjco07t79r6e.sisko.replit.dev/?eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGE0NWEzNjRjZGExOTVjMWI0NmM3OTQiLCJpYXQiOjE3NTg1Mzg3ODgsImV4cCI6MTc2MTEzMDc4OH0.7tQgLhjG7viJq4laF_vGGmq9GL9XWwfxH1PvwIU7XOs