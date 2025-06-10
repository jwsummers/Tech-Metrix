'use client';

import { useMemo } from 'react';
import {
  format,
  startOfWeek,
  addDays,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import type { RepairOrder } from '@/types';

interface WeeklyStatsProps {
  repairOrders: RepairOrder[];
  height?: number;
}

export function WeeklyStats({ repairOrders, height = 200 }: WeeklyStatsProps) {
  const weeklyData = useMemo(() => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });

    const days = Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(startOfCurrentWeek, index);
      const dayName = format(date, 'EEE');

      const dayOrders = repairOrders.filter((order) => {
        const orderDate = parseISO(order.created_at);
        const dayStart = new Date(date);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        return isWithinInterval(orderDate, { start: dayStart, end: dayEnd });
      });

      const orderCount = dayOrders.length;
      const laborHours = dayOrders.reduce(
        (sum, order) => sum + Number(order.labor_hours || 0),
        0
      );

      return { day: dayName, orderCount, laborHours };
    });

    const maxOrders = Math.max(...days.map((d) => d.orderCount), 1);
    const maxHours = Math.max(...days.map((d) => d.laborHours), 1);

    return { days, maxOrders, maxHours };
  }, [repairOrders]);

  return (
    <div className='w-full space-y-4'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-1'>
          <div className='h-3 w-3 rounded-full bg-blueAccent' />
          <span className='text-xs text-muted-foreground'>Orders</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='h-3 w-3 rounded-full bg-green-500' />
          <span className='text-xs text-muted-foreground'>Labor Hours</span>
        </div>
      </div>

      <div className='relative' style={{ height: `${height}px` }}>
        <div className='absolute inset-0 flex items-end justify-between'>
          {weeklyData.days.map((day, index) => (
            <div key={index} className='flex flex-col items-center gap-2 w-1/7'>
              <div className='relative w-full flex justify-center h-full'>
                <div
                  className='w-4 bg-green-500 rounded-t-sm'
                  style={{
                    height: `${(day.laborHours / weeklyData.maxHours) * 100}%`,
                    opacity: day.laborHours > 0 ? 1 : 0.3,
                  }}
                />
                <div
                  className='w-4 bg-blueAccent rounded-t-sm absolute left-1/2 transform -translate-x-8'
                  style={{
                    height: `${(day.orderCount / weeklyData.maxOrders) * 100}%`,
                    opacity: day.orderCount > 0 ? 1 : 0.3,
                  }}
                />
              </div>
              <div className='text-xs font-medium'>{day.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
