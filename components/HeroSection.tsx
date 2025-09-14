'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { HeroContent } from '@/types/hero';

export default function HeroSection() {
  const [heroData, setHeroData] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchHeroData() {
      try {
        const { data, error } = await supabase
          .from('hero_content')
          .select('*')
          .eq('active', true)
          .single();

        if (error) throw error;
        setHeroData(data);
      } catch (error) {
        console.error('Error fetching hero data:', error);
        // Fallback data
        setHeroData({
          id: '1',
          title: 'Nurture Your Child\'s',
          subtitle: 'Islamic Learning Journey',
          description: 'Join our comprehensive online Quran academy where experienced teachers guide children and adults in Islamic studies, Arabic language, and Quranic recitation from the comfort of your home.',
          primary_button_text: 'Start Free Trial',
          secondary_button_text: 'Enroll My Child',
          primary_button_link: '/trial',
          secondary_button_link: '/enrollment',
          hero_image_url: '/images/hero-student.jpg',
          hero_image_alt: 'Young student learning Quran',
          created_at: '',
          updated_at: ''
        });
      } finally {
        setLoading(false);
      }
    }

    fetchHeroData();
  }, [supabase]);

  if (loading) {
    return (
      <section className="min-h-[85vh] bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-xl font-body text-gray-600">Loading...</div>
      </section>
    );
  }

  if (!heroData) return null;

  return (
    <section className="relative min-h-screen w-full bg-gradient-to-br from-blue-900 via-indigo-800 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffcb52%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>

      {/* Geometric Decoration */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-7xl mx-auto px-4 py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-16 items-center min-h-screen">
          
          {/* Left Column - Content */}
          <div className="order-2 lg:order-1 space-y-4">
            <div className="space-y-4">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span 
                  className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {heroData.title}
                </span>
                <span className="font-heading block text-white mt-2">
                  {heroData.subtitle}
                </span>
              </h1>
              
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"></div>
            </div>

            <p className="font-body text-lg lg:text-xl text-blue-100 leading-relaxed max-w-2xl">
              {heroData.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 ">
            {/* Primary Button */}
            {/* <Link
              href={heroData.primary_button_link}
              className="px-4 py-2 font-body font-semibold rounded hover:scale-105 transition-transform duration-200"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
            >
              {heroData.primary_button_text}
            </Link> */}

            {/* Secondary Button */}
            <Link
              href={heroData.secondary_button_link}
              className="inline-flex items-center px-4 py-2 font-body font-semibold border border-blue-300 text-blue-100 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 rounded"
            >
              {heroData.secondary_button_text}
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-8 text-blue-200 font-body">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Certified Teachers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm">1000+ Students</span>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              {/* Decorative Card Background */}
              <div className="absolute inset-4 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10"></div>
              
              {/* Main Image Container */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={heroData.hero_image_url}
                    alt={heroData.hero_image_alt}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 668px) 100vw, 50vw"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-30 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}