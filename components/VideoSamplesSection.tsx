'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { VideoSamplesSection as VideoSectionType, VideoSample } from '@/types/video-samples';
import { Play, Clock, Video, ChevronDown, CheckCircle } from 'lucide-react';

export default function VideoSamplesSection() {
  const [sectionData, setSectionData] = useState<VideoSectionType | null>(null);
  const [videos, setVideos] = useState<VideoSample[]>([]);
  const [activeVideo, setActiveVideo] = useState<string>('');
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchVideoData() {
      try {
        // Fetch section data
        const { data: section, error: sectionError } = await supabase
          .from('video_samples_section')
          .select('*')
          .eq('active', true)
          .single();

        if (sectionError) throw sectionError;

        // Fetch videos
        const { data: videosData, error: videosError } = await supabase
          .from('video_samples')
          .select('*')
          .eq('active', true)
          .order('order_index', { ascending: true });

        if (videosError) throw videosError;

        setSectionData(section);
        setVideos(videosData || []);
        setActiveVideo(videosData?.[0]?.id || '');

      } catch (error) {
        console.error('Error fetching video data:', error);
        // Fallback data
        setSectionData({
          id: '1',
          section_title: 'Samples of Explanation',
          section_subtitle: 'Watch our expert teachers demonstrate proper Quran recitation and Arabic pronunciation techniques',
          playlist_title: 'See More',
          cta_button_text: 'Join Us Now',
          cta_button_link: '/free-trial',
          active: true,
          created_at: '',
          updated_at: ''
        });

        const fallbackVideos = [
          {
            id: '1',
            title: 'Common Mistake In Surah Al-Ikhlas',
            description: 'Learn to avoid common pronunciation mistakes',
            youtube_url: 'https://www.youtube.com/watch?v=sAV5AcKVEkQ',
            duration: '1:33',
            thumbnail_url: '/images/video-thumb-1.jpg',
            thumbnail_alt: 'Surah Al-Ikhlas lesson',
            order_index: 1,
            active: true,
            created_at: '',
            updated_at: ''
          },
          {
            id: '2',
            title: 'Recitation of Surah Al-Ikhlas with proper Tajweed',
            description: 'Master the correct Tajweed rules',
            youtube_url: 'https://www.youtube.com/watch?v=tDB9zQ0lkvk',
            duration: '1:33',
            thumbnail_url: '/images/video-thumb-2.jpg',
            thumbnail_alt: 'Tajweed lesson',
            order_index: 2,
            active: true,
            created_at: '',
            updated_at: ''
          }
        ];

        setVideos(fallbackVideos);
        setActiveVideo('1');
      } finally {
        setLoading(false);
      }
    }

    fetchVideoData();
  }, [supabase]);

  const currentVideo = videos.find(video => video.id === activeVideo);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}?rel=0&showinfo=0&modestbranding=1` : '';
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-1/3 mx-auto mb-16"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 aspect-video bg-gray-300 rounded-2xl"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-20 h-14 bg-gray-300 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!sectionData) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-100/30 to-pink-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
            <Video className="w-5 h-5 text-purple-600" />
            <span className="text-purple-800 font-body font-medium text-sm">Learning Examples</span>
          </div> */}

          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent">
              {sectionData.section_title}
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

          {sectionData.section_subtitle && (
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {sectionData.section_subtitle}
            </p>
          )}
        </div>

        {/* Video Player Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-3 gap-0">
            
            {/* Main Video Player */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="aspect-video bg-gray-900 rounded-l-3xl overflow-hidden relative">
                {currentVideo && (
                  <iframe
                    src={getYouTubeEmbedUrl(currentVideo.youtube_url)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentVideo.title}
                  />
                )}
                
                {/* Video Info Overlay */}
                {currentVideo && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="font-heading text-xl font-bold text-white mb-2">
                      {currentVideo.title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/80">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{currentVideo.duration}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Playlist Sidebar */}
            <div className="order-1 lg:order-2 bg-gray-50 lg:rounded-r-3xl">
              <div className="p-6">
                
                {/* Playlist Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-gray-900">
                      {sectionData.playlist_title}
                    </h3>
                    <p className="text-sm text-gray-600 font-body">
                      {videos.length} Videos
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className="lg:hidden p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showPlaylist ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Video List */}
                <div className={`space-y-3 ${!showPlaylist ? 'hidden lg:block' : ''}`}>
                  <div className="max-h-96 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300">
                    {videos.map((video, index) => (
                      <button
                        key={video.id}
                        onClick={() => setActiveVideo(video.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-300 text-left group ${
                          activeVideo === video.id
                            ? 'bg-blue-100 border-2 border-blue-300'
                            : 'bg-white hover:bg-gray-100 border-2 border-transparent hover:border-gray-200'
                        }`}
                      >
                        {/* Video Thumbnail */}
                        <div className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden">
                          <Image
                            src={video.thumbnail_url}
                            alt={video.thumbnail_alt}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            {activeVideo === video.id ? (
                              <CheckCircle className="w-6 h-6 text-blue-500" />
                            ) : (
                              <Play className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" />
                            )}
                          </div>
                          
                          {/* Duration Badge */}
                          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                            {video.duration}
                          </div>
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-body font-semibold text-sm leading-tight mb-1 line-clamp-2 ${
                            activeVideo === video.id ? 'text-blue-800' : 'text-gray-900'
                          }`}>
                            {video.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Video {index + 1}</span>
                            <span>•</span>
                            <span>{video.duration}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link
            href={sectionData.cta_button_link}
            className="group relative inline-flex items-center gap-3 px-6 py-2 bg-[var(--color-accent)] text-white font-body font-semibold text-lg rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Play className="w-5 h-5 ml-0.5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10">{sectionData.cta_button_text}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <p className="mt-4 text-sm text-gray-600 font-body">
            Start your free trial and access our complete video library
          </p>
        </div>
      </div>
    </section>
  );
}