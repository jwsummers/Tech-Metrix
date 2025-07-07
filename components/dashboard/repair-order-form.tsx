'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface RepairOrderFormData {
  year: string;
  make: string;
  model: string;
  vin: string;
  labor_hours: string;
  description: string;
}

interface RepairOrderFormProps {
  onSubmit: (data: any) => Promise<void>;
}

export function RepairOrderForm({ onSubmit }: RepairOrderFormProps) {
  const [formData, setFormData] = useState<RepairOrderFormData>({
    year: '',
    make: '',
    model: '',
    vin: '',
    labor_hours: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (
        !formData.year ||
        !formData.make ||
        !formData.model ||
        !formData.labor_hours
      ) {
        throw new Error('Please fill in all required fields');
      }

      const newOrder = {
        ...formData,
        created_at: new Date().toISOString(),
        year: Number.parseInt(formData.year),
        labor_hours: Number.parseFloat(formData.labor_hours),
      };

      await onSubmit(newOrder);

      toast({
        title: 'Repair order added',
        description: `${formData.year} ${formData.make} ${formData.model} has been added successfully.`,
      });

      setFormData({
        year: '',
        make: '',
        model: '',
        vin: '',
        labor_hours: '',
        description: '',
      });
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to add repair order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 rounded-lg border border-blueAccent/20 p-6 shadow-md'
    >
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='space-y-2'>
          <Label htmlFor='year'>Year *</Label>
          <Input
            id='year'
            name='year'
            type='number'
            placeholder='2023'
            value={formData.year}
            onChange={handleChange}
            required
            className='focus:border-blueAccent focus:ring-1 focus:ring-blueAccent'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='make'>Make *</Label>
          <Input
            id='make'
            name='make'
            placeholder='Toyota'
            value={formData.make}
            onChange={handleChange}
            required
            className='focus:border-blueAccent focus:ring-1 focus:ring-blueAccent'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='model'>Model *</Label>
          <Input
            id='model'
            name='model'
            placeholder='Camry'
            value={formData.model}
            onChange={handleChange}
            required
            className='focus:border-blueAccent focus:ring-1 focus:ring-blueAccent'
          />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='vin'>VIN (Optional)</Label>
          <Input
            id='vin'
            name='vin'
            placeholder='1HGCM82633A123456'
            value={formData.vin}
            onChange={handleChange}
            className='focus:border-orangeAccent focus:ring-1 focus:ring-orangeAccent'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='labor_hours'>Labor Hours *</Label>
          <Input
            id='labor_hours'
            name='labor_hours'
            type='number'
            step='0.1'
            placeholder='2.5'
            value={formData.labor_hours}
            onChange={handleChange}
            required
            className='focus:border-pinkAccent focus:ring-1 focus:ring-pinkAccent'
          />
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='description'>Description (Optional)</Label>
        <Input
          id='description'
          name='description'
          placeholder='Oil change, tire rotation, etc.'
          value={formData.description}
          onChange={handleChange}
          className='focus:border-tealAccent focus:ring-1 focus:ring-tealAccent'
        />
      </div>
      <Button
        type='submit'
        className='w-full bg-blueAccent hover:bg-tealAccent text-white transition-colors duration-300'
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Submitting...
          </>
        ) : (
          'Add Repair Order'
        )}
      </Button>
    </form>
  );
}
