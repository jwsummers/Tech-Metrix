"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Car, Clock, BarChart3, Plus, Loader2, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { RepairOrderForm } from "@/components/repair-order-form"
import { RepairOrderList } from "@/components/repair-order-list"
import { StatsOverview } from "@/components/stats-overview"
import { WeeklyStats } from "@/components/weekly-stats"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [repairOrders, setRepairOrders] = useState([])
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      setUser(session.user)
      fetchRepairOrders(session.user.id)
    }

    checkUser()
  }, [router, supabase])

  const fetchRepairOrders = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("repair_orders")
        .select("*")
        .eq("technician_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setRepairOrders(data || [])
    } catch (error) {
      console.error("Error fetching repair orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const handleAddRepairOrder = async (newOrder) => {
    try {
      const { data, error } = await supabase
        .from("repair_orders")
        .insert([
          {
            ...newOrder,
            technician_id: user.id,
          },
        ])
        .select()

      if (error) throw error

      setRepairOrders([data[0], ...repairOrders])
      setShowForm(false)
    } catch (error) {
      console.error("Error adding repair order:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Car className="h-6 w-6" />
            <span className="text-xl font-bold">TechMetrix</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? (
                "Cancel"
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  New Repair Order
                </>
              )}
            </Button>
          </div>

          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Repair Order</CardTitle>
                <CardDescription>Enter the details of the repair order</CardDescription>
              </CardHeader>
              <CardContent>
                <RepairOrderForm onSubmit={handleAddRepairOrder} />
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="repair-orders">Repair Orders</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <StatsOverview repairOrders={repairOrders} />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Weekly Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <WeeklyStats repairOrders={repairOrders} />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Repair Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RepairOrderList repairOrders={repairOrders.slice(0, 5)} compact={true} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="repair-orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Repair Orders</CardTitle>
                  <CardDescription>View and manage all your repair orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <RepairOrderList repairOrders={repairOrders} compact={false} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="statistics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Detailed statistics about your repair orders and efficiency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Repair Orders</CardTitle>
                        <Car className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{repairOrders.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Labor Hours</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {repairOrders
                            .reduce((sum, order) => sum + Number.parseFloat(order.labor_hours || 0), 0)
                            .toFixed(1)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Labor Hours</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {repairOrders.length
                            ? (
                                repairOrders.reduce(
                                  (sum, order) => sum + Number.parseFloat(order.labor_hours || 0),
                                  0,
                                ) / repairOrders.length
                              ).toFixed(1)
                            : "0.0"}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Efficiency Rate</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{repairOrders.length ? "95%" : "0%"}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <WeeklyStats repairOrders={repairOrders} height={300} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
