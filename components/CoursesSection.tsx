'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Course, CourseOutline, CoursesSection as CoursesSectionType } from '@/types/courses';
import { Check, BookOpen, Users, GraduationCap, Globe } from 'lucide-react';
import { MainStatistics } from './StatisticsDataService';

// Import the MainStatistics component
// import { MainStatistics } from '@/components/Statistics';

export default function CoursesSection() {
  // ... your existing state and useEffect code remains the same ...
  const [sectionData, setSectionData] = useState<CoursesSectionType | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseOutlines, setCourseOutlines] = useState<{[key: string]: CourseOutline[]}>({});
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchCoursesData() {
      try {
        // Fetch section data
        const { data: section, error: sectionError } = await supabase
          .from('courses_section')
          .select('*')
          .eq('active', true)
          .single();

        if (sectionError) throw sectionError;

        // Fetch courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .eq('active', true)
          .order('order_index', { ascending: true });

        if (coursesError) throw coursesError;

        // Fetch course outlines
        const { data: outlines, error: outlinesError } = await supabase
          .from('course_outlines')
          .select('*')
          .eq('active', true)
          .order('order_index', { ascending: true });

        if (outlinesError) throw outlinesError;

        // Group outlines by course_id
        const groupedOutlines: {[key: string]: CourseOutline[]} = {};
        outlines?.forEach(outline => {
          if (!groupedOutlines[outline.course_id]) {
            groupedOutlines[outline.course_id] = [];
          }
          groupedOutlines[outline.course_id].push(outline);
        });

        setSectionData(section);
        setCourses(coursesData || []);
        setCourseOutlines(groupedOutlines);
        setActiveTab(coursesData?.[0]?.id || '');

      } catch (error) {
        console.error('Error fetching courses data:', error);
        // Your existing fallback data...
        setSectionData({
          id: '1',
          section_title: 'Our Courses',
          section_subtitle: 'Comprehensive Islamic Education Programs',
          divider_image_url: '/images/islamic-divider.svg',
          active: true,
          created_at: '',
          updated_at: ''
        });

        const fallbackCourses = [
          {
            id: '1',
            title: 'Quran for Kids',
            slug: 'quran-for-kids',
            description: 'The ideal approach with your child is to begin teaching them the Quran at a young age.',
            image_url: '/images/quran-kids.jpg',
            image_alt: 'Children learning Quran',
            button_text: 'Join Us Now',
            button_link: '/free-trial',
            order_index: 1,
            active: true,
            created_at: '',
            updated_at: ''
          }
        ];

        setCourses(fallbackCourses);
        setActiveTab('1');
      } finally {
        setLoading(false);
      }
    }

    fetchCoursesData();
  }, [supabase]);

  const activeCourse = courses.find(course => course.id === activeTab);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse text-center">
            <div className="h-12 bg-gray-300 rounded w-1/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!sectionData) return null;

  return (
    <section className="py-12 sm:py-10 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden" id="courses">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-indigo-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-amber-100/40 to-yellow-100/40 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-4">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent">
              {sectionData.section_title}
            </span>
          </h2>

                    {sectionData.section_subtitle && (
            <p className="font-body text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              {sectionData.section_subtitle}
            </p>
          )}

          {/* Custom Divider */}
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-400"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
            <div className="w-6 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
        </div>

        {/* Course Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 bg-white/70 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/20">
            {courses.map((course, index) => {
              const icons = [
                <Users key="users" className="w-5 h-5" />,
                <BookOpen key="book" className="w-5 h-5" />,
                <GraduationCap key="grad" className="w-5 h-5" />,
                <Globe key="globe" className="w-5 h-5" />
              ];

              return (
                <button
                  key={course.id}
                  onClick={() => setActiveTab(course.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl font-body font-semibold text-sm transition-all duration-300 ${
                    activeTab === course.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {icons[index] || <BookOpen className="w-5 h-5" />}
                  <span className="hidden sm:inline">{course.title}</span>
                  <span className="sm:hidden">{course.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Course Content */}
        {activeCourse && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="grid lg:grid-cols-2 gap-0">
              
              {/* Content Side */}
              <div className="p-4 lg:p-12 order-2 lg:order-1">
                <div className="space-y-2">
                  
                  {/* Course Title */}
                  <div className="space-y-2">
                    <h3 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900">
                      {activeCourse.title}
                    </h3>
                    
                    {/* Decorative Line */}
                    <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
                  </div>

                  {/* Course Description */}
                  <div className="prose prose-lg text-gray-700 font-body leading-relaxed">
                    <p>{activeCourse.description}</p>
                  </div>

                  {/* Course Outlines */}
                  {courseOutlines[activeCourse.id] && (
                    <div className="space-y-4">
                      <h4 className="font-heading text-xl font-bold text-gray-900">Course Outlines</h4>
                      <div className="grid">
                        {courseOutlines[activeCourse.id].map((outline) => (
                          <div key={outline.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-300">
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-body font-semibold text-gray-800">{outline.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Button - uncommented if needed */}
                  {/* <div className="pt-2">
                    <Link
                      href={activeCourse.button_link}
                      className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-body font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <span>{activeCourse.button_text}</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div> */}
                </div>
              </div>

              {/* Image Side */}
              <div className="relative order-1 lg:order-2 bg-gradient-to-br from-blue-100 to-indigo-100">
                <div className="aspect-square lg:aspect-auto lg:h-full relative overflow-hidden">
                  <Image
                    src={activeCourse.image_url}
                    alt={activeCourse.image_alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
                  
                  {/* Floating Badge */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <div className="flex items-center gap-2 text-sm font-body font-semibold text-gray-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Available Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPLACE the hardcoded Trust Indicators with MainStatistics */}
        <div className="mt-8">
          <MainStatistics variant="inline" />
        </div>
      </div>
    </section>
  );
}