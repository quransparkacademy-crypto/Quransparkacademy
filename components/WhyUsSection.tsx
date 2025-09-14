'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { WhyUsContent } from '@/types/whyus';
import { CheckCircle, Star, Users, Clock } from 'lucide-react';

export default function WhyUsSection() {
  const [whyUsData, setWhyUsData] = useState<WhyUsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchWhyUsData() {
      try {
        const { data, error } = await supabase
          .from('why_us_content')
          .select('*')
          .eq('active', true)
          .single();

        if (error) throw error;
        setWhyUsData(data);
      } catch (error) {
        console.error('Error fetching why us data:', error);
        // Fallback data
        setWhyUsData({
          id: '1',
          title: 'Why Choose Our Academy?',
          description: 'At our academy, we are committed to offering the most effective methods for understanding the meanings of the Quran, reinforcing Islamic values, and simplifying the process of recitation and memorization all under the guidance of our highly experienced teachers. Our flexible scheduling and regular progress reports ensure that each learner advances at their own pace.',
          button_text: 'Join Us Today',
          button_link: '/enrollment',
          image_url: '/images/quran-stand.jpg',
          image_alt: 'Beautiful Quran on wooden stand with prayer beads',
          highlights: [
            'Certified & Experienced Teachers',
            'Flexible Scheduling Options',
            'Regular Progress Reports',
            'Personalized Learning Path'
          ],
          active: true,
          created_at: '',
          updated_at: ''
        });
      } finally {
        setLoading(false);
      }
    }

    fetchWhyUsData();
  }, [supabase]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!whyUsData) return null;

  return (
    <section className="relative py-14 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden" id="why_us">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-amber-100/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-blue-100/40 to-transparent rounded-full blur-3xl"></div>
      
      {/* Subtle Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23164783%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Column - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/20 to-blue-200/20 rounded-3xl blur-lg"></div>
              
              {/* Main Image Container */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ padding: '20%' }}>
                <div className="aspect-square relative">
                  <Image
                    src={whyUsData.image_url}
                    alt={whyUsData.image_alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-heading font-bold text-gray-900">1000+</div>
                    <div className="text-sm text-gray-600 font-body">Happy Students</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-heading font-bold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-600 font-body">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-2">
              <div className="space-y-2">
                {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full">
                  <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-body font-medium" style={{ color: 'var(--color-secondary)' }}>
                    Excellence in Islamic Education
                  </span>
                </div> */}
                
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent">
                    {whyUsData.title}
                  </span>
                </h2>
                
                <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
              </div>

              <p className="font-body text-lg text-gray-700 leading-relaxed">
                {whyUsData.description}
              </p>

              {/* Highlights */}
              <div className="grid sm:grid-cols-2 gap-2">
                {whyUsData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-body text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="sm:pt-2 md:pt-2 lg:pt-6">
              <Link
                href={whyUsData.button_link}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-body font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                {whyUsData.button_text}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center sm:gap-4 md:gap-4 lg:gap-6 md:pt-2 lg:pt-6 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-body">5-Star Rated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}