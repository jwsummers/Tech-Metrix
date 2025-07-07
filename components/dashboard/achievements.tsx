'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BadgeCheck, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date_earned: string;
}

interface AchievementsProps {
  userId: string;
  totalRepairOrders: number;
  totalLaborHours: number;
  efficiencyRate: number;
  refreshAchievementsTrigger?: number;
}

export function Achievements({
  userId,
  totalRepairOrders,
  totalLaborHours,
  efficiencyRate,
  refreshAchievementsTrigger = 0,
}: AchievementsProps) {
  const [earned, setEarned] = useState<Achievement[]>([]);

  const allPossibleAchievements = [
    {
      id: 'first-repair',
      title: 'First Repair Order',
      description: 'Logged your first repair order.',
    },
    {
      id: 'ten-repairs',
      title: '10 Repair Orders',
      description: 'Logged 10 repair orders.',
    },
    {
      id: 'fifty-hours',
      title: '50 Labor Hours',
      description: 'Logged 50 total labor hours.',
    },
    {
      id: 'perfect-efficiency',
      title: '100% Weekly Efficiency',
      description: 'Achieved perfect efficiency for the week.',
    },
  ];

  useEffect(() => {
    fetchAchievements();
  }, [refreshAchievementsTrigger]);

  const fetchAchievements = async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching achievements:', error);
      return;
    }

    setEarned(data || []);
  };

  const hasAchievement = (title: string) =>
    earned.some((ach) => ach.title === title);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {allPossibleAchievements.map((ach) => {
          const unlocked = hasAchievement(ach.title);
          const earnedDate = earned.find(
            (a) => a.title === ach.title
          )?.date_earned;

          return (
            <div
              key={ach.id}
              className={`flex items-center gap-3 p-3 rounded border ${
                unlocked
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-100 opacity-50'
              }`}
            >
              {unlocked ? (
                <BadgeCheck className='text-green-500' />
              ) : (
                <Lock className='text-gray-400' />
              )}
              <div>
                <div className='font-semibold'>{ach.title}</div>
                <div className='text-sm text-muted-foreground'>
                  {ach.description}
                </div>
                {unlocked && earnedDate && (
                  <div className='text-xs text-muted-foreground mt-1'>
                    Earned: {format(new Date(earnedDate), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
