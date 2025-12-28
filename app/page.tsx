'use client';

import { useState, useEffect, useRef } from 'react';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import AboutContent from './components/AboutContent';

export default function Home() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStable, setIsStable] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setIsStable(true);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    // Trigger entry animations only after stability
    const timer = setTimeout(() => setIsLoaded(true), 150);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAboutOpen) {
        setIsAboutOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isAboutOpen]);

  // Lock background scroll when About is open
  useEffect(() => {
    if (isAboutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isAboutOpen]);

  // Adjust header opacity based on scroll
  const updateHeaderOpacity = (scrollTop: number) => {
    if (!headerRef.current) return;
    // Fade out from 0 to 100px
    const opacity = Math.max(0, 1 - scrollTop / 100);
    headerRef.current.style.opacity = opacity.toString();
  };

  const handleAboutScroll = (scrollTop: number) => {
    updateHeaderOpacity(scrollTop);
  };

  // Handle Mobile/Window scroll for Gallery view
  useEffect(() => {
    const handleWindowScroll = () => {
      if (!isAboutOpen) {
        updateHeaderOpacity(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    // Initialize opacity on mount/stable
    if (isStable && !isAboutOpen) {
      updateHeaderOpacity(window.scrollY);
    }
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [isAboutOpen, isStable]);

  // Sync opacity when toggling About
  useEffect(() => {
    if (isAboutOpen) {
      // Allow a frame for layout? Usually safe to set immediately if overlay is open
      updateHeaderOpacity(0);
      document.title = "Paravela / About";
    } else {
      updateHeaderOpacity(window.scrollY);
      document.title = "Paravela";
    }
  }, [isAboutOpen]);

  return (
    <div className={`relative w-full ${isMobile ? 'min-h-[100dvh]' : 'h-screen overflow-hidden'} font-sans bg-zinc-50`}>
      {/* State 1: Gallery (Mobile & Desktop) */}
      <main
        className={`w-full ${isMobile ? 'h-auto touch-pan-y' : 'h-full'} ${isMobile ? '' : 'no-scrollbar'}`}
        style={{
          paddingBottom: isMobile ? '0' : '120px',
          // Force 'transform: none' on mobile when stable to release stacking context, allowing z-index to work
          transform: isStable
            ? (!isLoaded
              ? (isMobile ? 'translateY(80px)' : 'translateX(80px)')
              : 'none')
            : 'translateY(80px)', // Default to Y (vertical) for initial/server render to avoid mobile Horizontal slide and hydration mismatch
          opacity: isLoaded ? 1 : 0,
          transition: isStable && isLoaded
            ? 'transform 800ms cubic-bezier(0.73, -0.01, 0.34, 1) 500ms, opacity 600ms cubic-bezier(0.75, -0.01, 0.25, 1) 500ms'
            : 'none',
          pointerEvents: isMobile && isAboutOpen ? 'none' : 'auto',
          // Ensure main doesn't trap fixed children if we had any, but here we invoke z-index on children
          position: 'relative'
        }}
      >
        <Carousel isLoaded={isLoaded} />
      </main>

      {/* State 2: About Overlay (Mobile & Desktop) */}
      <AboutContent
        isVisible={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        isMobile={isMobile}
        onScroll={handleAboutScroll}
      />

      {/* Global Elements (Header, Footer) - Always on Top */}
      <div className={`fixed inset-0 pointer-events-none z-[60] transition-colors duration-[750ms] ${isAboutOpen && !isMobile ? 'text-white' : 'text-black'}`}>

        {/* Mobile Header (Fixed & on Top) */}
        {isMobile && (
          <div className={`md:hidden absolute top-0 left-0 w-full pointer-events-auto transition-colors duration-[750ms] ${isAboutOpen ? 'text-white' : 'text-black'}`}>
            <Footer
              isAboutOpen={isAboutOpen}
              onToggleAbout={() => setIsAboutOpen(!isAboutOpen)}
              isLoaded={isLoaded}
              isMobile={true}
              headerRef={headerRef}
            />
          </div>
        )}

        {/* Desktop Footer (Hidden on Mobile via Footer's internal class) */}
        {!isMobile && (
          <div className="absolute inset-0 pointer-events-none">
            <Footer
              isAboutOpen={isAboutOpen}
              onToggleAbout={() => setIsAboutOpen(!isAboutOpen)}
              isLoaded={isLoaded}
              headerRef={headerRef}
            />
          </div>
        )}
      </div>
    </div>
  );
}
