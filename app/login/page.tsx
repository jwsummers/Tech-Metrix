'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Login successful',
        description: 'Welcome back to TechMetrix!',
      });

      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description:
          error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-white via-blueAccent/5 to-tealAccent/10'>
      <div className='flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-6 rounded-lg border border-blueAccent/10 bg-white p-8 shadow-md'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Link
              href='/'
              className='flex items-center gap-2 text-blueAccent hover:opacity-90 transition'
            >
              <Image
                src='/TM-logoRB.png'
                alt='TechMetrix Logo'
                width={28}
                height={28}
              />
              <span className='text-2xl font-bold'>TechMetrix</span>
            </Link>
            <h1 className='text-3xl font-bold text-blueAccent'>Welcome back</h1>
            <p className='text-gray-500'>
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleLogin} className='space-y-4'>
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
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Password</Label>
                <Link
                  href='#'
                  className='text-sm text-pinkAccent hover:underline hover:underline-offset-4 transition'
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='focus-visible:ring-tealAccent'
              />
            </div>
            <Button
              type='submit'
              className='w-full bg-blueAccent hover:bg-tealAccent transition text-white'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className='text-center text-sm text-gray-600'>
            Don&apos;t have an account?{' '}
            <Link
              href='/register'
              className='font-medium text-blueAccent hover:text-tealAccent transition underline underline-offset-4'
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
