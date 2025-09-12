export interface VideoSamplesSection {
  id: string;
  section_title: string;
  section_subtitle?: string;
  playlist_title: string;
  cta_button_text: string;
  cta_button_link: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VideoSample {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  duration: string;
  thumbnail_url: string;
  thumbnail_alt: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}