'use client';

import { useMemo } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import type { RepairOrder } from '@/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

interface WeeklyStatsProps {
  repairOrders: RepairOrder[];
  height?: number;
}

export function WeeklyStats({ repairOrders, height = 250 }: WeeklyStatsProps) {
  const weeklyData = useMemo(() => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });

    return Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(startOfCurrentWeek, index);
      const dayName = format(date, 'EEE');
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD

      const dayOrders = repairOrders.filter((order) => {
        const orderDateString = new Date(order.created_at)
          .toISOString()
          .split('T')[0];
        return orderDateString === dateString;
      });

      const orderCount = dayOrders.length;
      const laborHours = dayOrders.reduce(
        (sum, order) => sum + Number(order.labor_hours || 0),
        0
      );

      return {
        day: dayName,
        orders: orderCount,
        laborHours,
      };
    });
  }, [repairOrders]);

  const hasData = weeklyData.some((d) => d.orders > 0 || d.laborHours > 0);

  return (
    <div className='w-full space-y-4'>
      <h2 className='text-lg font-semibold text-blueAccent'>
        Weekly Performance
      </h2>

      {hasData ? (
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='day' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='laborHours' fill='#14B8A6' name='Labor Hours' />
              <Bar dataKey='orders' fill='#1791c8' name='Repair Orders' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div
          className='flex items-center justify-center text-sm text-muted-foreground'
          style={{ height }}
        >
          No data for this week yet.
        </div>
      )}
    </div>
  );
}
