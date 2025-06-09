"use client"

import { useMemo } from "react"
import { format, startOfDay, subDays, isWithinInterval } from "date-fns"
import { Car, Clock, BarChart3, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsOverview({ repairOrders }) {
  const stats = useMemo(() => {
    const today = startOfDay(new Date())
    const yesterday = subDays(today, 1)

    // Filter orders for today and yesterday
    const todayOrders = repairOrders.filter((order) => {
      const orderDate = new Date(order.created_at)
      return isWithinInterval(orderDate, { start: today, end: new Date() })
    })

    const yesterdayOrders = repairOrders.filter((order) => {
      const orderDate = new Date(order.created_at)
      return isWithinInterval(orderDate, { start: yesterday, end: today })
    })

    // Calculate stats
    const todayOrderCount = todayOrders.length
    const todayLaborHours = todayOrders.reduce((sum, order) => sum + Number.parseFloat(order.labor_hours || 0), 0)

    const yesterdayOrderCount = yesterdayOrders.length
    const yesterdayLaborHours = yesterdayOrders.reduce(
      (sum, order) => sum + Number.parseFloat(order.labor_hours || 0),
      0,
    )

    // Calculate change percentages
    const orderCountChange =
      yesterdayOrderCount === 0
        ? todayOrderCount > 0
          ? 100
          : 0
        : ((todayOrderCount - yesterdayOrderCount) / yesterdayOrderCount) * 100

    const laborHoursChange =
      yesterdayLaborHours === 0
        ? todayLaborHours > 0
          ? 100
          : 0
        : ((todayLaborHours - yesterdayLaborHours) / yesterdayLaborHours) * 100

    // Calculate efficiency (simplified for demo)
    const efficiency = todayOrderCount > 0 ? (todayLaborHours / todayOrderCount) * 20 : 0
    const efficiencyScore = Math.min(Math.max(efficiency, 0), 100)

    return {
      todayOrderCount,
      todayLaborHours: todayLaborHours.toFixed(1),
      orderCountChange: orderCountChange.toFixed(1),
      laborHoursChange: laborHoursChange.toFixed(1),
      efficiencyScore: efficiencyScore.toFixed(0),
    }
  }, [repairOrders])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today&apos;s Repair Orders</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayOrderCount}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {Number.parseFloat(stats.orderCountChange) > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">{stats.orderCountChange}%</span> from yesterday
              </>
            ) : Number.parseFloat(stats.orderCountChange) < 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-red-500 rotate-180" />
                <span className="text-red-500">{Math.abs(Number.parseFloat(stats.orderCountChange))}%</span> from
                yesterday
              </>
            ) : (
              "Same as yesterday"
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today&apos;s Labor Hours</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayLaborHours}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {Number.parseFloat(stats.laborHoursChange) > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">{stats.laborHoursChange}%</span> from yesterday
              </>
            ) : Number.parseFloat(stats.laborHoursChange) < 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-red-500 rotate-180" />
                <span className="text-red-500">{Math.abs(Number.parseFloat(stats.laborHoursChange))}%</span> from
                yesterday
              </>
            ) : (
              "Same as yesterday"
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.efficiencyScore}%</div>
          <div className="mt-2 h-2 w-full rounded-full bg-muted">
            <div className="h-2 rounded-full bg-green-500" style={{ width: `${stats.efficiencyScore}%` }} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Date</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{format(new Date(), "MMM d, yyyy")}</div>
          <p className="text-xs text-muted-foreground">{format(new Date(), "EEEE")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
