export interface StudentsReviewsSection {
  id: string;
  section_title: string;
  section_subtitle?: string;
  divider_image_url: string;
  cta_button_text: string;
  cta_button_link: string;
  footer_frame_image_url: string;
  logo_url: string;
  logo_alt: string;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ReviewImage {
  id: string;
  title: string;
  image_url: string;
  image_alt: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface FooterNavigationItem {
  id: string;
  label: string;
  href: string;
  is_external: boolean;
  order_index: number;
  active: boolean;
  created_at: string;
}

// Add this interface to your existing types
export interface SocialMediaIcon {
  id: string;
  name: string;
  icon_url: string;
  link_url: string;
  icon_color?: string;
  hover_color?: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

// Add to your @/types/student-reviews.ts file
export interface StatisticsAchievement {
  id: string;
  title: string;
  value: string;
  description: string;
  icon_name: string;
  icon_color?: string;
  background_color?: string;
  hover_color?: string;
  category: 'banner' | 'main' | 'reviews' | 'general';
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

// You can also create separate interfaces for different categories if needed
export interface BannerStatistic extends StatisticsAchievement {
  category: 'banner';
}

export interface MainStatistic extends StatisticsAchievement {
  category: 'main';
}

export interface ReviewStatistic extends StatisticsAchievement {
  category: 'reviews';
}