'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { VisionMissionContent } from '@/types/vision';

export default function VisionMissionSectionSimple() {
  const [visionData, setVisionData] = useState<VisionMissionContent | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchVisionData() {
      try {
        const { data, error } = await supabase
          .from('vision_mission_content')
          .select('*')
          .eq('active', true)
          .single();

        if (error) throw error;
        setVisionData(data);
      } catch (error) {
        console.error('Error fetching vision data:', error);
        setVisionData({
          id: '1',
          title: 'Vision & Mission',
          vision_text: 'Our vision and mission is to assist as many people as possible, regardless of age, in learning and mastering the recitation of the Holy Quran worldwide, using the most effective methods with experienced teachers.',
          background_image_url: '/images/vision-bg.jpg',
          divider_image_url: '/images/islamic-divider.svg',
          active: true,
          created_at: '',
          updated_at: ''
        });
      } finally {
        setLoading(false);
      }
    }

    fetchVisionData();
  }, [supabase]);

  if (loading) return null;
  if (!visionData) return null;

  return (
    <section id='Vision_Mission' className="relative py-20 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-gray-900/80 to-slate-900/85 z-10"></div>
        <Image
          src={visionData.background_image_url}
          alt="Vision Background"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
        <div className="space-y-8">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
            <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
              {visionData.title}
            </span>
          </h2>

          {/* Divider */}
          <div className="flex justify-center py-6">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12">
            <p className="font-body text-xl md:text-2xl text-white leading-relaxed">
              <strong>{visionData.vision_text}</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}