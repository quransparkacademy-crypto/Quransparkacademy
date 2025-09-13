'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { LearningProcessSection as ProcessSectionType, ProcessStep } from '@/types/learning-process';
import { ArrowRight, PlayCircle, CheckCircle, UserPlus, Calendar, BookOpen } from 'lucide-react';

export default function LearningProcessSection() {
  const [sectionData, setSectionData] = useState<ProcessSectionType | null>(null);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchProcessData() {
      try {
        // Fetch section data
        const { data: section, error: sectionError } = await supabase
          .from('learning_process_section')
          .select('*')
          .eq('active', true)
          .single();

        if (sectionError) throw sectionError;

        // Fetch process steps
        const { data: steps, error: stepsError } = await supabase
          .from('process_steps')
          .select('*')
          .eq('active', true)
          .order('order_index', { ascending: true });

        if (stepsError) throw stepsError;

        setSectionData(section);
        setProcessSteps(steps || []);

      } catch (error) {
        console.error('Error fetching process data:', error);
        // Fallback data
        setSectionData({
          id: '1',
          title: 'Start Learning Quran',
          subtitle: 'Register yourself or register your child with us today in 3 Easy Steps and start your free trial class.',
          divider_image_url: '/images/islamic-divider.svg',
          cta_button_text: 'Join Us Now',
          cta_button_link: '/free-trial',
          active: true,
          created_at: '',
          updated_at: ''
        });

        setProcessSteps([
          {
            id: '1',
            title: 'One Click Registration',
            description: 'Simply Click Here which will take you to the registration page. You can register for free online Quran classes with our online Quran teachers just by filling in your name and contact information.',
            image_url: '/images/one-click-registration.png',
            image_alt: 'One Click Registration',
            step_number: 1,
            order_index: 1,
            active: true,
            created_at: '',
            updated_at: ''
          },
          {
            id: '2',
            title: 'Schedule Quran Free Trial',
            description: 'Upon receiving your registration, We will contact you back to set your convenience time for you for Free Quran Trial Classes and give you overview about our Quran teaching process.',
            image_url: '/images/schedule-trial.png',
            image_alt: 'Schedule Free Trial',
            step_number: 2,
            order_index: 2,
            active: true,
            created_at: '',
            updated_at: ''
          },
          {
            id: '3',
            title: 'Start Taking Your First Class',
            description: 'Login to our Student Portal with the provided credentials and start taking your first class with one of our online Qaari (Quran Teacher).',
            image_url: '/images/first-class.png',
            image_alt: 'Start First Class',
            step_number: 3,
            order_index: 3,
            active: true,
            created_at: '',
            updated_at: ''
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchProcessData();
  }, [supabase]);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse text-center">
            <div className="h-12 bg-gray-300 rounded w-1/3 mx-auto mb-8"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-48 h-48 bg-gray-300 rounded-full mx-auto"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!sectionData) return null;

  const stepIcons = [
    <UserPlus key="user" className="w-8 h-8" />,
    <Calendar key="calendar" className="w-8 h-8" />,
    <BookOpen key="book" className="w-8 h-8" />
  ];

  return (
    <section id='Learning_Process' className="py-20 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-50 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-amber-50 to-transparent rounded-full blur-3xl"></div>
      
      {/* Subtle Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffcb52%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent">
              {sectionData.title}
            </span>
          </h2>

          {/* Custom Divider */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-400"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
            <div className="w-6 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>

          <p className="font-body text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {sectionData.subtitle}
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300"></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {processSteps.map((step, index) => (
              <div key={step.id} className="relative group">
                
                {/* Step Card */}
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ">
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-heading font-bold text-lg">{step.step_number}</span>
                    </div>
                  </div>

                  <div className="pt-8 pb-8 px-8 text-center">
                    
                    {/* Step Image */}
                    <div className="relative w-48 h-48 mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full opacity-20"></div>
                      <Image
                        src={step.image_url}
                        alt={step.image_alt}
                        fill
                        className="object-contain p-6"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      
                      {/* Icon Overlay */}
                      <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                        <div className="text-white">
                          {stepIcons[index] || <CheckCircle className="w-6 h-6" />}
                        </div>
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="space-y-4">
                      <h3 className="font-heading text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {step.title}
                      </h3>
                      
                                            <p className="font-body text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Step Progress Indicator */}
                    <div className="mt-6 flex justify-center">
                      <div className="flex space-x-2">
                        {processSteps.map((_, stepIndex) => (
                          <div
                            key={stepIndex}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                              stepIndex <= index
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow Between Steps */}
                {index < processSteps.length - 1 && (
                  <div className="hidden md:flex absolute top-24 -right-6 lg:-right-8 items-center justify-center z-10">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link
            href={sectionData.cta_button_link}
            className="group inline-flex items-center overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <span className="px-6 py-4 bg-[var(--color-primary)] text-[var(--color-dark)] font-body font-bold text-lg transition-colors duration-300 group-hover:bg-[var(--color-secondary)] group-hover:text-white">
              {sectionData.cta_button_text}
            </span>
            <div className="px-4 py-4 bg-[var(--color-accent)] text-white group-hover:bg-[var(--color-dark)] transition-colors duration-300">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </Link>

          {/* Additional Benefits */}
          {/* <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600 font-body">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>100% Free Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Expert Teachers</span>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}