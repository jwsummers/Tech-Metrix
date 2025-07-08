'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Clock, Plus, Loader2, LogOut, Car } from 'lucide-react';
import type { RepairOrder } from '@/types';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { RepairOrderForm } from '../../components/dashboard/repair-order-form';
import { RepairOrderList } from '../../components/dashboard/repair-order-list';
import { StatsOverview } from '../../components/dashboard/stats-overview';
import { WorkHoursForm } from '../../components/dashboard/work-hours-form';
import { Achievements } from '../../components/dashboard/achievements';
import { WeeklyEfficiencyChart } from '../../components/dashboard/weekly-efficiency-chart';

import { DateTime } from 'luxon';
import {
  getStartOfWeek,
  getStartOfWeekDate,
  formatDateShort,
} from '@/lib/dateUtils';

interface User {
  id: string;
  [key: string]: any;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [repairOrders, setRepairOrders] = useState<RepairOrder[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [workedHoursThisWeek, setWorkedHoursThisWeek] = useState<number>(0);
  const [dailyWorkedHours, setDailyWorkedHours] = useState<
    Record<string, number>
  >({});
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user as User);
      fetchRepairOrders(session.user.id);
      fetchWorkedHours(session.user.id);
    };

    checkUser();
  }, [router]);

  const fetchRepairOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('repair_orders')
        .select('*')
        .eq('technician_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRepairOrders(data as RepairOrder[]);
    } catch (error) {
      console.error('Error fetching repair orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkedHours = async (userId: string) => {
    const startOfWeek = getStartOfWeekDate();
    const startOfWeekString = startOfWeek.toISODate();

    const { data, error } = await supabase
      .from('work_logs')
      .select('date, worked_hours')
      .eq('user_id', userId)
      .gte('date', startOfWeekString);

    if (error) {
      console.error('Error fetching worked hours:', error);
      return;
    }

    const total = data?.reduce(
      (sum: number, log: { worked_hours: number }) =>
        sum + (log.worked_hours || 0),
      0
    );

    // Convert to a map of date strings
    const dailyMap: Record<string, number> = {};
    data?.forEach((log) => {
      dailyMap[log.date] = log.worked_hours;
    });

    setWorkedHoursThisWeek(total || 0);
    setDailyWorkedHours(dailyMap);
  };

  const startOfWeek = getStartOfWeek();
  const endOfWeek = startOfWeek.plus({ days: 7 });

  const weeklyRepairOrders = repairOrders.filter((order) => {
    const orderDate = DateTime.fromISO(order.created_at);
    return orderDate >= startOfWeek && orderDate < endOfWeek;
  });

  const weeklyLaborHours = weeklyRepairOrders.reduce(
    (sum, order) => sum + Number(order.labor_hours || 0),
    0
  );

  const start = getStartOfWeek();
  const dailyEfficiencyData = Array.from({ length: 7 }).map((_, index) => {
    const date = start.plus({ days: index });
    const dateStr = date.toFormat('yyyy-MM-dd');

    const ordersForDay = weeklyRepairOrders.filter(
      (order) => formatDateShort(order.created_at) === dateStr
    );
    const laborHours = ordersForDay.reduce(
      (sum, order) => sum + Number(order.labor_hours || 0),
      0
    );

    const workedHours = dailyWorkedHours[dateStr] || 0;

    return {
      day: date.toFormat('ccc'),
      efficiency:
        workedHours > 0 ? ((laborHours / workedHours) * 100).toFixed(1) : '0',
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleAddRepairOrder = async (newOrder: RepairOrder) => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('repair_orders')
        .insert([{ ...newOrder, technician_id: user.id }])
        .select();

      if (error) throw error;

      setRepairOrders([data![0], ...repairOrders]);
      setShowForm(false);
      fetchWorkedHours(user.id);
    } catch (error) {
      console.error('Error adding repair order:', error);
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blueAccent' />
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <header className='sticky top-0 z-10 border-b bg-background'>
        <div className='container flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-2'>
            <Image
              src='/Logo-fullRB.png'
              alt='TechTracktion Logo'
              width={240}
              height={240}
            />
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleSignOut}
            className='text-red-500 hover:bg-red-100 hover:text-red-600 transition'
          >
            <LogOut className='h-5 w-5' />
            <span className='sr-only'>Sign out</span>
          </Button>
        </div>
      </header>

      <main className='flex-1 container px-4 py-6'>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold tracking-tight text-blueAccent'>
              Dashboard
            </h1>
            <Button
              onClick={() => setShowForm(!showForm)}
              className='bg-blueAccent text-white hover:bg-tealAccent transition'
            >
              {showForm ? (
                'Cancel'
              ) : (
                <>
                  <Plus className='mr-2 h-4 w-4' />
                  New Repair Order
                </>
              )}
            </Button>
          </div>

          {showForm && (
            <Card className='border-blueAccent/30 shadow-sm'>
              <CardHeader>
                <CardTitle>Add New Repair Order</CardTitle>
                <CardDescription>
                  Enter the details of the repair order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RepairOrderForm onSubmit={handleAddRepairOrder} />
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue='overview' className='space-y-4'>
            <TabsList className='bg-blueAccent/10'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='repair-orders'>Repair Orders</TabsTrigger>
              <TabsTrigger value='statistics'>Statistics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value='overview' className='space-y-4'>
              {user && (
                <StatsOverview userId={user.id} repairOrders={repairOrders} />
              )}
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                <Card className='col-span-4 border-tealAccent/30'>
                  <CardHeader>
                    <CardTitle>Weekly Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WeeklyEfficiencyChart data={dailyEfficiencyData} />
                  </CardContent>
                </Card>
                <Card className='col-span-3 border-orangeAccent/30'>
                  <CardHeader>
                    <CardTitle>Recent Repair Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RepairOrderList
                      repairOrders={repairOrders.slice(0, 5)}
                      compact
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Repair Orders Tab */}
            <TabsContent value='repair-orders' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>All Repair Orders</CardTitle>
                  <CardDescription>
                    View and manage all your repair orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RepairOrderList
                    repairOrders={repairOrders}
                    compact={false}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value='statistics' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Detailed statistics about your repair orders and efficiency
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-8'>
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    <Card>
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium text-blueAccent'>
                          Total Repair Orders
                        </CardTitle>
                        <Car className='h-4 w-4 text-blueAccent' />
                      </CardHeader>
                      <CardContent>
                        <div className='text-2xl font-bold text-blueAccent'>
                          {weeklyRepairOrders.length}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium text-orangeAccent'>
                          Total Labor Hours
                        </CardTitle>
                        <Clock className='h-4 w-4 text-orangeAccent' />
                      </CardHeader>
                      <CardContent>
                        <div className='text-2xl font-bold text-orangeAccent'>
                          {weeklyLaborHours.toFixed(1)}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium text-tealAccent'>
                          Efficiency Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='text-2xl font-bold text-tealAccent'>
                          {workedHoursThisWeek > 0
                            ? `${(
                                (weeklyLaborHours / workedHoursThisWeek) *
                                100
                              ).toFixed(1)}%`
                            : '0%'}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {user && (
                    <WorkHoursForm
                      userId={user.id}
                      onSave={() => fetchWorkedHours(user.id)}
                    />
                  )}

                  <Achievements
                    userId={user?.id || ''}
                    totalRepairOrders={weeklyRepairOrders.length}
                    totalLaborHours={weeklyLaborHours}
                    efficiencyRate={
                      workedHoursThisWeek > 0
                        ? parseFloat(
                            (
                              (weeklyLaborHours / workedHoursThisWeek) *
                              100
                            ).toFixed(1)
                          )
                        : 0
                    }
                  />

                  <WeeklyEfficiencyChart data={dailyEfficiencyData} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
