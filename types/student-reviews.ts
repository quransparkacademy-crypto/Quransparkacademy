export interface StudentsReviewsSection {
  id: string;
  section_title: string;
  section_subtitle?: string;
  divider_image_url?: string;
  cta_button_text: string;
  cta_button_link: string;
  footer_frame_image_url: string;
  logo_url: string;
  logo_alt: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewImage {
  id: string;
  title: string;
  image_url: string;
  image_alt: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
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