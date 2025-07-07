'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { RepairOrder } from '@/types';

interface RepairOrderListProps {
  repairOrders: RepairOrder[];
  compact?: boolean;
}

export function RepairOrderList({
  repairOrders,
  compact = false,
}: RepairOrderListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = repairOrders.filter((order) => {
    const searchString = `${order.year} ${order.make} ${order.model} ${
      order.vin || ''
    } ${order.description || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  if (repairOrders.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-8 text-center'>
        <p className='text-muted-foreground'>No repair orders found</p>
        <p className='text-sm text-muted-foreground'>
          Add your first repair order to get started
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {!compact && (
        <div className='relative'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search repair orders...'
            className='pl-8'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              {!compact && <TableHead>VIN</TableHead>}
              <TableHead>Labor Hours</TableHead>
              {!compact && <TableHead>Description</TableHead>}
              {!compact && <TableHead>Date</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={compact ? 3 : 5}
                  className='text-center text-muted-foreground'
                >
                  No matching repair orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell className='font-medium'>
                    {order.year} {order.make} {order.model}
                  </TableCell>
                  {!compact && (
                    <TableCell>
                      {order.vin ? (
                        <Badge variant='outline' className='font-mono text-xs'>
                          {order.vin}
                        </Badge>
                      ) : (
                        <span className='text-muted-foreground text-sm'>
                          Not provided
                        </span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>{order.labor_hours}</TableCell>
                  {!compact && (
                    <TableCell className='max-w-[200px] truncate'>
                      {order.description || (
                        <span className='text-muted-foreground text-sm'>
                          No description
                        </span>
                      )}
                    </TableCell>
                  )}
                  {!compact && (
                    <TableCell className='text-muted-foreground'>
                      {format(new Date(order.created_at), 'MMM d, yyyy')}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
