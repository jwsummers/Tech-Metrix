'use client';

import { useMemo } from 'react';
import { format, startOfDay, subDays, isWithinInterval } from 'date-fns';
import { Clock, BarChart3, TrendingUp, Car } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RepairOrder } from '@/types';

interface StatsOverviewProps {
  repairOrders: RepairOrder[];
}

export function StatsOverview({ repairOrders }: StatsOverviewProps) {
  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);

    const todayOrders = repairOrders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return isWithinInterval(orderDate, { start: today, end: new Date() });
    });

    const yesterdayOrders = repairOrders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return isWithinInterval(orderDate, { start: yesterday, end: today });
    });

    const todayOrderCount = todayOrders.length;
    const todayLaborHours = todayOrders.reduce(
      (sum, order) => sum + Number(order.labor_hours || 0),
      0
    );

    const yesterdayOrderCount = yesterdayOrders.length;
    const yesterdayLaborHours = yesterdayOrders.reduce(
      (sum, order) => sum + Number(order.labor_hours || 0),
      0
    );

    const orderCountChange =
      yesterdayOrderCount === 0
        ? todayOrderCount > 0
          ? 100
          : 0
        : ((todayOrderCount - yesterdayOrderCount) / yesterdayOrderCount) * 100;

    const laborHoursChange =
      yesterdayLaborHours === 0
        ? todayLaborHours > 0
          ? 100
          : 0
        : ((todayLaborHours - yesterdayLaborHours) / yesterdayLaborHours) * 100;

    // Efficiency: % of an 8-hour day
    const efficiency = todayLaborHours > 0 ? (todayLaborHours / 8) * 100 : 0;

    return {
      todayOrderCount,
      todayLaborHours: todayLaborHours.toFixed(1),
      orderCountChange: orderCountChange.toFixed(1),
      laborHoursChange: laborHoursChange.toFixed(1),
      efficiencyScore: Math.min(Math.max(efficiency, 0), 100).toFixed(0),
    };
  }, [repairOrders]);

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            Today&apos;s Repair Orders
          </CardTitle>
          <Car className='h-4 w-4 text-blueAccent'></Car>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.todayOrderCount}</div>
          <p className='text-xs text-muted-foreground flex items-center'>
            {Number(stats.orderCountChange) > 0 ? (
              <>
                <TrendingUp className='mr-1 h-3 w-3 text-green-500' />
                <span className='text-green-500'>
                  {stats.orderCountChange}%
                </span>{' '}
                from yesterday
              </>
            ) : Number(stats.orderCountChange) < 0 ? (
              <>
                <TrendingUp className='mr-1 h-3 w-3 text-red-500 rotate-180' />
                <span className='text-red-500'>
                  {Math.abs(Number(stats.orderCountChange))}%
                </span>{' '}
                from yesterday
              </>
            ) : (
              'Same as yesterday'
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            Today&apos;s Labor Hours
          </CardTitle>
          <Clock className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.todayLaborHours}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            Efficiency Score
          </CardTitle>
          <BarChart3 className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.efficiencyScore}%</div>
          <div className='mt-2 h-2 w-full rounded-full bg-muted'>
            <div
              className='h-2 rounded-full bg-green-500 transition-all duration-300'
              style={{ width: `${stats.efficiencyScore}%` }}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>Date</CardTitle>
          <Clock className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {format(new Date(), 'MMM d, yyyy')}
          </div>
          <p className='text-xs text-muted-foreground'>
            {format(new Date(), 'EEEE')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
