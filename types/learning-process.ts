export interface LearningProcessSection {
  id: string;
  title: string;
  subtitle: string;
  divider_image_url?: string;
  cta_button_text: string;
  cta_button_link: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  image_url: string;
  image_alt: string;
  step_number: number;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}