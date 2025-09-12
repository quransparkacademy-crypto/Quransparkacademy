export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  image_alt: string;
  button_text: string;
  button_link: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseOutline {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  active: boolean;
  created_at: string;
}

export interface CoursesSection {
  id: string;
  section_title: string;
  section_subtitle?: string;
  divider_image_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}