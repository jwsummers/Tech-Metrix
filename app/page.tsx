import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Car, Clock, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='border-b'>
        <div className='container flex h-16 items-center justify-between px-4 md:px-6'>
          <div className='flex items-center gap-2'>
            <Image src='/TM-logoRB.png' alt='Logo' width={78} height={78} />
            <span className='text-xl font-bold text-blueAccent'>
              TechMetrix
            </span>
          </div>
          <nav className='hidden md:flex gap-6'>
            <Link
              href='#features'
              className='text-sm font-medium text-gray-700 hover:text-tealAccent transition-colors duration-200'
            >
              Features
            </Link>
            <Link
              href='#how-it-works'
              className='text-sm font-medium text-gray-700 hover:text-tealAccent transition-colors duration-200'
            >
              How It Works
            </Link>
          </nav>
          <div className='flex gap-4'>
            <Link href='/login'>
              <Button
                variant='outline'
                className='hover:border-blueAccent hover:text-blueAccent transition-colors duration-200'
              >
                Login
              </Button>
            </Link>
            <Link href='/register'>
              <Button className='bg-blueAccent hover:bg-tealAccent text-white transition-colors duration-200'>
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
              <div className='space-y-4'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blueAccent'>
                  Track Repair Orders with Precision
                </h1>
                <p className='text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  TechMetrix helps automotive technicians track repair orders,
                  monitor labor hours, and analyze performance metrics to
                  improve efficiency.
                </p>
                <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                  <Link href='/register'>
                    <Button
                      size='lg'
                      className='gap-2 bg-blueAccent hover:bg-tealAccent text-white transition duration-300'
                    >
                      Get Started
                      <ArrowRight className='h-4 w-4' />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className='flex items-center justify-center'>
                <div className='relative w-full h-[300px] md:h-[400px] bg-gray-100 rounded-lg overflow-hidden'>
                  <div className='absolute inset-0 flex items-center justify-center text-gray-400'>
                    <BarChart3 className='h-24 w-24' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id='features'
          className='w-full py-12 md:py-24 lg:py-32 bg-gray-50'
        >
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-tealAccent'>
                  Features
                </h2>
                <p className='max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Everything you need to track and analyze repair orders
                </p>
              </div>
            </div>
            <div className='mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12'>
              <div className='flex flex-col items-center space-y-4 text-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-orangeAccent/10 text-orangeAccent transition-transform duration-200 hover:scale-110'>
                  <Car className='h-8 w-8' />
                </div>
                <div className='space-y-2'>
                  <h3 className='text-xl font-bold'>Vehicle Tracking</h3>
                  <p className='text-gray-600'>
                    Log vehicle details including year, make, model, and VIN for
                    each repair order.
                  </p>
                </div>
              </div>
              <div className='flex flex-col items-center space-y-4 text-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-tealAccent/10 text-tealAccent transition-transform duration-200 hover:scale-110'>
                  <Clock className='h-8 w-8' />
                </div>
                <div className='space-y-2'>
                  <h3 className='text-xl font-bold'>Labor Hours</h3>
                  <p className='text-gray-600'>
                    Track labor hours for each repair order to monitor
                    productivity and billing.
                  </p>
                </div>
              </div>
              <div className='flex flex-col items-center space-y-4 text-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-pinkAccent/10 text-pinkAccent transition-transform duration-200 hover:scale-110'>
                  <BarChart3 className='h-8 w-8' />
                </div>
                <div className='space-y-2'>
                  <h3 className='text-xl font-bold'>Performance Metrics</h3>
                  <p className='text-gray-600'>
                    View daily and weekly statistics to analyze efficiency and
                    performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id='how-it-works' className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-pinkAccent'>
                  How It Works
                </h2>
                <p className='max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Simple steps to improve your repair order tracking
                </p>
              </div>
            </div>
            <div className='mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12'>
              {[1, 2, 3].map((step, i) => (
                <div
                  key={step}
                  className='flex flex-col items-center space-y-4 text-center'
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blueAccent/10 text-blueAccent font-bold'>
                    {step}
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-xl font-bold'>
                      {step === 1
                        ? 'Register Account'
                        : step === 2
                        ? 'Log Repair Orders'
                        : 'Track Performance'}
                    </h3>
                    <p className='text-gray-600'>
                      {step === 1
                        ? 'Create your technician account to access the dashboard.'
                        : step === 2
                        ? 'Enter vehicle details and labor hours for each repair order.'
                        : 'View statistics and metrics to analyze your efficiency.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className='border-t'>
        <div className='container flex flex-col gap-2 py-6 px-4 md:flex-row md:items-center md:justify-between md:px-6'>
          <div className='flex items-center gap-2 text-blueAccent'>
            <Car className='h-5 w-5' />
            <span className='text-lg font-bold'>TechMetrix</span>
          </div>
          <p className='text-xs text-gray-500 hover:text-blueAccent transition-colors duration-200'>
            © 2024 TechMetrix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
