export interface NavbarData {
  id: string;
  logo_url: string;
  logo_alt: string;
  encouraging_words: string;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order_index: number;
  is_external: boolean;
  icon?: string;
  created_at: string;
}