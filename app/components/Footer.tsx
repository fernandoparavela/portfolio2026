import { useRef, useState, useEffect } from 'react';

interface FooterProps {
    isAboutOpen: boolean;
    onToggleAbout: () => void;
    isLoaded?: boolean;
    isMobile?: boolean; // Added isMobile prop
    headerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function Footer({ isAboutOpen, onToggleAbout, isLoaded = true, isMobile = false, headerRef }: FooterProps) {
    const footerRef = useRef<HTMLElement>(null);
    const [footerHeight, setFooterHeight] = useState(0);

    useEffect(() => {
        if (!footerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setFooterHeight(entry.borderBoxSize[0].blockSize);
            }
        });

        observer.observe(footerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <footer
            ref={footerRef}
            className={`${isMobile ? 'absolute top-0' : 'fixed bottom-0 hidden md:block'} left-0 w-full z-40 transition-all ease-in-out pointer-events-none ${isMobile ? 'p-10' : 'p-6 md:p-12'}`}
            style={{
                transform: !isLoaded
                    ? 'translateY(80px)'
                    : isAboutOpen
                        ? (isMobile ? 'none' : `translateY(calc(-100vh + ${footerHeight}px))`)
                        : 'translateY(0)',
                color: isAboutOpen ? '#fff' : '#000',
                opacity: isLoaded ? 1 : 0,
                transitionTimingFunction: 'cubic-bezier(0.75, -0.01, 0.25, 1)',
                transitionDuration: !isLoaded ? '300ms' : '750ms'
            }}
        >
            <div className={`flex ${isMobile ? 'items-start justify-between' : 'items-end'} w-full pointer-events-auto text-[var(--fs-16)] transition-colors duration-300`}>
                <div ref={headerRef} className={`flex flex-col md:flex-row w-full md:w-[91.66%]`}>
                    {/* First 50% Wrapper (Now part of group) */}
                    <div className={`flex flex-col ${isMobile ? 'w-auto' : 'md:flex-row md:w-[54.54%] items-end'}`}>
                        <div
                            className={`flex flex-col w-auto`}
                            style={isMobile ? {
                                color: isAboutOpen ? '#ffffff' : '#000000',
                                transition: 'color 300ms ease-in-out'
                            } : undefined}
                        >
                            <span className="font-medium">Fernando Paravela</span>
                            <span className="font-normal">Experience Design Director</span>
                        </div>

                        {isMobile && (
                            <button
                                onClick={onToggleAbout}
                                className={`custom-link text-left mt-6 font-normal text-[var(--fs-16)] w-fit transition-opacity duration-300 ${isAboutOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                                style={{ color: '#000000' }}
                            >
                                About
                            </button>
                        )}

                        <div className={`flex flex-col ${isMobile ? 'hidden' : 'hidden min-[1080px]:flex w-auto mx-auto'}`}>
                            <span className="font-medium">20+ years of design</span>
                            <span className="font-normal">Itaú, Work & Co, Accenture Song, VML</span>
                        </div>
                    </div>

                    <div className={`flex flex-col ${isMobile ? 'hidden' : 'flex md:w-[45.45%]'}`}>
                        {/* Content for 768px - 1080px (Swapped from Col 2) */}
                        <div className="flex flex-col min-[1080px]:hidden">
                            <span className="font-medium">20+ years of design</span>
                            <span className="font-normal">Itaú, Work & Co, Accenture Song, VML</span>
                        </div>

                        {/* Content for >= 1080px (Original Col 3) */}
                        <div className="hidden min-[1080px]:flex flex-col">
                            <span className="font-medium">Recognition</span>
                            <span className="font-normal">iF, Red Dot, Webby Awards, and others</span>
                        </div>
                    </div>
                </div>

                <div className={`${(isMobile && !isAboutOpen) ? 'hidden' : 'flex'} flex-col ${isMobile ? 'w-auto' : 'md:w-[8.33%]'} ${(isMobile && isAboutOpen) ? 'absolute top-[32px] right-[24px]' : 'items-end self-center'}`}>
                    <button
                        onClick={onToggleAbout}
                        className={`outline-none transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 cursor-pointer block`}
                        style={{
                            transform: isAboutOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                            filter: isAboutOpen ? 'brightness(0) invert(1)' : 'none' // To make the black icon white
                        }}
                    >
                        <img src="/plus-close.svg" alt="Toggle About" className="w-[40px] h-[40px]" />
                    </button>
                </div>
            </div>
        </footer>
    );
}