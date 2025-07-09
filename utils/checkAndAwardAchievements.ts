import { supabase } from '@/lib/supabase';

export async function checkAndAwardAchievements({
  userId,
  totalRepairOrders,
  totalLaborHours,
  efficiencyRate,
}: {
  userId: string;
  totalRepairOrders: number;
  totalLaborHours: number;
  efficiencyRate: number;
}) {
  const { data: existing, error } = await supabase
    .from('achievements')
    .select('title')
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to fetch achievements:', error);
    return;
  }

  const existingTitles = existing?.map((a) => a.title) || [];

  const potentialAchievements = [
    {
      title: 'First Repair Order',
      description: 'Logged your first repair order.',
      condition: totalRepairOrders >= 1,
    },
    {
      title: '10 Repair Orders',
      description: 'Logged 10 repair orders.',
      condition: totalRepairOrders >= 10,
    },
    {
      title: '50 Labor Hours',
      description: 'Logged 50 total labor hours.',
      condition: totalLaborHours >= 50,
    },
    {
      title: '100% Weekly Efficiency',
      description: 'Achieved perfect efficiency for the week.',
      condition: efficiencyRate >= 100,
    },
  ];

  for (const ach of potentialAchievements) {
    if (!existingTitles.includes(ach.title) && ach.condition) {
      const { error: insertError } = await supabase.from('achievements').insert({
        user_id: userId,
        title: ach.title,
        description: ach.description,
      });

      if (insertError) {
        console.error(`Failed to insert achievement "${ach.title}":`, insertError);
      } else {
        console.log(`Achievement unlocked: ${ach.title}`);
      }
    }
  }
}
