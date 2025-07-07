'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ email, name }]);

      if (profileError) throw profileError;

      toast({
        title: 'Registration successful',
        description: 'Your account has been created. You can now log in.',
      });

      router.push('/login');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description:
          error.message || 'Please check your information and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-white via-blueAccent/5 to-tealAccent/10'>
      <div className='flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='w-[90%] sm:max-w-md space-y-5 rounded-lg border border-blueAccent/10 bg-white p-8 shadow-md'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Link
              href='/'
              className='flex items-center gap-2 text-blueAccent hover:opacity-90 transition'
            >
              <Image
                src='/Logo-fullRB-crop.png'
                alt='TechTracktion Logo'
                width={160}
                height={160}
              />
            </Link>
            <h1 className='text-3xl font-bold text-blueAccent'>
              Create an account
            </h1>
            <p className='text-gray-500'>
              Enter your information to create an account
            </p>
          </div>

          <form onSubmit={handleRegister} className='space-y-3'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                placeholder='John Doe'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='focus-visible:ring-blueAccent'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='m@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='focus-visible:ring-blueAccent'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='focus-visible:ring-blueAccent'
              />
            </div>
            <Button
              type='submit'
              className={`w-full text-white transition ${
                isLoading
                  ? 'bg-blueAccent/60 cursor-not-allowed'
                  : 'bg-blueAccent hover:bg-blueAccent/90'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className='text-center text-sm text-gray-600'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='font-medium text-blueAccent hover:text-tealAccent transition underline underline-offset-4'
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
