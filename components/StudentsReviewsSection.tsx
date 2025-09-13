'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { StudentsReviewsSection as ReviewsSectionType, ReviewImage, FooterNavigationItem } from '@/types/student-reviews';
import { ChevronLeft, ChevronRight, Star, Users, MessageCircle, Pause, Play, Award, TrendingUp, Heart } from 'lucide-react';

// Clean data fetching service (same as before)
class ReviewsDataService {
  private supabase = createClientComponentClient();

  async fetchSectionData(): Promise<ReviewsSectionType> {
    const { data, error } = await this.supabase
      .from('students_reviews_section')
      .select('*')
      .eq('active', true)
      .single();

    if (error) throw error;
    return data;
  }

  async fetchReviewImages(): Promise<ReviewImage[]> {
    const { data, error } = await this.supabase
      .from('review_images')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async fetchFooterNavigation(): Promise<FooterNavigationItem[]> {
    const { data, error } = await this.supabase
      .from('footer_navigation')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async fetchAllData() {
    try {
      const [section, images, navigation] = await Promise.all([
        this.fetchSectionData(),
        this.fetchReviewImages(),
        this.fetchFooterNavigation()
      ]);

      return { section, images, navigation, error: null };
    } catch (error) {
      console.error('Error fetching reviews data:', error);
      return {
        section: this.getFallbackSection(),
        images: this.getFallbackImages(),
        navigation: this.getFallbackNavigation(),
        error: error as Error
      };
    }
  }

  private getFallbackSection(): ReviewsSectionType {
    return {
      id: '1',
      section_title: 'Students\' Reviews',
      section_subtitle: 'See what our students and parents say about their learning experience',
      divider_image_url: '/images/islamic-divider.svg',
      cta_button_text: 'Join Us Now',
      cta_button_link: '/free-trial',
      footer_frame_image_url: '/images/footer-frame.png',
      logo_url: '/images/qarabic-logo.png',
      logo_alt: 'Qarabic Academy Logo',
      active: true,
      created_at: '',
      updated_at: ''
    };
  }

  private getFallbackImages(): ReviewImage[] {
    return Array.from({ length: 29 }, (_, i) => ({
      id: (i + 1).toString(),
      title: `Student Review ${i + 1}`,
      image_url: `/images/reviews/${String(i + 1).padStart(2, '0')}.webp`,
      image_alt: `Student review testimonial ${i + 1}`,
      order_index: i + 1,
      active: true,
      created_at: '',
      updated_at: ''
    }));
  }

  private getFallbackNavigation(): FooterNavigationItem[] {
    return [
      { id: '1', label: 'Why Us', href: '#why_us', is_external: false, order_index: 1, active: true, created_at: '' },
      { id: '2', label: 'Courses', href: '#courses', is_external: false, order_index: 2, active: true, created_at: '' },
      { id: '3', label: 'Reviews', href: '#reviews', is_external: false, order_index: 3, active: true, created_at: '' },
      { id: '4', label: 'Get Free Trial', href: '/free-trial', is_external: false, order_index: 4, active: true, created_at: '' },
      { id: '5', label: 'Teachers Login', href: '/teachers-login', is_external: false, order_index: 5, active: true, created_at: '' }
    ];
  }
}

// Creative Horizontal Slider Component
const CreativeHorizontalSlider = ({ images }: { images: ReviewImage[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Responsive slide width and spacing
  const getSlideConfig = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return { slideWidth: 280, spacing: 16, visibleSlides: 1.2 }; // Mobile
      if (width < 768) return { slideWidth: 320, spacing: 20, visibleSlides: 1.5 }; // Small tablet
      if (width < 1024) return { slideWidth: 340, spacing: 24, visibleSlides: 2.2 }; // Tablet
      if (width < 1280) return { slideWidth: 360, spacing: 28, visibleSlides: 3.2 }; // Desktop
      return { slideWidth: 480, spacing: 32, visibleSlides: 4.0 }; // Large desktop
    }
    return { slideWidth: 460, spacing: 24, visibleSlides: 3.2 };
  };

  const [slideConfig, setSlideConfig] = useState(getSlideConfig());
  
  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setSlideConfig(getSlideConfig());
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentSlide, images.length]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Calculate transform offset
  const getTransformOffset = () => {
    const { slideWidth, spacing } = slideConfig;
    return -(currentSlide * (slideWidth + spacing));
  };

  return (
    <div className="relative w-full">
      {/* Slider Container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-3xl"
        style={{ height: '500px' }} // Fixed height to prevent layout shift
      >
        {/* Slides Wrapper */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{
            transform: `translateX(${getTransformOffset()}px)`,
            gap: `${slideConfig.spacing}px`
          }}
        >
          {/* Create extended array for infinite loop effect */}
          {[...images, ...images.slice(0, Math.ceil(slideConfig.visibleSlides) + 1)].map((image, index) => {
            const actualIndex = index % images.length;
            const isActive = actualIndex === currentSlide;
            
            return (
              <div
                key={`slide-${index}-${image.id}`}
                className={`flex-shrink-0 group relative transition-all duration-500 ${
                  isActive ? 'scale-105 z-10' : 'scale-95 z-0'
                }`}
                style={{
                  width: `${slideConfig.slideWidth}px`,
                  height: '90%'
                }}
              >
                {/* Image Container */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <Image
                    src={image.image_url}
                    alt={image.image_alt}
                    fill
                    className={`object-contain transition-all duration-700 ${
                      isActive
                        ? 'scale-100 brightness-100'
                        : 'scale-95 brightness-75 group-hover:scale-100 group-hover:brightness-90'
                    }`}
                    sizes={`${slideConfig.slideWidth}px`}
                    priority={index < 5}
                  />
                  
                  
                  {/* Slide Number Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`flex items-center gap-2 transition-all duration-300 ${
                      isActive ? 'scale-110' : 'scale-90'
                    }`}>
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">
                          {image.order_index.toString().padStart(2, '0')}
                        </span>
                      </div>
                      {isActive && (
                        <div className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1 animate-fadeIn">
                          <Award className="w-3 h-3" />
                          Active
                        </div>
                      )}
                    </div>
                  </div>

                  

                  {/* Shine Effect for Active Slide */}
                  {isActive && (
                    <div className="absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
        </button>

        {/* Auto-play Control */}
        <button
          onClick={toggleAutoPlay}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        >
          {isAutoPlaying ? (
            <Pause className="w-5 h-5 text-gray-700 group-hover:text-red-600 transition-colors" />
          ) : (
            <Play className="w-5 h-5 text-gray-700 group-hover:text-green-600 transition-colors" />
          )}
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center mt-8 gap-2 flex-wrap max-h-20 overflow-y-auto">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`relative transition-all duration-300 ${
              index === currentSlide
                ? 'w-12 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg'
                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-4">
        <span className="text-sm font-semibold text-gray-600">
          <span className="text-blue-600 text-lg">{currentSlide + 1}</span>
          <span className="mx-2 text-gray-400">/</span>
          <span>{images.length}</span>
        </span>
      </div>
    </div>
  );
};

export default function StudentsReviewsSection() {
  const [data, setData] = useState<{
    section: ReviewsSectionType | null;
    images: ReviewImage[];
    navigation: FooterNavigationItem[];
  }>({
    section: null,
    images: [],
    navigation: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const reviewsService = new ReviewsDataService();
    
    const loadData = async () => {
      setLoading(true);
      const result = await reviewsService.fetchAllData();
      
      setData({
        section: result.section,
        images: result.images,
        navigation: result.navigation
      });
      setError(result.error);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="text-center mb-16 hidden md:block">
              <div className="h-8 bg-gray-200 rounded-full w-64 mx-auto mb-6"></div>
              <div className="h-16 bg-gray-200 rounded-2xl w-1/2 mx-auto mb-8"></div>
              <div className="h-6 bg-gray-200 rounded-full w-2/3 mx-auto"></div>
            </div>
            
            {/* Slider Skeleton */}
            <div className="relative overflow-hidden rounded-3xl mb-24" style={{ height: '500px' }}>
              <div className="flex gap-6 h-full">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 bg-gray-200 rounded-2xl" style={{ width: '360px' }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data.section) {
    return (
      <section className="w-full py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="w-full max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
                        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-red-800 mb-4">
              Unable to Load Reviews
            </h3>
            <p className="text-red-600 text-lg mb-8 max-w-md mx-auto">
              We're having trouble loading student reviews at the moment. Please try again.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const { section, images, navigation } = data;

  return (
    <section className="w-full py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden" id="reviews">
      {/* Full-width Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-l from-blue-100/40 via-indigo-50/20 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-amber-100/30 via-orange-50/20 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-emerald-100/20 to-teal-50/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Professional Section Header - Hidden on mobile as per original */}
        <div className="text-center mb-20 hidden md:block">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full mb-8 shadow-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-blue-800 font-semibold text-lg">Student Testimonials</span>
            <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>

          {/* Professional Title */}
          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              {section.section_title}
            </span>
          </h2>

          {/* Elegant Divider */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-400 to-blue-600"></div>
              <div className="relative">
                <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full"></div>
                <div className="absolute inset-0 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-ping opacity-20"></div>
              </div>
              <div className="w-12 h-px bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full"></div>
              <div className="w-12 h-px bg-gradient-to-r from-indigo-600 to-blue-600"></div>
              <div className="relative">
                <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full"></div>
                <div className="absolute inset-0 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-ping opacity-20"></div>
              </div>
              <div className="w-24 h-px bg-gradient-to-l from-transparent via-blue-400 to-blue-600"></div>
            </div>
          </div>

          {/* Professional Subtitle */}
          {section.section_subtitle && (
            <p className="font-body text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {section.section_subtitle}
            </p>
          )}
        </div>

        {/* Creative Horizontal Slider */}
        <div className="mb-32">
          <CreativeHorizontalSlider images={images} />
        </div>

        {/* Premium Statistics Section */}
        <div className="relative mb-24">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
              {/* Happy Students */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto opacity-20 group-hover:scale-125 transition-transform duration-700"></div>
                </div>
                <div className="font-heading text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
                  {images.length}+
                </div>
                <div className="font-body text-lg text-gray-600 font-medium">Happy Students</div>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mt-4 group-hover:w-24 transition-all duration-500"></div>
              </div>
              
              {/* Average Rating */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-3 h-3 text-white fill-current group-hover:scale-110 transition-transform duration-300" 
                          style={{ animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mx-auto opacity-20 group-hover:scale-125 transition-transform duration-700"></div>
                </div>
                <div className="font-heading text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent mb-2">4.9</div>
                <div className="font-body text-lg text-gray-600 font-medium">Average Rating</div>
                <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mx-auto mt-4 group-hover:w-24 transition-all duration-500"></div>
              </div>
              
              {/* Satisfaction Rate */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto opacity-20 group-hover:scale-125 transition-transform duration-700"></div>
                </div>
                <div className="font-heading text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent mb-2">98%</div>
                <div className="font-body text-lg text-gray-600 font-medium">Satisfaction</div>
                <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto mt-4 group-hover:w-24 transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Call to Action */}
        <div className="text-center mb-20">
          <div className="relative inline-block">
            <Link
              href={section.cta_button_link}
              className="group relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white font-bold text-xl sm:text-2xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-3 transition-all duration-500 overflow-hidden"
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-green-700 to-teal-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <span className="relative z-10">{section.cta_button_text}</span>
              <div className="relative z-10 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 group-hover:rotate-45 transition-all duration-500">
                <ChevronRight className="w-6 h-6" />
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000"></div>
            </Link>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 rounded-2xl opacity-30 blur-xl scale-110 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"></div>
          </div>
          
          <p className="mt-8 text-lg sm:text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Join thousands of satisfied students and parents worldwide in their Arabic learning journey
          </p>
        </div>

        {/* Professional Footer Section */}
        <div className="relative">
          {/* Decorative Frame */}
          <div className="relative w-full mb-16 rounded-3xl overflow-hidden shadow-2xl">
            <div className="aspect-[16/5] relative">
              <Image
                                src={section.footer_frame_image_url}
                alt="Decorative Islamic frame"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-white/10 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-indigo-900/20"></div>
            </div>
          </div>

          {/* Footer Content */}
          <div className="text-center space-y-12">
            {/* Premium Logo */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="relative w-56 h-16 hover:scale-110 transition-transform duration-500">
                  <Image
                    src={section.logo_url}
                    alt={section.logo_alt}
                    fill
                    className="object-cover drop-shadow-lg"
                    sizes="224px"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              </div>
            </div>

            {/* Professional Navigation Menu - Desktop */}
            <div className="hidden md:block">
              <nav className="flex justify-center items-center gap-2 flex-wrap max-w-4xl mx-auto">
                {navigation.map((item, index) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    target={item.is_external ? '_blank' : '_self'}
                    rel={item.is_external ? 'noopener noreferrer' : ''}
                    className="group relative px-6 py-4 font-medium text-gray-700 hover:text-blue-700 transition-all duration-500 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-transparent hover:border-blue-200 hover:shadow-lg transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-12 transition-all duration-500 rounded-full"></div>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Professional Navigation Menu - Mobile */}
            <div className="md:hidden">
              <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto">
                {navigation.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    target={item.is_external ? '_blank' : '_self'}
                    rel={item.is_external ? 'noopener noreferrer' : ''}
                    className="py-4 px-6 font-medium text-gray-700 hover:text-blue-700 transition-all duration-300 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-300 text-center shadow-sm hover:shadow-lg transform hover:-translate-y-1"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}