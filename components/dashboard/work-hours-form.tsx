'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface WorkLog {
  id?: string;
  date: string;
  worked_hours: number;
  is_day_off: boolean;
}

export function WorkHoursForm() {
  const [workedHours, setWorkedHours] = useState<number>(8);
  const [isDayOff, setIsDayOff] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodayWorkLog();
  }, []);

  const fetchTodayWorkLog = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('work_logs')
      .select('*')
      .eq('date', today)
      .single();

    if (data) {
      setWorkedHours(data.worked_hours);
      setIsDayOff(data.is_day_off);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase.from('work_logs').upsert([
      {
        date: today,
        worked_hours: isDayOff ? 0 : workedHours,
        is_day_off: isDayOff,
      },
    ]);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Worked hours updated successfully.',
      });
    }

    setLoading(false);
  };

  return (
    <Card className='border-blueAccent/20'>
      <CardHeader>
        <CardTitle>Adjust Today's Worked Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={isDayOff}
              onChange={(e) => setIsDayOff(e.target.checked)}
            />
            Mark as Day Off
          </label>

          {!isDayOff && (
            <Input
              type='number'
              min='0'
              step='0.1'
              value={workedHours}
              onChange={(e) => setWorkedHours(parseFloat(e.target.value))}
              className='w-32'
            />
          )}

          <Button
            type='submit'
            className='w-32 bg-blueAccent text-white hover:bg-tealAccent'
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
