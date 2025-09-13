'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { NavbarData, NavigationItem } from '@/types/navbar';
import { Menu, X, Mail, Phone, MessageCircle, User } from 'lucide-react';

export default function Navbar() {
  const [navbarData, setNavbarData] = useState<NavbarData | null>(null);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchNavbarData() {
      try {
        // Fetch navbar data
        const { data: navbar, error: navbarError } = await supabase
          .from('navbar_settings')
          .select('*')
          .eq('active', true)
          .single();

        if (navbarError) throw navbarError;

        // Fetch navigation items
        const { data: navigation, error: navigationError } = await supabase
          .from('navigation_items')
          .select('*')
          .eq('active', true)
          .order('order_index', { ascending: true });

        if (navigationError) throw navigationError;

        setNavbarData(navbar);
        setNavigationItems(navigation || []);
      } catch (error) {
        console.error('Error fetching navbar data:', error);
        // Fallback data
        setNavbarData({
          id: '1',
          logo_url: '/images/logo.png',
          logo_alt: 'Qarabic Academy',
          email: 'info@qarabic.com',
          phone: '+1 (309) 377-5300',
          whatsapp: '+1 (309) 377-5300',
          created_at: '',
          updated_at: ''
        });
        setNavigationItems([
          { id: '1', label: 'Why Us', href: '#why_us', order_index: 1, is_external: false, created_at: '' },
          { id: '2', label: 'Courses', href: '#courses', order_index: 2, is_external: false, created_at: '' },
          { id: '3', label: 'Reviews', href: '#reviews', order_index: 3, is_external: false, created_at: '' },
          { id: '4', label: 'Get Free Trial', href: '/free-trial', order_index: 4, is_external: false, created_at: '' },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchNavbarData();
  }, [supabase]);

  // Add smooth scrolling functionality
  useEffect(() => {
    // Add smooth scrolling to the document
    document.documentElement.style.scrollBehavior = 'smooth';

    // Observer for active section highlighting
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Adjust these values to change when sections become "active"
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections that have IDs matching navigation hrefs
    const sections = navigationItems
      .filter(item => item.href.startsWith('#'))
      .map(item => document.getElementById(item.href.substring(1)))
      .filter(Boolean);

    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      observer.disconnect();
      // Reset scroll behavior
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [navigationItems]);

  // Handle smooth scrolling with offset for sticky navbar
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle anchor links (internal links starting with #)
    if (!href.startsWith('#')) return;

    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Calculate offset to account for sticky navbar height
      const navbarHeight = 120; // Approximate height of both contact bar and main nav
      const elementPosition = targetElement.offsetTop - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      setIsMenuOpen(false);
    }
  };

  // Check if a navigation item is active
  const isActiveNavItem = (href: string) => {
    if (href.startsWith('#')) {
      const sectionId = href.substring(1);
      return activeSection === sectionId;
    }
    return false;
  };

  if (loading) return null;
  if (!navbarData) return null;

  return (
    <header className="relative w-full z-50">
      {/* Top Contact Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center py-3 space-y-2 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm">
              {/* Email */}
              <a 
                href={`mailto:${navbarData.email}`}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 font-body group"
              >
                <Mail className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                <span>{navbarData.email}</span>
              </a>

              {/* Phone */}
              <a 
                href={`tel:${navbarData.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 font-body group"
              >
                <Phone className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                <span>{navbarData.phone}</span>
              </a>

              {/* WhatsApp */}
              <a 
                href={`https://wa.me/${navbarData.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors duration-300 font-body group"
              >
                <MessageCircle className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                <span>{navbarData.whatsapp}</span>
              </a>
            </div>

            {/* Student Login */}
            <Link 
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 text-sm font-body group"
              style={{ color: 'var(--color-accent)' }}
            >
              <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span>Student Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="relative h-16 w-48 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={navbarData.logo_url}
                  alt={navbarData.logo_alt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  target={item.is_external ? '_blank' : '_self'}
                  rel={item.is_external ? 'noopener noreferrer' : ''}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className={`relative group font-body font-medium transition-all duration-300 py-2 px-3 rounded-lg ${
                    isActiveNavItem(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ${
                    isActiveNavItem(item.href) ? 'w-8' : 'w-0 group-hover:w-8'
                  }`}></span>
                </Link>
              ))}
              
              {/* CTA Button */}
              <Link
                href="#"
                className="inline-flex items-center px-4 py-2 rounded font-body font-semibold text-white hover:scale-105 transition-transform duration-200"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 group"
              aria-label="Toggle navigation menu"
            >
              <div className="relative w-6 h-6">
                <X className={`w-6 h-6 absolute transition-all duration-300 ${
                  isMenuOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                }`} />
                <Menu className={`w-6 h-6 absolute transition-all duration-300 ${
                  isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                }`} />
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}>
            <div className="py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    target={item.is_external ? '_blank' : '_self'}
                    rel={item.is_external ? 'noopener noreferrer' : ''}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className={`px-4 py-3 font-body font-medium transition-all duration-300 rounded-lg mx-2 ${
                      isActiveNavItem(item.href)
                        ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-500'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Mobile CTA Button */}
                <Link
                  href="/free-trial"
                  className="mx-4 mt-4 px-6 py-3 text-center rounded-full font-body font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}