'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { StatisticsAchievement } from '@/types/student-reviews';
import * as LucideIcons from 'lucide-react';

// Statistics Data Service
class StatisticsDataService {
  private supabase = createClientComponentClient();

  async fetchStatisticsByCategory(category: string): Promise<StatisticsAchievement[]> {
    const { data, error } = await this.supabase
      .from('statistics_achievements')
      .select('*')
      .eq('category', category)
      .eq('active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async fetchAllStatistics(): Promise<Record<string, StatisticsAchievement[]>> {
    const { data, error } = await this.supabase
      .from('statistics_achievements')
      .select('*')
      .eq('active', true)
      .order('category')
      .order('order_index', { ascending: true });

    if (error) throw error;

    // Group by category
    const grouped = (data || []).reduce((acc, stat) => {
      if (!acc[stat.category]) {
        acc[stat.category] = [];
      }
      acc[stat.category].push(stat);
      return acc;
    }, {} as Record<string, StatisticsAchievement[]>);

    return grouped;
  }
}

// Individual Statistic Card Component
const StatisticCard = ({ 
  stat, 
  variant = 'default' 
}: { 
  stat: StatisticsAchievement; 
  variant?: 'default' | 'banner' | 'compact' 
}) => {
  // Dynamically get the icon component
  const IconComponent = (LucideIcons as any)[stat.icon_name] || LucideIcons.Star;

  if (variant === 'banner') {
    return (
      <div className="flex items-center gap-3 text-white">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: stat.background_color || '#3B82F6' }}
        >
          <IconComponent className="w-4 h-4" style={{ color: stat.icon_color || '#FFFFFF' }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{stat.value}</span>
          <span className="font-medium">{stat.title}</span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="text-center group">
        <div className="relative mb-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-500"
            style={{ backgroundColor: stat.background_color || '#3B82F6' }}
            onMouseEnter={(e) => {
              if (stat.hover_color) {
                e.currentTarget.style.backgroundColor = stat.hover_color;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = stat.background_color || '#3B82F6';
            }}
          >
            <IconComponent className="w-8 h-8" style={{ color: stat.icon_color || '#FFFFFF' }} />
          </div>
          <div 
            className="absolute inset-0 w-16 h-16 rounded-2xl mx-auto opacity-20 group-hover:scale-125 transition-transform duration-700"
            style={{ backgroundColor: stat.background_color || '#3B82F6' }}
          ></div>
        </div>
        <div 
          className="font-heading text-4xl font-bold mb-2 bg-clip-text text-transparent"
          style={{ 
            backgroundImage: `linear-gradient(135deg, ${stat.background_color || '#3B82F6'}, ${stat.hover_color || '#2563EB'})` 
          }}
        >
          {stat.value}
        </div>
        <div className="font-body text-gray-600 font-medium">{stat.description}</div>
        <div 
          className="w-16 h-1 rounded-full mx-auto mt-4 group-hover:w-24 transition-all duration-500"
          style={{ backgroundColor: stat.background_color || '#3B82F6' }}
        ></div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
          style={{ backgroundColor: stat.background_color || '#3B82F6' }}
        >
          <IconComponent className="w-8 h-8" style={{ color: stat.icon_color || '#FFFFFF' }} />
        </div>
        <div>
          <div 
            className="text-3xl font-bold mb-1"
            style={{ color: stat.background_color || '#3B82F6' }}
          >
            {stat.value}
          </div>
          <div className="text-gray-700 font-semibold">{stat.title}</div>
          <div className="text-gray-600 text-sm">{stat.description}</div>
        </div>
      </div>
    </div>
  );
};

// Banner Statistics Component (for the purple banner)
export const BannerStatistics = () => {
  const [stats, setStats] = useState<StatisticsAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const service = new StatisticsDataService();
        const bannerStats = await service.fetchStatisticsByCategory('banner');
        setStats(bannerStats);
      } catch (error) {
        console.error('Error loading banner statistics:', error);
        // Fallback data
        setStats([
          {
            id: '1',
            title: 'Certified Teachers',
            value: '✓',
            description: 'Qualified instructors',
            icon_name: 'CheckCircle',
            icon_color: '#10B981',
            background_color: '#059669',
            hover_color: '#047857',
            category: 'banner',
            order_index: 1,
            active: true,
            created_at: ''
          },
          {
            id: '2',
            title: 'Students',
            value: '1000+',
            description: 'Active learners',
            icon_name: 'Users',
                        icon_color: '#3B82F6',
            background_color: '#2563EB',
            hover_color: '#1D4ED8',
            category: 'banner',
            order_index: 2,
            active: true,
            created_at: ''
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
              <div className="h-6 bg-white/20 rounded w-32 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-8 flex-wrap">
        {stats.map((stat) => (
          <StatisticCard key={stat.id} stat={stat} variant="banner" />
        ))}
      </div>
    </div>
  );
};

// Main Statistics Component (for the 4-column layout)
export const MainStatistics = ({ variant = 'default' }: { variant?: 'default' | 'compact' | 'inline' }) => {
  const [stats, setStats] = useState<StatisticsAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const service = new StatisticsDataService();
        const mainStats = await service.fetchStatisticsByCategory('main');
        setStats(mainStats);
      } catch (error) {
        console.error('Error loading main statistics:', error);
        // Fallback data
        setStats([
          {
            id: '1',
            title: 'Active Students',
            value: '1000+',
            description: 'Active Students',
            icon_name: 'Users',
            icon_color: '#FFFFFF',
            background_color: '#3B82F6',
            hover_color: '#2563EB',
            category: 'main',
            order_index: 1,
            active: true,
            created_at: ''
          },
          {
            id: '2',
            title: 'Expert Teachers',
            value: '50+',
            description: 'Expert Teachers',
            icon_name: 'GraduationCap',
            icon_color: '#FFFFFF',
            background_color: '#3B82F6',
            hover_color: '#2563EB',
            category: 'main',
            order_index: 2,
            active: true,
            created_at: ''
          },
          {
            id: '3',
            title: 'Course Categories',
            value: '4',
            description: 'Course Categories',
            icon_name: 'BookOpen',
            icon_color: '#FFFFFF',
            background_color: '#3B82F6',
            hover_color: '#2563EB',
            category: 'main',
            order_index: 3,
            active: true,
            created_at: ''
          },
          {
            id: '4',
            title: 'Support Available',
            value: '24/7',
            description: 'Support Available',
            icon_name: 'Globe',
            icon_color: '#FFFFFF',
            background_color: '#3B82F6',
            hover_color: '#2563EB',
            category: 'main',
            order_index: 4,
            active: true,
            created_at: ''
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-16 mx-auto mb-1 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  // Inline variant (matches your current style)
  if (variant === 'inline') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {stats.map((stat, index) => {
          const IconComponent = (LucideIcons as any)[stat.icon_name] || LucideIcons.Star;
          
          return (
            <div key={stat.id} className="text-center group">
              <div 
                className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ 
                  background: `linear-gradient(135deg, ${stat.background_color}, ${stat.hover_color})` 
                }}
              >
                <IconComponent className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="font-heading text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="font-body text-gray-600 text-sm">
                {stat.description}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = (LucideIcons as any)[stat.icon_name] || LucideIcons.Star;
          
          return (
            <div key={stat.id} className="text-center group">
              <div className="relative mb-6">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundColor: stat.background_color }}
                >
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                <div 
                  className="absolute inset-0 w-20 h-20 rounded-2xl mx-auto opacity-20 group-hover:scale-125 transition-transform duration-700"
                  style={{ backgroundColor: stat.background_color }}
                ></div>
              </div>
              <div 
                className="font-heading text-5xl font-bold mb-2 bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${stat.background_color}, ${stat.hover_color})` 
                }}
              >
                {stat.value}
              </div>
              <div className="font-body text-lg text-gray-600 font-medium">{stat.description}</div>
              <div 
                className="w-16 h-1 rounded-full mx-auto mt-4 group-hover:w-24 transition-all duration-500"
                style={{ backgroundColor: stat.background_color }}
              ></div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default variant - full section
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-blue-100/30 via-indigo-50/20 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-r from-purple-100/20 to-pink-50/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = (LucideIcons as any)[stat.icon_name] || LucideIcons.Star;
            
            return (
              <div
                key={stat.id}
                className="text-center group opacity-0 animate-fadeInUp"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="relative mb-6">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundColor: stat.background_color }}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <div 
                    className="absolute inset-0 w-20 h-20 rounded-2xl mx-auto opacity-20 group-hover:scale-125 transition-transform duration-700"
                    style={{ backgroundColor: stat.background_color }}
                  ></div>
                </div>
                <div 
                  className="font-heading text-5xl font-bold mb-2 bg-clip-text text-transparent"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${stat.background_color}, ${stat.hover_color})` 
                  }}
                >
                  {stat.value}
                </div>
                <div className="font-body text-lg text-gray-600 font-medium">{stat.description}</div>
                <div 
                  className="w-16 h-1 rounded-full mx-auto mt-4 group-hover:w-24 transition-all duration-500"
                  style={{ backgroundColor: stat.background_color }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </section>
  );
};

// Review Statistics Component (for the 3-column layout in your reviews section)
export const ReviewStatistics = ({ className = '' }: { className?: string }) => {
  const [stats, setStats] = useState<StatisticsAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const service = new StatisticsDataService();
        const reviewStats = await service.fetchStatisticsByCategory('reviews');
        setStats(reviewStats);
      } catch (error) {
        console.error('Error loading review statistics:', error);
        // Fallback data
        setStats([
          {
            id: '1',
            title: 'Happy Students',
            value: '5+',
            description: 'Satisfied learners',
            icon_name: 'Users',
            icon_color: '#FFFFFF',
            background_color: '#3B82F6',
            hover_color: '#2563EB',
            category: 'reviews',
            order_index: 1,
            active: true,
            created_at: ''
          },
          {
            id: '2',
            title: 'Average Rating',
            value: '4.9',
            description: 'Student feedback score',
            icon_name: 'Star',
            icon_color: '#FFFFFF',
            background_color: '#F59E0B',
            hover_color: '#D97706',
            category: 'reviews',
            order_index: 2,
            active: true,
            created_at: ''
          },
          {
            id: '3',
            title: 'Satisfaction Rate',
            value: '98%',
            description: 'Student satisfaction',
            icon_name: 'TrendingUp',
            icon_color: '#FFFFFF',
            background_color: '#10B981',
            hover_color: '#059669',
            category: 'reviews',
            order_index: 3,
            active: true,
            created_at: ''
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 md:gap-12 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl sm:rounded-2xl mx-auto mb-4 sm:mb-6 animate-pulse"></div>
            <div className="h-8 sm:h-12 bg-gray-200 rounded w-16 mx-auto mb-1 sm:mb-2 animate-pulse"></div>
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 md:gap-12 ${className}`}>
      {stats.map((stat, index) => (
        <div key={stat.id} className="text-center group">
          <div className="relative mb-4 sm:mb-6">
            <div 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-500"
              style={{ backgroundColor: stat.background_color }}
              onMouseEnter={(e) => {
                if (stat.hover_color) {
                  e.currentTarget.style.backgroundColor = stat.hover_color;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = stat.background_color || '#3B82F6';
              }}
            >
              {stat.icon_name === 'Star' ? (
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => {
                    const StarIcon = (LucideIcons as any).Star;
                    return (
                      <StarIcon 
                        key={i} 
                        className="w-2.5 h-2.5 sm:w-2 sm:h-2 text-white fill-current group-hover:scale-110 transition-transform duration-300" 
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    );
                  })}
                </div>
              ) : (
                (() => {
                  const IconComponent = (LucideIcons as any)[stat.icon_name] || (LucideIcons as any).Star;
                  return <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: stat.icon_color }} />;
                })()
              )}
            </div>
            <div 
              className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl mx-auto opacity-20 group-hover:scale-125 transition-transform duration-700"
              style={{ backgroundColor: stat.background_color }}
            ></div>
          </div>
          <div 
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 bg-clip-text text-transparent"
            style={{ 
              backgroundImage: `linear-gradient(135deg, ${stat.background_color}, ${stat.hover_color || stat.background_color})` 
            }}
          >
            {stat.value}
          </div>
          <div className="font-body text-base sm:text-lg text-gray-600 font-medium">{stat.description}</div>
          <div 
            className="w-12 sm:w-16 h-1 rounded-full mx-auto mt-3 sm:mt-4 group-hover:w-20 sm:group-hover:w-24 transition-all duration-500"
            style={{ backgroundColor: stat.background_color }}
          ></div>
        </div>
      ))}
    </div>
  );
};

// All Statistics Component (fetches all categories)
export const AllStatistics = () => {
  const [allStats, setAllStats] = useState<Record<string, StatisticsAchievement[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllStats = async () => {
      try {
        const service = new StatisticsDataService();
        const stats = await service.fetchAllStatistics();
        setAllStats(stats);
      } catch (error) {
        console.error('Error loading all statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading statistics...</div>;
  }

  return (
    <div className="space-y-16">
      {/* Banner Statistics */}
      {allStats.banner && (
        <div>
          <h3 className="text-2xl font-bold mb-6">Banner Statistics</h3>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-4 rounded-2xl">
            <div className="flex justify-center items-center gap-8 flex-wrap">
              {allStats.banner.map((stat) => (
                <StatisticCard key={stat.id} stat={stat} variant="banner" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Statistics */}
      {allStats.main && (
        <div>
          <h3 className="text-2xl font-bold mb-6">Main Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allStats.main.map((stat) => (
              <StatisticCard key={stat.id} stat={stat} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {/* Review Statistics */}
      {allStats.reviews && (
        <div>
          <h3 className="text-2xl font-bold mb-6">Review Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {allStats.reviews.map((stat) => (
              <StatisticCard key={stat.id} stat={stat} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {/* Any other categories */}
      {Object.entries(allStats).map(([category, stats]) => {
        if (['banner', 'main', 'reviews'].includes(category)) return null;
        
        return (
          <div key={category}>
            <h3 className="text-2xl font-bold mb-6 capitalize">{category} Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat) => (
                <StatisticCard key={stat.id} stat={stat} variant="default" />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Add the CSS animations
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}